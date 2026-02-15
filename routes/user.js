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
});


// login page
router.get("/login", (req, res) => {
    res.render("login.ejs");
});


// login
router.post("/login",
    passport.authenticate("local", {
        successRedirect: "/posts",
        failureRedirect: "/login"
    })
);

module.exports = router;
