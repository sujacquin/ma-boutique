const express = require("express");
const router = express.Router();


const Department = require('../models/department');
const Category = require('../models/category');
const Product = require('../models/product');


// CATEGORY

//Create

router.post("/category/create", async (req, res) => {
    try {
        const dptOfCat = await Department.findById(req.query.department);
        if (dptOfCat !== null) {
            const newCategory = new Category({
                title: req.body.title,
                description: req.body.description,
                department: dptOfCat
            });
            await newCategory.save();
            res.json({
                message: "new category created"
            });
        } else {
            res.json({
                message: "department not found"
            });
        }
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

//Read

router.get("/category", async (req, res) => {
    try {
        const categories = await Category.find().populate("department");
        res.json(categories);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

//Update

router.post("/category/update", async (req, res) => {
    try {
        const category = await Category.findById(req.query.category);
        console.log(category);
        console.log(req.body.title);

        if (category !== null) {
            if (req.body.title !== undefined) {
                category.title = req.body.title;
            }
            if (req.body.description !== undefined) {
                category.description = req.body.description;
            }
            if (req.body.department !== undefined) {
                category.department = req.body.department;
            }

            await category.save();
            res.json({
                message: "Category updated"
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

router.post("/category/delete", async (req, res) => {
    try {
        await Product.deleteMany({
            category: req.body.category
        });

        const deletedCat = await Category.findById(req.body.category);

        await deletedCat.remove();

        console.log(deletedCat);

        res.json({
            message: "Category and products removed"
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});


module.exports = router;