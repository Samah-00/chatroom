const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Message } = require("../db");

// Check if the user is logged in
function checkSession(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/");  // Redirect to the login page if the user is not logged in
    }
    return next();
  }
  
  // Chatroom page
  router.get("/", checkSession, async (req, res) => {
    try {
        const messages = await Message.findAll({ order: [['timestamp', 'ASC']] }) || [];
        res.render("chatroom", { userData: req.session.user, messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.render("chatroom", { userData: req.session.user, messages: [] });
    }
  });
  
  // Get all messages
  router.get("/messages", checkSession, async (req, res) => {
    try {
        const messages = await Message.findAll({ order: [['timestamp', 'ASC']] }) || [];
        res.status(200).json(messages.length ? messages : []);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Could not retrieve messages" });
    }
  });
  
  // Send a message
  router.post("/send", checkSession, async (req, res) => {
    const { message } = req.body;
    const userData = req.session.user;
  
    if (!message) {
        return res.status(400).send("Message cannot be empty");
    }
  
    try {
      const newMessage = await Message.create({
        user: userData.firstName,
        text: message,
        email: userData.email,
     });
  
      res.status(200).send(newMessage);
    } catch (error) {
        console.error("Error saving message:", error);
        res.status(500).send("Could not save message");
    }
  });
  
  // Delete a message
  router.delete("/delete/:id", checkSession, async (req, res) => {
    const { id } = req.params;
    const userData = req.session.user;
  
    try {
        const message = await Message.findOne({ where: { id, email: userData.email } });
  
        if (!message) {
            return res.status(404).send("Message not found or you're not the author");
        }
  
        await message.destroy(); // Delete the message
        res.status(200).send("Message deleted");
    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).send("Could not delete message");
    }
  });
  
  // Edit a message
  router.put("/edit/:id", checkSession, async (req, res) => {
    const { id } = req.params;
    const { newText } = req.body;
    const userData = req.session.user;
  
    try {
        const message = await Message.findOne({ where: { id, email: userData.email } });
  
        if (!message) {
            return res.status(404).send("Message not found or you're not the author");
        }
  
        message.text = newText;
        await message.save();
        res.status(200).json(message);
    } catch (error) {
        console.error("Error updating message:", error);
        res.status(500).send("Could not update message");
    }
  });
  
  // Search messages route
  router.get("/search", checkSession, async (req, res) => {
    const { term } = req.query;
  
    try {
        const messages = await Message.findAll({
            where: {
                text: {
                    [Op.like]: `%${term}%`, // Search for messages containing the term
                }
            },
            order: [['timestamp', 'ASC']]
        });
  
        res.json(messages);
    } catch (error) {
        console.error("Error during search:", error);
        res.status(500).send("An error occurred while searching for messages.");
    }
  });

module.exports = router;