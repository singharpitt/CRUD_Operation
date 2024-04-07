const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const { jwtkey } = require('../keys');

module.exports = (req, res, next) => {
    const { token } = req.cookies; // Extract JWT token from cookie named 'token'
    if (!token) {
        return res.status(401).send({ error: "You must be logged in" });
    }

    jwt.verify(token, jwtkey, async (err, payload) => {
        if (err) {
            return res.status(401).send({ error: "You must be logged in" });
        }
        const { userId } = payload;
        const user = await User.findById(userId);
        req.user = user;
        console.log(req.user)
        next();
    });
};
