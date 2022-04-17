import nodemailer from 'nodemailer';
import { config } from './const';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.selfEmail,
    pass: config.selfEmailToken,
  },
});
if (config.dev) {
  transporter.setupProxy('http://127.0.0.1:10809')
}

export function sendDefaultMail({ subject, text, html }: { subject?: string; text?: string; html?: string }) {
  return transporter.sendMail({
    from: config.selfEmail,
    to: config.targetEmail,
    subject: subject || 'Github Action触发',
    text,
    html: html || text
  });
}