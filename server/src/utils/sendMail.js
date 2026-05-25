import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 15000, // 15 seconds
    greetingTimeout: 15000,
    family: 4 // Force IPv4 to bypass Render IPv6 routing issues
});

export default transporter;