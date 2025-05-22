const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");

dotenv.config({ path: "./.env" });

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(
  cors({
    origin: "https://job-finder-frontend.vercel.app",
    credentials: true,
  })
);

app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    useTempFiles: true,
    tempFileDir: "/tmp/",
    createParentPath: true,
  })
);

const User = require("./routes/UserRoutes");
const Job = require("./routes/JobRoutes");
const Application = require("./routes/ApplicationRoutes");
const Admin = require("./routes/AdminRoutes");
const CV = require("./routes/CVRoutes");
const Stats = require("./routes/StatsRoutes");
const Recruiter = require("./routes/RecruiterRoutes");
const { errorMiddleware } = require("./middlewares/error");

app.use("/api/v1", User);
app.use("/api/v1", Job);
app.use("/api/v1", Application);
app.use("/api/v1", Admin);
app.use("/api/v1", CV);
app.use("/api/v1", Stats);
app.use("/api/v1", Recruiter);

app.get("/", (req, res) => {
  res.json("I am working");
});

//for any unwanted error
app.use(errorMiddleware);

module.exports = app;
