const bcrypt = require('bcrypt');
const User = require("../model/User");

//GET all users
const getAllUser = async(req,res)=>{
    try{
        const users = await User.find();
        res.status(200).json(users);
    }catch(error){
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

//GET user by id
const getUserById = async(req,res)=>{
    try{
        const userId = req.params.id;
        const uId = req.user.user_id;
        
        if (userId !== uId && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. You cannot view users." });
        }

        const users = await User.findById(req.params.id);
        if(!users){
            return res.status(404).json({ message: "User not found!" });
        }
        res.json(users)
    }catch(error){
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

//GET user by id
const getUser = async(req,res)=>{
    try{
        const uId = req.user.user_id;
        const users = await User.findById(uId);
        if(!users){
            return res.status(404).json({ message: "User not found!" });
        }
        res.json(users)
    }catch(error){
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

//PATCH user
const updateUser = async(req,res)=>{
    try{
        const userId = req.params.id;
        const uId = req.user.user_id;
        
        if (userId !== uId && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. You cannot update users." });
        }

        let updates = req.body;
        if(updates.newPassword){
            updates.password = await bcrypt.hash(updates.newPassword, 10);
            delete updates.newPassword;
        }
        updates.updated_at = Date.now();

        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
        res.json({message: "User updated successfully!", user});
    }catch(error){
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

//DELETE user
const deleteUser = async(req,res)=>{
    try {
        
        const userId = req.params.id;
        const uId = req.user.user_id;
        
        if (userId !== uId && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. You cannot delete users." });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.findByIdAndDelete(userId);
        res.json({ message: "User deleted successfully" });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { getAllUser, getUser,getUserById, updateUser, deleteUser };