const express = require("express");
const nodemailer = require("nodemailer");


const app = express();
const port = 3000;

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

// Routes
app.get("/s", (req, res) => {
  res.render("index");
});

app.get("/projects/shorting_visualizer", (req, res) => {
  res.render("projects/shorting_visualizer");
});

app.get("/projects/project2", (req, res) => {
  res.render("projects/project2");
});

// Contact form POST route
app.post("/send", (req, res) => {
  const { name, email, message } = req.body;
  console.log("📩 Data received:", name, email, message);

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sobitgautam934@gmail.com",
      pass: "oqzl wfdx utey ubhd" // Gmail App Password
    }
  });

  let mailOptions = {
    from: email,
    replyTo: email,
    to: "sobitgautam811@gmail.com",
    subject: `Message from ${name}`,
    text: message
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Email error:", error);
      return res.json({ success: false, error: error.message });
    } else {
      console.log("✅ Email sent:", info.response);
      return res.json({ success: true });
    }
  });
});



app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});