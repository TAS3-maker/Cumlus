const nodemailer = require('nodemailer');
const crypto = require('crypto');
// Generate a 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
// Send OTP via email
const sendEmail = async (email, otp) => {
    try {
        // Create a test SMTP service account from Ethereal
        const testAccount = await nodemailer.createTestAccount();
        // Create a transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587, // For TLS
            secure: false, // Set false for port 587
            auth: {
                user: "cumulus545@gmail.com",
                pass: "capr cvjb vrxf ygbt",
            },
        });
        
        
        
        
        
        // Email content
        const mailOptions = {
            from: '"Cumulus" <cumulus545@gmail.com>', // sender address
            to: email, // recipient's email
            subject: "Your OTP Code", // subject line
            text: `Your OTP is ${otp}`, // plain text body
            html: `<p>Your OTP is <strong>${otp}</strong>.</p>`, // HTML body
        };
        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info)); // Preview URL for testing
        return { success: true, previewURL: nodemailer.getTestMessageUrl(info) };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error };
    }
};
module.exports = { generateOTP, sendEmail };