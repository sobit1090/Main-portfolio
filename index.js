const express = require("express");
const nodemailer = require("nodemailer");


const app = express();
const port = 3001;

// Middleware
app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }))

 

// Routes

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/projects/shorting_visualizer", (req, res) => {
  res.render("projects/shorting_visualizer");
});

app.get("/projects/To-Do-List", (req, res) => {
  res.render("projects/to_do_list");
});
app.get("/projects/movie", (req, res) => {
  res.render("projects/movie");
});

app.get("/projects/LosPollos", (req, res) => {
  res.render("projects/LosPollos");
});
app.get("/projects/password_generator", (req, res) => {
  res.render("projects/password_generator");
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
