// NOT USED Temporarily
const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

router.post('/send-email', async (req, res) => {
  const { question } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com', // Replace with your email
      pass: 'your-email-password',  // Replace with your email password or app-specific password
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'philip910323@gmail.com',
    subject: 'New Question from User',
    text: `User Question: ${question}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    res.status(500).send('Failed to send email');
  }
});

module.exports = router;
