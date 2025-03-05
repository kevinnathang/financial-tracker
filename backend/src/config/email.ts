// src/config/email.ts
import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Create a compatible interface to match your existing code
export default {
    send: (msg: any) => {
        return resend.emails.send({
            from: msg.from,
            to: msg.to,
            subject: msg.subject,
            html: msg.html
        });
    }
};