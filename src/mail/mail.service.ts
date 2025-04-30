import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendResetPasswordEmail(to: string, token: string) {
    const resetUrl = `https://tu-frontend.com/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: `"Soporte" <${process.env.MAIL_USER}>`,
      to,
      subject: 'Recuperación de contraseña',
      html: `
        <h3>Recuperación de contraseña</h3>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Este enlace expirará en 10 minutos.</p>
      `,
    });
  }
}