const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());

mongoose.connect(
  "mongodb://localhost/online-shop",
  {
    useNewUrlParser: true
  }
);

const Department = mongoose.model("Department", {
  title: String
});

const Category = mongoose.model("Category", {
  title: String,
  description: String,
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  }
});

const Product = mongoose.model("Product", {
  title: String,
  description: String,
  price: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }
});

// DEPARTMENT

//Create

app.post("/department/create", async (req, res) => {
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

app.get("/department", async (req, res) => {
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

app.post("/department/update", async (req, res) => {
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

app.post("/department/delete", async (req, res) => {
  try {
    const deletedCats = await Category.find({
      department: req.body.department
    });

    for (let i = 0; i < deletedCats.length; i++) {
      await Product.deleteMany({
        category: deletedCats[i].id
      });
    }

    await Category.deleteMany({
      department: req.body.department
    });

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

// CATEGORY

//Create

app.post("/category/create", async (req, res) => {
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

app.get("/category", async (req, res) => {
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

app.post("/category/update", async (req, res) => {
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

app.post("/category/delete", async (req, res) => {
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

//PRODUCT

// Create

app.post("/product/create", async (req, res) => {
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

app.get("/product", async (req, res) => {
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

app.post("/product/update", async (req, res) => {
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

app.post("/product/delete", async (req, res) => {
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

app.listen(3005, () => {
  console.log("Server started");
});
