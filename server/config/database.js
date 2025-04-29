const mongoose = require('mongoose')

const databaseConnection = () => {
    mongoose.connect(process.env.MONGODB_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then((data)=>{
        console.log(`Database connected successfully at server ${data.connection.host}`)
    }).catch((error) => {
        console.error('Database connection error:', error)
        process.exit(1)
    })
}

module.exports = databaseConnection