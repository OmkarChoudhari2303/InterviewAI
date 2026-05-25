import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    family: 4 // Force IPv4 to bypass cloud hosting IPv6 lookup/routing issues
})

export default transporter;