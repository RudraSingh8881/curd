const express=require('express');
const router=express.Router();  //router likhne me error agya tha.
const user=require("../models/user");
const passport=require("passport");


//signup route
router.get("/signup",(req,res)=>{
    res.render("signup.ejs");;
});

const bcrypt = require('bcryptjs');

router.post("/signup", async (req,res)=>{
    const {username,email,password}=req.body;
    
    if(!username || !email || !password) {
        req.flash("error","All fields are required!");
        return res.redirect("/signup");
    }
    
    try {
        console.log("Received signup data:", {username, email, password});
        
        // Check if user already exists
        const existingUser = await user.findOne({username});
        if(existingUser) {
            console.log(" Username already exists");
            req.flash("error", "Username already exists!");
            return res.redirect("/signup");
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create new user with hashed password
        const newUser = new user({
            email, 
            username,
            password: hashedPassword
        });
        
        const savedUser = await newUser.save();
        console.log(" User saved to MongoDB:", savedUser.username);
        console.log("Email:", savedUser.email);
        
        // Store user in session
        req.login(savedUser, {}, (err) => {
            if(err) {
                console.log(" Login error:", err.message);
                req.flash("error", "Login failed");
                return res.redirect("/signup");
            }
            console.log(" User logged in successfully");
            req.flash("success","Welcome to our website!");
            res.redirect("/posts");
        });
        
    } catch(e){
        console.log(" Error:", e.message);
        console.log("Error Stack:", e.stack);
        req.flash("error", e.message);
        res.redirect("/signup");
    }
});


// LOGIN ROUTES
router.get("/login", (req,res) => {
    res.render("login.ejs");
});

router.post("/login", passport.authenticate("local", { //passport authentication middeleware hai.
    failureRedirect: "/login",
    failureFlash: true
}), (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/posts");
});

 

module.exports = router;