import httpStatus from 'http-status';
import path from 'path';
import * as fs from 'fs';
import mjml2html from 'mjml';
import dayjs from 'dayjs';
import Mail from '../mechanisms/mailing';
import ExtendableError from '../utils/error/extendable';
import ErrorType from '../enums/error-type';
import { stringReplace } from '../utils/tools';
import GoogleAuthService from './google/auth';
import GenderType from '../enums/gender-type';

const readFile = (fileName) => new Promise((resolve, reject) => {
  const templatePath = path.join(__dirname, '../', 'templates/', 'mailing/', fileName);

  fs.readFile(templatePath, 'utf8', (err, template) => {
    if (err) { reject(err); }

    resolve(template);
  });
});

export default class MailService {
  static async sendRecoveryToken(user, recoveryToken) {
    try {
      let mjml = await readFile('password-recovery.mjml');

      mjml = stringReplace(mjml, {
        name: user.name,
        token: recoveryToken,
        year: new Date().getFullYear(),
      });

      const { html } = mjml2html(mjml, { minify: true });
      const access = await GoogleAuthService.OAuth();

      await Mail.send(access, user.email, 'Solicitação de recuperação de senha', html);
    } catch (err) {
      throw new ExtendableError(ErrorType.MAIL, err.message, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  static async sendRegister(user) {
    try {
      let mjml = await readFile('register.mjml');

      const [firstName] = user.name.split(' ');

      mjml = stringReplace(mjml, {
        name: firstName,
        year: new Date().getFullYear(),
      });

      const { html } = mjml2html(mjml, { minify: true });
      const access = await GoogleAuthService.OAuth();

      await Mail.send(access, user.email, `${firstName}, seja bem-vindo a MedTech!`, html);
    } catch (err) {
      throw new ExtendableError(ErrorType.MAIL, err.message, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  static async sendAppointment(appointment) {
    try {
      let mjml = await readFile('appointment.mjml');

      const date = dayjs(appointment.at).locale('pt-br').format('DD/MM');
      const hour = dayjs(appointment.at).locale('pt-br').format('HH:mm');

      let a = '';

      if (appointment.medic.user.genderType === GenderType.FEMALE) { a = 'a'; }

      const [firstName] = appointment.patient.name.split(' ');

      mjml = stringReplace(mjml, {
        name: firstName,
        medicName: `Dr${a}. ${appointment.medic.user.name}`,
        date,
        hour,
        year: new Date().getFullYear(),
      });

      const { html } = mjml2html(mjml, { minify: true });
      const access = await GoogleAuthService.OAuth();

      await Mail.send(access, appointment.patient.email, `${firstName}, sua consulta foi agendada`, html);
    } catch (err) {
      throw new ExtendableError(ErrorType.MAIL, err.message, httpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
