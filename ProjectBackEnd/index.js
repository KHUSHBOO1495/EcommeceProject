const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const productRoute = require('./routes/ProductRoutes');
const categoryRoutes = require('./routes/CategoryRoutes');
const cartRoutes = require('./routes/CartRoutes');
const userRoute = require('./routes/UserRoutes');

require('dotenv').config();

mongoose.connect(process.env.dbUrl).then(() => {
    console.log('Connected to mongo DB');

    const app = express();

    app.use(bodyParser.json());

    app.use('/users', userRoute);
    app.use('/products', productRoute);
    app.use('/cart', cartRoutes);
    app.use('/categories', categoryRoutes);


    app.listen(process.env.PORT, () => {
        console.log('Server started')
    })

}).catch((err) => {
    console.log(err)
})