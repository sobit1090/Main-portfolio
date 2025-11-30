require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/projects/:project", (req, res) => {
  res.render(`projects/${req.params.project}`);
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

app.listen(port, () =>
  console.log(`🚀 Server running at http://localhost:${port}`)
);
 