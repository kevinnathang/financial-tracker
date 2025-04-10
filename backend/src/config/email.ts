// src/config/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default {
    send: (msg: any) => {
        try {
            const result = resend.emails.send({
                from: msg.from,
                to: msg.to,
                subject: msg.subject,
                html: msg.html
            });
            return result;
        } catch (error) {
            console.error('Email send error:', error);
            throw error;
        }
    }
};