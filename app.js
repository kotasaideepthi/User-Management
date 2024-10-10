const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/user_management', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.error("MongoDB connection error:", err));

// Define the User Schema
const userSchema = new mongoose.Schema({
    userName: String,
    userEmail: String,
    userAge: String,
    userUniqueId: String
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Initialize Express app
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Home route to display users
app.get("/", async (req, res) => {
    try {
        const users = await User.find(); // Retrieve all users from MongoDB
        res.render("home", { data: users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Error fetching users");
    }
});

// Route to add a new user
app.post("/", async (req, res) => {
    const { userName, userEmail, userAge, userUniqueId } = req.body;

    const newUser = new User({
        userName,
        userEmail,
        userAge,
        userUniqueId
    });

    try {
        await newUser.save(); // Save the new user to MongoDB
        console.log("User saved to database:", newUser);
        res.redirect("/"); // Redirect to home to see updated users
    } catch (err) {
        console.error("Error saving user:", err);
        res.status(500).send("Error saving user");
    }
});

// Route to delete a user
app.post('/delete', async (req, res) => {
    const requestedUserUniqueId = req.body.userUniqueId;

    try {
        await User.deleteOne({ userUniqueId: requestedUserUniqueId }); // Delete user from MongoDB
        console.log("User deleted:", requestedUserUniqueId);
        res.redirect("/"); // Redirect to home to see updated users
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).send("Error deleting user");
    }
});

// Route to update a user
app.post('/update', async (req, res) => {
    const { userName, userEmail, userAge, userUniqueId } = req.body;

    try {
        await User.updateOne({ userUniqueId }, { userName, userEmail, userAge }); // Update user in MongoDB
        console.log("User updated:", userUniqueId);
        res.redirect("/"); // Redirect to home to see updated users
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).send("Error updating user");
    }
});

// Start the server
app.listen(3000, () => {
    console.log("App is running on port 3000");
});
