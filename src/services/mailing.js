import httpStatus from 'http-status';
import path from 'path';
import * as fs from 'fs';
import mjml2html from 'mjml';
import Mail from '../mechanisms/mailing';
import ExtendableError from '../utils/error/extendable';
import ErrorType from '../enums/error-type';
import { stringReplace } from '../utils/tools';
import GoogleAuthService from './google/auth';

const readFile = (filePath) => new Promise((resolve, reject) => {
  const htmlPath = path.join(__dirname, '../', 'templates/', 'mailing/', filePath);

  fs.readFile(htmlPath, 'utf8', (err, html) => {
    if (err) { reject(err); }

    resolve(html);
  });
});

export default class MailService {
  static async sendRecoveryMail(user, recoveryToken) {
    try {
      let mjml = await readFile('password-recovery.mjml');

      mjml = stringReplace(mjml, {
        name: user.name,
        token: recoveryToken,
        year: new Date().getFullYear(),
      });

      const { html } = mjml2html(mjml, { minify: true });
      const access = await GoogleAuthService.OAuth();

      await Mail.send(access, user.email, 'Recuperação de senha', html);
    } catch (err) {
      throw new ExtendableError(ErrorType.MAIL, err.message, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
