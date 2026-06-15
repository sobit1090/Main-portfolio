require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const session = require("express-session");
const storage = require("./storage");

const app = express();
const port = process.env.PORT || 3001;

// Project mapping to match URL parameters with exact template filenames
const projectMap = {
  "lospollos": "LosPollos",
  "movie": "movie",
  "password_generator": "password_generator",
  "shorting_visualizer": "shorting_visualizer",
  "sorting_visualizer": "shorting_visualizer",
  "to_do_list": "to_do_list",
  "to-do-list": "to_do_list"
};

// Middleware
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || "newspaper-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// Auth check middleware
function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    next();
  } else {
    res.redirect("/admin/login");
  }
}

// Routes
app.get("/", async (req, res) => {
  try {
    const projects = await storage.getProjects();
    res.render("index", { projects });
  } catch (err) {
    console.error("Error loading projects for home page:", err);
    res.render("index", { projects: [] });
  }
});

app.get("/projects/:project", (req, res) => {
  const projectParam = req.params.project.toLowerCase().replace(/-/g, "_");
  const targetProject = projectMap[projectParam] || projectParam;
  
  const templatePath = path.join(__dirname, "views", "projects", `${targetProject}.ejs`);
  if (fs.existsSync(templatePath)) {
    res.render(`projects/${targetProject}`);
  } else {
    res.status(404).send("Project not found");
  }
});

// Admin Login GET
app.get("/admin/login", (req, res) => {
  if (req.session && req.session.isAdmin) {
    return res.redirect("/admin");
  }
  res.render("login", { error: null });
});

// Admin Login POST
app.post("/admin/login", (req, res) => {
  const { password } = req.body;
  
  // Hash the input password using SHA-256
  const inputHash = crypto.createHash("sha256").update(password).digest("hex");
  
  // Compare against environment variable (default fallback hash of "admin123")
  const defaultHash = "240a10a68a57d2cf0438cf56372d87e076e655cf3553257bb1d8b92b67d56e72";
  const correctHash = process.env.ADMIN_PASSWORD_HASH || defaultHash;
  
  try {
    const isMatch = crypto.timingSafeEqual(
      Buffer.from(inputHash, "hex"),
      Buffer.from(correctHash, "hex")
    );
    
    if (isMatch) {
      req.session.isAdmin = true;
      res.redirect("/admin");
    } else {
      res.render("login", { error: "Incorrect Dispatch Password. Access Denied." });
    }
  } catch (err) {
    console.error("Hash comparison error:", err);
    res.render("login", { error: "Authentication system error. Access Denied." });
  }
});

// Admin Logout
app.get("/admin/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// Admin Dashboard GET
app.get("/admin", requireAdmin, async (req, res) => {
  try {
    const projects = await storage.getProjects();
    res.render("admin", { projects, editProject: null, error: null });
  } catch (err) {
    console.error("Error loading admin dashboard:", err);
    res.render("admin", { projects: [], editProject: null, error: "Failed to load projects." });
  }
});

// Admin Edit Project GET (pre-fill form)
app.get("/admin/edit/:id", requireAdmin, async (req, res) => {
  try {
    const projects = await storage.getProjects();
    const editProject = await storage.getProjectById(req.params.id);
    if (!editProject) {
      return res.redirect("/admin");
    }
    res.render("admin", { projects, editProject, error: null });
  } catch (err) {
    console.error("Error loading project for edit:", err);
    res.redirect("/admin");
  }
});

// Admin Add Project POST
app.post("/admin/projects/add", requireAdmin, async (req, res) => {
  const { title, description, image, githubLink, deployLink, slug, isLocal } = req.body;
  if (!title || !description || !image) {
    const projects = await storage.getProjects();
    return res.render("admin", { projects, editProject: null, error: "Title, Description, and Image are required." });
  }
  try {
    await storage.addProject({
      title,
      description,
      image,
      githubLink,
      deployLink,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      isLocal: isLocal === "on" || isLocal === "true" || isLocal === true
    });
    res.redirect("/admin");
  } catch (err) {
    console.error("Error adding project:", err);
    const projects = await storage.getProjects();
    res.render("admin", { projects, editProject: null, error: "Failed to add project." });
  }
});

// Admin Edit Project POST
app.post("/admin/projects/edit/:id", requireAdmin, async (req, res) => {
  const { title, description, image, githubLink, deployLink, slug, isLocal } = req.body;
  if (!title || !description || !image) {
    const projects = await storage.getProjects();
    const editProject = await storage.getProjectById(req.params.id);
    return res.render("admin", { projects, editProject, error: "Title, Description, and Image are required." });
  }
  try {
    await storage.updateProject(req.params.id, {
      title,
      description,
      image,
      githubLink,
      deployLink,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      isLocal: isLocal === "on" || isLocal === "true" || isLocal === true
    });
    res.redirect("/admin");
  } catch (err) {
    console.error("Error updating project:", err);
    const projects = await storage.getProjects();
    res.render("admin", { projects, editProject: null, error: "Failed to update project." });
  }
});

// Admin Delete Project POST
app.post("/admin/projects/delete/:id", requireAdmin, async (req, res) => {
  try {
    await storage.deleteProject(req.params.id);
    res.redirect("/admin");
  } catch (err) {
    console.error("Error deleting project:", err);
    res.redirect("/admin");
  }
});

// Contact form
app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;
  console.log("📩 Received:", name, email, message);

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    await transporter.sendMail({
      from: email,
      replyTo: email,
      to: process.env.MAIL_TO,
      subject: `Message from ${name}`,
      text: message
    });

    console.log("✅ Email sent!");
    return res.json({ success: true });

  } catch (error) {
    console.log("❌ Mail error:", error);
    return res.json({ success: false, error: error.message });
  }
});

// Listen only if run directly
if (require.main === module) {
  app.listen(port, () =>
    console.log(`🚀 Server running at http://localhost:${port}`)
  );
}

module.exports = app;

 