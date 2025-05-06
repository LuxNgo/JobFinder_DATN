const app = require('./app')
const databaseConnection = require('./config/database')
const cloudinary  = require('cloudinary')
const dotenv = require('dotenv')

// Load environment variables first
dotenv.config({ path: './.env' })

// Configure Cloudinary first
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

try {
    console.log('Environment variables loaded successfully');
    console.log('Environment Variables:', {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        MONGODB_URI: process.env.MONGODB_URI,
        CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
        CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
        CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
    });

    // Test Cloudinary connection
    try {
        cloudinary.v2.api.resource('sample', (err, result) => {
            if (err) {
                console.error('Cloudinary connection test failed:', err);
                throw new Error('Cloudinary configuration failed');
            } else {
                console.log('Cloudinary connection test successful');
            }
        });
    } catch (err) {
        console.error('Cloudinary connection test failed:', err);
        throw new Error('Cloudinary configuration failed');
    }

    // Connect to database
    databaseConnection();
    console.log('Database connection successful');

    // Start server
    const PORT = process.env.PORT || 3000;

    const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    // Handle server errors
    server.on('error', (error) => {
        console.error('Server error:', error);
        process.exit(1);
    });

    // Handle unhandled rejections
    process.on('unhandledRejection', (error) => {
        console.error('Unhandled rejection:', error);
        server.close(() => {
            process.exit(1);
        });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
        console.error('Uncaught exception:', error);
        server.close(() => {
            process.exit(1);
        });
    });

} catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
}