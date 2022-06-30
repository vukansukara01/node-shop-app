import nodemailer from 'nodemailer'
import { defaultTemplate } from "./templates/default.template.js";

export const sendVerificationEmail = async (email, token) => {
    const url = "http://localhost:3000/verification?email=" + email

    const data = {
        title: "Verification",
        description: "Hello welcome to Node.js course hope you enjoy",
        token,
        url,
    }

    return await sendEmail([email], "Verification", data)
}

export const sendEmail = async (emails, subject, data) => {
    // get configurations
    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "a9f662fd1067ec",
            pass: "31992f17d5c5ed"
        }
    });

    const receivers = emails.join(", ").toString()

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Node 2022 👻" <no-reply@q-station.io>', // sender address
        to: receivers, // list of receivers
        subject: subject, // Subject line
        // text: text, // plain text body
        html: defaultTemplate(data), // html body
    });
}