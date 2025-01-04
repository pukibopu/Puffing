require('dotenv').config();
const nodemailer = require('nodemailer');



const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_RECIPIENT = process.env.EMAIL_RECIPIENT;

const transporter = nodemailer.createTransport({
    service: 'gmail', // 使用 Gmail 服务，替换为你的邮件服务商
    auth: {
        user: EMAIL_USER, // 从环境变量加载
        pass: EMAIL_PASS, // 从环境变量加载
    },
});

const sendEmail = async  (subject, message)=> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_RECIPIENT,
        subject: subject,
        text: message,
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log(`Email sent: ${info.response}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

module.exports=sendEmail



