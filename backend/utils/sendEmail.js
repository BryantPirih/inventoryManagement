const nodemailer = require('nodemailer');
require('dotenv').config(); 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async ({ to, subject, text }) => {
  const mailOptions = {
    from: `"Neo Inventory" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}: ${result.response}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send to ${to}:`, error);
    throw error;
  }
};

module.exports = sendEmail;
