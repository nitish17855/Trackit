import nodemailer from "nodemailer"
import dotenv from "dotenv";
import db from "../Backened/src/db/index.js"
import pending_tasks from "./email.js"
import { eq } from "drizzle-orm";
import { scheduleTable } from "../Backened/src/db/schema.js";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendEmail(to, subject, text) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };

    await transporter.sendMail(mailOptions);

    console.log(`Email sent to ${to}`);
}

for (const job of pending_tasks) {
    console.log(job);
console.log("Email:", job.email);
   if (!job.email) {
        console.log(`Skipping job ${job.id}: no email found`);
        continue;
     }

    if (job.send_email === false) {

        await sendEmail(
            job.email,
            job.title,
            `Mr ${job.name}, your ${job.title} is pending. Please complete it.`
        );

        await db
            .update(scheduleTable)
            .set({
                send_email: true
            })
            .where(eq(scheduleTable.id, job.id));

        console.log(`Updated send_email for ${job.email}`);
    }
}