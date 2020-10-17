import nodemailer from 'nodemailer';
import Constants from '../utils/constants';

const getTransporter = (accessToken) => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: Constants.mailing.email,
    clientId: Constants.google.clientId,
    clientSecret: Constants.google.clientSecret,
    refreshToken: Constants.google.clientRefreshToken,
    accessToken,
  },
});

export default class Mail {
  static async send(access, to, subject, html, attachments) {
    const smtpTransport = getTransporter(access);

    const mailOptions = {
      from: `"${Constants.mailing.alias}" <${Constants.mailing.email}>`,
      to,
      subject,
      html,
      attachments,
    };

    await smtpTransport.sendMail(mailOptions);
    smtpTransport.close();
  }
}
