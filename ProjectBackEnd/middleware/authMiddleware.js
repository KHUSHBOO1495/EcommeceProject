const jwt = require('jsonwebtoken');
const roles = require('../config/roles');

const authenticate = (req, res, next) => {
    console.log(req.headers);
    
    const token = req.headers["authorization"];
    console.log("token:",token);
    
    if(!token) {
        return res.status(401).json({ message: "Access Denied for authentication" });
    }
    
    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.jwtKey);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

const authorize = (action) => (req, res, next) => {

    const userRole = req.user.role;
    if(!roles[userRole] || !roles[userRole].includes(action)) {
        return res.status(403).json({ message: "Access Denied for authorize" });
    }
    next();
}

module.exports = { authenticate, authorize };