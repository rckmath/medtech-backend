import httpStatus from 'http-status';
import path from 'path';
import * as fs from 'fs';
import mjml2html from 'mjml';
import Mail from '../mechanisms/mailing';
import { stringReplace } from '../utils/tools';
import ExtendableError from '../utils/error/extendable';
import ErrorType from '../enums/error-type';

const readFile = (filePath) => new Promise((resolve, reject) => {
  const htmlPath = path.join(__dirname, '../', 'mail-templates/', filePath);

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
        userName: user.name,
        recoveryToken,
        year: new Date().getFullYear(),
      });

      const { html } = await mjml2html(mjml, { minify: true });

      await Mail.send(user.email, 'Recuperação de senha', html);
    } catch (err) {
      throw new ExtendableError(ErrorType.MISC, 'E-mail not sent', httpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
