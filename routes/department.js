const express = require("express");
const faker = require('faker');

const router = express.Router();


const Department = require('../models/department');
const Category = require('../models/category');
const Product = require('../models/product');




// DEPARTMENT

//Create

router.post("/department/create", async (req, res) => {
    try {

        const newDepartment = new Department({
            title: req.body.title
        });
        await newDepartment.save();


        res.json({
            message: "new department created"
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

//Read

router.get("/department", async (req, res) => {
    try {
        const departments = await Department.find();
        res.json(departments);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

//Update

router.post("/department/update", async (req, res) => {
    try {
        const department = await Department.findById(req.query.department);
        console.log(department);
        if (department !== null) {
            department.title = req.body.title;
            await department.save();
            res.json({
                message: "Department updated"
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

router.post("/department/delete", async (req, res) => {
    try {
        //trouver les catégories
        const deletedCats = await Category.find({
            department: req.body.department
        });

        //supprimer tous les produits dans les catégories
        for (let i = 0; i < deletedCats.length; i++) {
            await Product.deleteMany({
                category: deletedCats[i].id
            });
        }

        //supprimer les catégories
        await Category.deleteMany({
            department: req.body.department
        });

        //supprimer le département
        const deptToDelete = await Department.findById(req.body.department);

        await deptToDelete.remove();

        res.json({
            message: "Department and referenced categories and products removed"
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});


module.exports = router;