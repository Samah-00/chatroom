const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require("../db");

/* GET home page. */
router.get('/', function(req, res) {

  if (req.session.user) {
    res.redirect("/chatroom");
  }

  res.render("login", { message: req.query.message || "" });
});

// Handling login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email: email.toLowerCase() } });

    if (!user) {
      return res.render("login", { message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.render("login", { message: "Invalid email or password" });
    }

    req.session.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    res.redirect("/chatroom");
  } catch {
    console.error("Error during login:", error);
    res.render("login", { message: "An error occurred, please try again." });
  }
});

// Logout route
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {

    if (err) {
      console.error("Error logging out:", err);
      return res.redirect("/chatroom");
    }

    res.redirect("/");
  });
});

module.exports = router;
