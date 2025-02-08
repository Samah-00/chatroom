const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require("../db");

const REGISTER = 30000;


// Registration page
router.get("/", (req, res) => {
    const userData = req.cookies.userData || {};
  
    if (userData) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - userData.timestamp;
  
        // If the cookie expired
        if (elapsedTime > REGISTER) {
            res.clearCookie("userData");
            return res.redirect("/register");
        }
    }
  
    res.render("register", { message: "", userData });
  });
  
  // Password input page
  router.get("/password", (req, res) => {
    const userData = req.cookies.userData;
  
    if (!userData) {
        return res.redirect("/register");
    }
  
    const currentTime = Date.now();
    const elapsedTime = currentTime - userData.timestamp;
  
    // If the cookie expired
    if (elapsedTime > REGISTER) {
        res.clearCookie("userData");
        return res.redirect("/register");
    }
  
    res.render("password", { message: "" });
  });
  
  // Handling registration
  router.post("/", async (req, res) => {
    const { email, firstName, lastName } = req.body;
    const errors = {};
  
    // Validation for email and name
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nameRegex = /^[a-zA-Z]{3,32}$/;
  
    if (!nameRegex.test(firstName)) {
        errors.firstName = "First name must contain 3-32 characters and only English letters.";
    }
  
    if (!nameRegex.test(lastName)) {
        errors.lastName = "Last name must contain 3-32 characters and only English letters.";
    }
  
    if (!emailRegex.test(email)) {
        errors.email = "Please enter a valid email address.";
    }
  
    try {
      const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
  
      if (existingUser) {
        errors.email = "This email is already in use, please choose another one";
      }
    } catch (error) {
      console.error("Error during registration:", error);
      res.render("register", {
         message: "An error occurred, please try again",
         userData: req.body,
        });
    }
  
    if (Object.keys(errors).length > 0) {
        return res.render("register", {
            message: errors, 
            userData: req.body, 
        });
    }
  
    res.cookie("userData", { email, firstName, lastName, timestamp: Date.now() }, { maxAge: REGISTER });
    res.redirect("/register/password");
  });
  
  // Handling password input
  router.post("/password", async (req, res) => {
    const { password, confirmPassword } = req.body;
    const userData = req.cookies.userData;
  
    if (!userData) {
        return res.redirect("/register");
    }
  
    if (password !== confirmPassword) {
        return res.render("password", {
            message: "Passwords do not match, please try again",
        });
    }
  
    if (password.length < 6) {
        return res.render("password", {
            message: "Password must be at least 6 characters long.",
        });
    }
  
    try {
      const existingUser = await User.findOne({ where: { email: userData.email.toLowerCase() } });
  
      if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
  
        await User.create({ 
          email: userData.email.toLowerCase(),
          firstName: userData.firstName.trim(),
          lastName: userData.lastName.trim(),
          password: hashedPassword 
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      return res.render("register", {
         message: "An error occurred, please try again",
         userData: userData,
        });
    }
  
    res.clearCookie("userData");
    res.redirect("/?message=You are now registered");
  });
  
module.exports = router;