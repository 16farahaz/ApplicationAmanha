const jwt = require('jsonwebtoken');
const User = require('../models/user');

const verifyJWT = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
    }

    try {
        const decoded = jwt.verify(token, '123456789'); // Use your secret here
        req.user = await User.findById(decoded._id).lean();
        if (!req.user) {
            return res.status(404).json({ message: 'User not found!' });
        }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Access Denied: Invalid Token!' });
    }
};

module.exports = { verifyJWT };
