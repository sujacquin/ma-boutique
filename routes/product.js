const express = require("express");
const router = express.Router();

const Department = require('../models/department');
const Category = require('../models/category');
const Product = require('../models/product');





//PRODUCT

// Create

router.post("/product/create", async (req, res) => {
    try {
        const catOfProduct = await Category.findById(req.body.category);
        if (catOfProduct !== null) {
            const newProduct = new Product({
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                category: catOfProduct
            });
            await newProduct.save();
            res.json({
                message: "new product created"
            });
        } else {
            res.json({
                message: "category not found"
            });
        }
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

//Read

router.get("/product", async (req, res) => {
    try {
        const searchObject = {};

        if (req.query.name !== undefined) {
            searchObject.title = new RegExp(req.query.name, "i");
        }

        if (req.query.minPrice !== undefined) {
            searchObject.price = {};
            searchObject.price.$gte = req.query.minPrice;
        }

        if (req.query.maxPrice !== undefined) {
            if (searchObject.price === undefined) {
                searchObject.price = {};
            }
            searchObject.price.$lte = req.query.maxPrice;
        }

        if (req.query.category !== undefined) {
            searchObject.category = req.query.category;
        }

        const search = Product.find(searchObject);

        if (req.query.sort === "price-asc") {
            console.log(req.query.sort);
            search.sort({
                price: 1
            });
        }

        if (req.query.sort === "price-des") {
            search.sort({
                price: -1
            });
        }
        const products = await search;

        res.json(products);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

//Update

router.post("/product/update", async (req, res) => {
    try {
        const product = await Product.findById(req.query.product);
        console.log(product);
        console.log(req.body.title);

        if (product !== null) {
            if (req.body.title !== undefined) {
                product.title = req.body.title;
            }
            if (req.body.description !== undefined) {
                product.description = req.body.description;
            }
            if (req.body.category !== undefined) {
                product.category = req.body.category;
            }

            if (req.body.price !== undefined) {
                product.price = req.body.price;
            }

            await product.save();
            res.json({
                message: "Product updated"
            });
        } else {
            res.status(400).json({
                message: "Bad request"
            });
        }
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

//Delete

router.post("/product/delete", async (req, res) => {
    try {
        const product = await Product.findById(req.query.product);
        console.log(product);
        console.log(req.body.title);

        await product.remove();
        res.json({
            message: "Product removed"
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

module.exports = router;