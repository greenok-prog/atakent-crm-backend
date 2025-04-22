import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendTicket(email: string, pdfBuffer: Buffer, filename: string) {
    await this.transporter.sendMail({
      from: `"Expo Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Ваш электронный билет на выставку',
      text: 'Спасибо за регистрацию! Ваш билет во вложении.',
      attachments: [
        {
          filename: filename,
          content: pdfBuffer,
        },
      ],
    });
  }
}
