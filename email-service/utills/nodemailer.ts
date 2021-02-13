import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import dotenv from 'dotenv';
import { IEmailHandler } from '../IntefacesAndTypes';

dotenv.config();

export class EmailHandler implements IEmailHandler {
  private transporter = nodemailer.createTransport(
    smtpTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER_GMAIL,
        pass: process.env.USER_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
  );

  public sendEmail(email: string, tag: string): void | Promise<boolean> {
    const mailOptions = {
      from: process.env.USER_GMAIL,
      to: email,
      subject: 'Your tag!',
      text: `Your tags have been updated! New tag ${tag}`,
    };
    this.transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log('Problem with sending an email! Error: ', err);
      } else {
        console.log('Email sent:' + info.response);
      }
    });
  }
}
