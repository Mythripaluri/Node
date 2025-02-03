const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");

const app = express();
const PORT = 8000;

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Added JSON parsing middleware for handling JSON requests

// 🟢 GET all users (HTML Response)
app.get("/users", (req, res) => {
    const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name} - ${user.email}</li>`).join("")}
    </ul>`;
    res.send(html);
});

// 🟢 GET all users (JSON Response - REST API)
app.get("/api/users", (req, res) => {
    return res.json(users);
});

// 🟢 GET user by ID, PATCH, and DELETE
app
    .route("/api/users/:id")
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((u) => u.id === id); // FIXED: Used 'user' instead of 'users'
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    })
    .patch((req, res) => {
        const id = Number(req.params.id);
        const userIndex = users.findIndex((u) => u.id === id);

        if (userIndex === -1) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update only the provided fields
        users[userIndex] = { ...users[userIndex], ...req.body };

        // Save updated data to file
        fs.writeFileSync("./MOCK_DATA.json", JSON.stringify(users, null, 2));

        return res.json({ status: "success", user: users[userIndex] });
    })
    .delete((req, res) => {
        const id = Number(req.params.id);
        const userIndex = users.findIndex((u) => u.id === id);

        if (userIndex === -1) {
            return res.status(404).json({ error: "User not found" });
        }

        // Remove the user
        users.splice(userIndex, 1);

        // Save updated data to file
        fs.writeFileSync("./MOCK_DATA.json", JSON.stringify(users, null, 2));

        return res.json({ status: "success", message: "User deleted" });
    });

// 🟢 POST new user
app.post("/api/users", (req, res) => {
    const body = req.body;

    if (!body.first_name || !body.email) {
        return res.status(400).json({ error: "First name and email are required" });
    }

    const newUser = { ...body, id: users.length + 1 };
    users.push(newUser);

    // FIXED: Correct usage of fs.writeFileSync
    fs.writeFileSync("./MOCK_DATA.json", JSON.stringify(users, null, 2));

    return res.json({ status: "success", id: newUser.id });
});

// 🟢 Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
