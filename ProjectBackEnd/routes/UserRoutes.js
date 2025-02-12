const express = require('express');
const mongoose = require('mongoose')
const User = require('../model/User');
const router = express.Router();
var jwt = require('jsonwebtoken');

//GET all users
router.get('/', async(req,res)=>{
    const data = await User.find();
    res.send(data);
})

//GET user by id
router.get('/:id', async(req,res)=>{
    const data = await User.findById(req.params.id);
    res.send(data);
})

//POST user
// router.post('/', async(req,res)=>{
//     const data = await User.create(req.body);
//     res.send(data);
// })

//PATCH user
router.patch('/:id', async(req,res)=>{
    const data = await User.findByIdAndUpdate(req.params.id,req.body);
    res.send(data);
})

//DELETE user
router.delete('/:id', async(req,res)=>{
    const data = await User.findByIdAndDelete(req.params.id);
    res.send(data);
})

//Login
router.post('/login', async(req,res)=>{
    const data = await User.findOne({
        username: req.body.username,
        password: req.body.password,
    })

    if(data){
        var token = jwt.sign({...data}, process.env.jwtKey)
        const ans = {
            isValid: true,
            msg: "Login successfully..!",
            token: token,
        }
        res.send(ans);
    }
    else{
        const ans = {
            isValid: false,
            msg: "Username/Password does not match",
        }
        res.send(ans);
    }

})

//SignUp
router.post('/signup', async(req,res)=>{
    const data = await User.findOne({
        username: req.body.username
    })
    if(data){
        const ans = {
            isValid: false,
            msg: "User already exist!",
        }
        res.send(ans);
    }
    else{
        const data = new User({
            username: req.body.username,
            password: req.body.password,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            isActive: true,
            wishlist_id: new mongoose.Types.ObjectId(),
            cart_id: new mongoose.Types.ObjectId(),
        })

        const savedUser = await data.save();

        const ans = {
            isValid: true,
            msg: "Sign Up Successfully!",
        }
        res.send(ans);
    }
})

module.exports = router;