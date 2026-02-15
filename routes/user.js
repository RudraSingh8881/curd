<<<<<<< HEAD
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const bcrypt = require("bcryptjs");


// signup page
router.get("/signup", (req, res) => {
    res.render("signup.ejs");
});



router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
        return res.redirect("/signup");

    if (await User.findOne({ username }))
        return res.redirect("/signup");

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        password: hash
    });

    req.login(user, () => res.redirect("/posts"));
=======
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
>>>>>>> 6b210237e5adf56ad3db6bb3d6be84d23ccb2915
});


// login page
router.get("/login", (req, res) => {
    res.render("login.ejs");
});

<<<<<<< HEAD
=======
router.post("/login", passport.authenticate("local", { //passport authentication middeleware hai.
    failureRedirect: "/login",
    failureFlash: true
}), (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/posts");
});
>>>>>>> 6b210237e5adf56ad3db6bb3d6be84d23ccb2915

// login
router.post("/login",
    passport.authenticate("local", {
        successRedirect: "/posts",
        failureRedirect: "/login"
    })
);

module.exports = router;
