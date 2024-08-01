const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
var cors = require("cors");

// import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobTypeRoute = require("./routes/jobTypeRoutes");
const jobRoute = require("./routes/jobsRoutes");
const companyRoute = require("./routes/companyRoutes");

const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");

//database connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

// mongoose
// .connect('mongodb://127.0.0.1:27017/jobportaldb')
// .then((x) => {
//   console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
// })
// .catch((err) => {
//   console.error('Error connecting to mongo', err.reason)
// })
app.use(
  [
    "/uploads/companyLogo/",
    "/job/uploads/companyLogo/",
    "/admin/uploads/companyLogo/",
    "/company/uploads/companyLogo/",
    "/search/uploads/companyLogo/",
    "/companies/search/uploads/companyLogo/",
    "/search/location/uploads/companyLogo/",
  ],
  express.static(path.join(__dirname, "uploads/companyLogo"))
);

//MIDDLEWARE
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "5mb",
    extended: true,
  })
);
app.use(cookieParser());
app.use(cors());

//ROUTES MIDDLEWARE
// app.get('/', (req, res) => {
//     res.send("Hello from Node Js");
// })
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", jobTypeRoute);
app.use("/api", jobRoute);
app.use("/api", companyRoute);

// error middleware
app.use(errorHandler);

//port
const port = process.env.PORT || 8989;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
