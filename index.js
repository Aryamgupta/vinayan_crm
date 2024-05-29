const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');

const bodyParser = require('body-parser');
const uploadRoute = require('./config/upload');




const mongoDbConnect = require("./config/db");


dotenv.config();
mongoDbConnect();
// instance of express
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api', uploadRoute);

const allowedOrigins = ['http://localhost:3000/'];

const corsOptions = {
  origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
          callback(null, true);
      } else {
          callback(new Error('Not allowed by CORS'));
      }
  }
};

app.use(cors());

// Define your routes
app.options('*', cors());

const userRoutes = require("./Routes/userRoutes");
const materialRoutes = require("./Routes/productRoutes");
const productRoutes = require("./Routes/finalProductRoutes");
const orderRoutes = require("./Routes/orderRoutes")
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

// to express the json data
app.use(express.json());
// base api endpoint

app.get("/", (req, res) => {
  console.log("App running");
  res.send("Hello World");
});


app.use("/api/user", userRoutes);
app.use("/api/material", materialRoutes);
app.use("/api/finalProduct", productRoutes);
app.use("/api/order", orderRoutes);

const PORT = process.env.PORT || 5000; // deciding port

const server = app.listen(
  PORT,
  console.log("server listening on port on " + PORT)
);


app.use(notFound);
app.use(errorHandler);
