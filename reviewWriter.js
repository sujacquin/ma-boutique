const axios = require('axios');
const faker = require('faker');


try {


    for (let i = 0; i < 1; i++) {
        axios.post("https://la-boutique-de-susana.herokuapp.com/review/create", {
            product: "5c5846c750adc60017782d28",
            rating: Math.floor(Math.random() * (5 - 1)) + 1,
            username: faker.name.findName(),
            comment: faker.lorem.sentence()
        })
    }
} catch (error) {
    res.status(400).json({
        error: error.message
    });
}