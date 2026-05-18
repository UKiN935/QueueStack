const jwt = require("jsonwebtoken")

const protect = async(req, res, next) => {
    try{
        const authHeader = req.headers["authorization"];

        const token = authHeader && authHeader.split(' ')[1]

        if(!token){
            return res.status(401).json({message: "No token , access denied!"})
        }
        const decoded = jwt.verify(token, "questack-secret")
        req.user = decoded
        next()
    }
    catch (err){
        return res.status(401).json({message: "Invalid token"})
    }
}
module.exports = protect;