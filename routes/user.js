const express=require('express');
const router=express.Router();
const user=require("../models/user");
const passport=require("passport");
const bcrypt=require('bcryptjs');


//signup route
router.get("/signup", (req,res)=>{
    res.render("signup.ejs");
});

router.post("/signup", async (req,res)=>{
    try {
        const {username, email, password} = req.body;
        
        if(!username || !email || !password) {
            req.flash("error", "All fields are required!");
            return res.redirect("/signup");
        }
        
        if(await user.findOne({username})) {
            req.flash("error", "Username already exists!");
            return res.redirect("/signup");
        }
        
        const newUser = await new user({
            email, 
            username, 
            password: await bcrypt.hash(password, 10)
        }).save();
        
        req.login(newUser, err => {
            if(err) {
                req.flash("error", "Login failed");
                return res.redirect("/signup");
            }
            req.flash("success", "Welcome to our website!");
            res.redirect("/posts");
        });
    } catch(e) {
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