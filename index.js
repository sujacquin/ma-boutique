const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const faker = require('faker');

const app = express();
app.use(bodyParser.json());

mongoose.connect(
    "mongodb://localhost/online-shop", {
        useNewUrlParser: true
    }
);



const departmentRoutes = require('./routes/department');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const reviewRoutes = require('./routes/review');

app.use(departmentRoutes);
app.use(categoryRoutes);
app.use(productRoutes);
app.use(reviewRoutes);



app.listen(3005, () => {
    console.log("Server started");
});