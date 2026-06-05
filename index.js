require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

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

// Routes
app.get("/", (req, res) => {
  res.render("index");
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

 