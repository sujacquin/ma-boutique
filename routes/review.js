const express = require("express");
const router = express.Router();
const faker = require('faker');

const Department = require('../models/department');
const Category = require('../models/category');
const Product = require('../models/product');
const Review = require('../models/review');


// CATEGORY

//Create

router.post("/review/create", async (req, res) => {
    try {

        //Find product to review
        const reviewedProduct = await Product.findById(req.body.product);

        //create review
        if (reviewedProduct !== null) {
            const newReview = new Review({
                rating: req.body.rating,
                comment: req.body.comment,
                username: req.body.username
            });
            await newReview.save();


            //Add review ref. to product
            reviewedProduct.reviews.push(newReview);
            await reviewedProduct.save();

            //populate product with review

            await Review.populate(reviewedProduct, {
                path: "reviews",
                model: "Review"
            });

            //Average
            let ratingSum = 0;
            for (let i = 0; i < reviewedProduct.reviews.length; i++) {
                ratingSum += reviewedProduct.reviews[i].rating

            }
            console.log(ratingSum);
            const avRating = ratingSum / reviewedProduct.reviews.length

            reviewedProduct.averageRating = avRating.toFixed(2);

            //Update product
            await reviewedProduct.save();




            res.json({
                message: "Review added, thank you for your time"
            });
        } else {
            res.json({
                message: "product not found"
            });
        }
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});



//Update

router.post("/review/update", async (req, res) => {
    try {
        const review = await Review.findById(req.query.review);



        const reviewedProduct = await Product.findOne({
            reviews: {
                $in: [req.query.review]
            }
        });

        const pastRating = review.rating;
        const pastAverage = reviewedProduct.averageRating;
        const reviewNumber = reviewedProduct.reviews.length;

        if (review !== null) {
            if (req.body.rating !== undefined) {
                review.rating = req.body.rating;
                reviewedProduct.averageRating = (((pastAverage * reviewNumber) - pastRating + req.body.rating) / reviewNumber).toFixed(2);
                await reviewedProduct.save();

            }
            if (req.body.comment !== undefined) {
                review.comment = req.body.comment;
            }


            await review.save();
            res.json({
                message: "Review updated"
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

router.post("/review/delete", async (req, res) => {
    try {
        const review = await Review.findById(req.query.review);




        const reviewedProduct = await Product.findOne({
            reviews: {
                $in: [req.query.review]
            }
        });




        if (review) {

            for (let i = 0; i < reviewedProduct.reviews.length; i++) {


                if (String(reviewedProduct.reviews[i]) === req.query.review) {
                    console.log(i, reviewedProduct.reviews[i]);
                    const removed = reviewedProduct.reviews.splice(i, 1);
                    console.log(removed);
                }
            }
            reviewedProduct.averageRating =
                (reviewedProduct.averageRating * reviewedProduct.reviews.length - review.rating) /
                (reviewedProduct.reviews.length - 1);


            await reviewedProduct.save();

            await review.remove();


            res.json({
                message: "Review deleted"
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




module.exports = router;