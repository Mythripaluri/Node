const express = require("express");
const fs = require("fs");
let users = require("./MOCK_DATA.json"); // Use let instead of const to allow modification

const app = express();
const PORT = 8000;

// Middleware to parse URL-encoded and JSON request bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

// 🟢 GET user by ID, PATCH (Update), and DELETE
app
    .route("/api/users/:id")
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((u) => u.id === id);

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

    // Save new user to file
    fs.writeFileSync("./MOCK_DATA.json", JSON.stringify(users, null, 2));

    return res.json({ status: "success", id: newUser.id });
});

// 🟢 Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
