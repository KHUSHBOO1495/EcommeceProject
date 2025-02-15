const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.dbUrl);
        console.log('Connected to mongo DB');
    }catch(error){
        console.error('Database connection failed!', error);
        process.exit;
    }
}

module.exports = connectDB;