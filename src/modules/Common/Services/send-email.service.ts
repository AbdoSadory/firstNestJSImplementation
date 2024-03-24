import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class SendEmailService {
  constructor() {}

  sendEmail = async (
    to: string = '',
    subject: string = 'no-reply',
    message: string = '<h1>no-message</h1>',
    attachments?: [],
  ) => {
    // email configuration
    const transporter = nodemailer.createTransport({
      host: 'localhost', // smtp.gmail.com
      service: 'gmail',
      port: 587,
      secure: false,
      auth: {
        user: 'abdo.sadory94@gmail.com',
        pass: 'drsuedcaskynzepf',
      },
    });

    const info = await transporter.sendMail({
      from: `"Fred Foo 👻" <${process.env.EMAIL}>`,
      to,
      subject,
      html: message,
      attachments,
    });

    return info.accepted.length ? true : false;
  };
}
