const express = require('express');
const mongoose = require('mongoose');
const Product = require('./model/products_detail');

const atlasUrl = 'mongodb+srv://lokhushboo:khushboo1409@cluster0.shczf.mongodb.net/Shopping';

mongoose.connect(atlasUrl).then(()=>{
    console.log('Connected to mongo DB');

    const app = express();

    app.get('/all-products',async (req,res)=>{
        const data = await Product.find();
        res.send(data);
    })

    app.listen(3000,()=>{
        console.log('Server started @3000')
    })

}).catch((err)=>{
    console.log(err)
})