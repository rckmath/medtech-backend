import nodemailer from 'nodemailer';
import GoogleAuthService from '../services/google/auth';
import Constants from '../utils/constants';

const getTransporter = (accessToken) => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: Constants.google.email,
    clientId: Constants.google.clientId,
    clientSecret: Constants.google.clientSecret,
    refreshToken: Constants.google.clientRefreshToken,
    accessToken,
  },
});

export default class Mail {
  static async send(to, subject, html, attachments) {
    const accessToken = await GoogleAuthService.OAuth();
    const smtpTransport = getTransporter(accessToken);

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
