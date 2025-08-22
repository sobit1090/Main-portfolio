const nodemailer = require("nodemailer");

// 1. Create a transporter
let transporter = nodemailer.createTransport({
  service: "gmail", // or use "smtp.mailtrap.io", "outlook", etc.
  auth: {
    user: "sobitgautam934@gmail.com",
    pass: "oqzl wfdx utey ubhd" // NOT your Gmail password, use App Passwords
  }
});

// 2. Set up email options
let mailOptions = {
  from: "sobitgautam934@gmail.com",
  to: "sobitgautam811@gmail.com",
  subject: "Message from thr Portfolio",
  text: "This is a test email sent using Nodemailer!"
};

// 3. Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log("Error:", error);
  } else {
    console.log("Email sent:", info.response);
  }
});