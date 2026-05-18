const express = require("express")
const router = express.Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

router.post("/signup", async(req, res) => {
    try {
        const {name, 
            email, 
            password} = req.body;

        const existingUsr = await User.findOne({email})

        if(existingUsr){
            return res.status(400).json({message: "User already exists with this email!"});
        }
        const hashPassword = await bcrypt.hash(password, 10)

        const user = new User({name, 
            email, 
            password: hashPassword 
        })
        await user.save()
        res.status(201).json({message: "User created successfully"})
    }
    catch(err){
        res.status(400).json({message: err.message || "Server error"})
    }
})

router.post("/login", async(req, res) =>{
    try{
        const {email, password} = req.body;

        const existUsr = await User.findOne({email: email})

        if(!existUsr){
            return res.status(400).json({message: "Invalid credentials!"})
        }

        const pass = await bcrypt.compare(password, existUsr.password)
        if(!pass){
            return res.status(400).json({message: "wrong password"})
        }
        
        const token = jwt.sign (
            {id: existUsr._id, name: existUsr.name},
            "questack-secret",
            {expiresIn: "7d"}
        );
        return res.status(200).json({token, name: existUsr.name})
    }
    catch (err) {
        return res.status(500).json({message: err.message})
    }
})

module.exports = router