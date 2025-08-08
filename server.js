// API endpoint to delete a project by index
app.delete("/api/projects/:index", (req, res) => {
    const idx = parseInt(req.params.index, 10);
    const projectsPath = path.join(__dirname, "projects.json");
    fs.readFile(projectsPath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Failed to read projects.json" });
        }
        let projects = [];
        try {
            projects = JSON.parse(data);
        } catch (e) {
            // If file is empty or invalid, return error
            return res.status(500).json({ error: "Invalid projects.json format" });
        }
        if (idx < 0 || idx >= projects.length) {
            return res.status(400).json({ error: "Invalid project index" });
        }
        projects.splice(idx, 1);
        fs.writeFile(projectsPath, JSON.stringify(projects, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "Failed to update projects.json" });
            }
            res.json({ success: true });
        });
    });
});
const express = require("express");
const path = require("path");
const fs = require("fs");


const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;



// Enable CORS for all origins
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static("."));
// Serve images
app.use("/images", express.static("images"));

// API endpoint to get all projects
app.get("/api/projects", (req, res) => {
    const projectsPath = path.join(__dirname, "projects.json");
    fs.readFile(projectsPath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Failed to read projects.json" });
        }
        let projects = [];
        try {
            projects = JSON.parse(data);
        } catch (e) {
            // If file is empty or invalid, return empty array
        }
        res.json(projects);
    });
});

// API endpoint to add a new project
app.post("/api/projects", (req, res) => {
    const newProject = req.body;
    const projectsPath = path.join(__dirname, "projects.json");
    fs.readFile(projectsPath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Failed to read projects.json" });
        }
        let projects = [];
        try {
            projects = JSON.parse(data);
        } catch (e) {
            // If file is empty or invalid, start with empty array
        }
        projects.push(newProject);
        fs.writeFile(projectsPath, JSON.stringify(projects, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "Failed to update projects.json" });
            }
            res.json({ success: true, project: newProject });
        });
    });
});

// Main route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Handle 404s
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Portfolio server running on http://0.0.0.0:${PORT}`);
    console.log(`Server accessible at http://localhost:${PORT}`);
});
