const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User');

//User Sign Up
const registerUser = async(req,res)=>{
    try{
        const {username, password, confirmPassword, first_name, last_name, email, role} = req.body;

        if(!email || !password || !confirmPassword){
            return res.status(400).json({ message: "Email and Password are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "passwords do not match" });
        }

        const userExist = await User.findOne({ email });
        if(userExist){
            return res.status(400).json({ message: "User already exists" });
        }

        const hashPass = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashPass,
            first_name,
            last_name,
            email,
            role,
            isActive:true,
            wishlist_id: "5f1a9f1b9c9d4f3f8a89e1b8",
            cart_id: "5f1a9f1b9c9d4f3f8a89e1b9"
        })
        await newUser.save();
        res.status(201).json({ message: "Sign Up Successfully!", user_id: newUser._id });

    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

//User Login
const loginUser = async(req,res)=>{
    try{
        const {username, password} = req.body;

        const user = await User.findOne({ username })

        if(!user){
            return res.status(400).json({ message: "User not found." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign({ user_id: user._id, role: user.role }, process.env.jwtKey, { expiresIn: "1h" });
        res.json({ token, user_id: user._id });

    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

module.exports = { registerUser, loginUser };