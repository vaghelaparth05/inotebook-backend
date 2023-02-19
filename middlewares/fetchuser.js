var jwt = require("jsonwebtoken");

// Json web secret key(Ideally this shouldn't be here, I guess)
const JSW_SECRET = "iamsherlockvaghela";

const fetchUser = (req,res,next) => {
    // Get user from header's auth-token
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error: 'Please use a valid authentication token'})
    }
    try {
        const verification = jwt.verify(token, JSW_SECRET);
        req.user = verification.user;
        next();
        
    } catch (error) {
        res.status(401).send({error: 'Please use a valid authentication token'})
    }
}

module.exports = fetchUser;