const axios = require('axios');
const faker = require('faker');


try {


    for (let i = 0; i < 5000; i++) {
        axios.post("https://la-boutique-de-susana.herokuapp.com/product/create", {
            category: "5c58432350adc60017782d27",
            title: faker.commerce.product(),
            price: faker.commerce.price()
        })
    }
} catch (error) {
    res.status(400).json({
        error: error.message
    });
}