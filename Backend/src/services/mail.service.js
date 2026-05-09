import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GOOGLE_EMAIL_USER,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });

transporter.verify()
    .then(() => {
        console.log("Email transporter is ready to send emails");
    }).catch((err) => {
        console.error("Email transporter verification failed", err)
    })


export const sendEmail = async ({to, subject, text, html}) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.GOOGLE_EMAIL_USER, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        });

        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};



