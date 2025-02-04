const express = require('express');
const mongoose = require('mongoose');
const Product = require('./model/Product');
const Category = require('./model/Category');

const atlasUrl = 'mongodb+srv://lokhushboo:khushboo1409@cluster0.shczf.mongodb.net/Shopping';

mongoose.connect(atlasUrl).then(()=>{
    console.log('Connected to mongo DB');

    const app = express();

    //GET all products
    app.get('/all-products',async (req,res)=>{
        const data = await Product.find();
        res.send(data);
    })

    //GET product by id
    app.get('/product/:id',async (req,res)=>{
        const data = await Product.findOne({_id: req.params.id});
        res.send(data);
    })

    //POST product

    //PUT(update) product

    //DELETE product
    app.delete('/product/:id',async (req,res)=>{
        const prod = await Product.deleteOne({_id: req.params.id});
        res.send(prod);
    })


    //GET all category
    app.get('/all-category',async (req,res)=>{
        const data = await Category.find();
        res.send(data);
    })

    //GET category by id
    app.get('/category/:id',async (req,res)=>{
        const data = await Category.findOne({_id: req.params.id});
        res.send(data);
    })

    //POST category

    //PUT(update) category

    //DELETE category
    app.delete('/category/:id',async (req,res)=>{
        const prod = await Category.deleteOne({_id: req.params.id});
        res.send(prod);
    })


    //GET product from user's cart

    //GET specific product from cart

    //POST(insert) product inside user's cart

    //PUT(update) cart

    //DELETE product from cart

    
    //GET product from user's wishlist

    //GET specific product from wishlist

    //POST(insert) product inside user's wishlist

    //PUT(update) wishlist

    //DELETE product from wishlist


    //GET orders for user

    //GET order by id

    //POST(create) order

    //PUT(update) order status

    //POST(apply) discount to order

    //GET all order (admin)


    //POST payment

    
    //GET all coupons

    //GET coupon by id

    //POST(apply) coupon to order

    //POST(create) new coupon (admin)

    //PUT(update) coupon details (admin)

    // DELETE coupon
    

    //GET all discount

    //GET all active discounts

    //GET discount details by id

    //POST(create) new discount (admin)

    //PUT(update) discount details (admin)

    //DELETE discount


    //GET all feedback for specific product

    //POST(create) new feedback

    //PUT(update) feedback

    //DELETE feedback


    //return


    app.listen(3000,()=>{
        console.log('Server started @3000')
    })

}).catch((err)=>{
    console.log(err)
})