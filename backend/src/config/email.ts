// src/config/email.ts
import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Create a compatible interface to match your existing code
export default {
    send: (msg: any) => {
        console.log('Attempting to send email:', {
            to: msg.to,
            from: msg.from,
            subject: msg.subject
        });

        try {
            const result = resend.emails.send({
                from: msg.from,
                to: msg.to,
                subject: msg.subject,
                html: msg.html
            });
            console.log('Email send result:', result);
            return result;
        } catch (error) {
            console.error('Email send error:', error);
            throw error;
        }
    }
};