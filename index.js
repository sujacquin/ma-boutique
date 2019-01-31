const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

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

app.use(departmentRoutes);
app.use(categoryRoutes);
app.use(productRoutes);



app.listen(3005, () => {
    console.log("Server started");
});