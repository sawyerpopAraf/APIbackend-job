// Middleware function to determine if the API endpoint request is from an authenticated user
const jwt = require('jsonwebtoken');

function isAuth(req, res, next) {
    const authHeader = req.headers.authorization; 
    if (!authHeader) {
        return res.status(401).json({error: 'Unauthorized'});
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(400).jsend.fail({result:"Token is required."})
    }

    try {
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        req.userData = decodedToken;  
    } catch (err) {
        return res.jsend.fail({statusCode:401,"result": err.message});  
	}

    next();
}

module.exports = isAuth;

