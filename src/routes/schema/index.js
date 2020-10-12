import dayjs from 'dayjs';
import GenderType from '../../enums/gender-type';
import {
  emailValidation, cpfValidation, phoneValidation,
  stringValidation, ipValidation, passwordValidation,
} from '../validation';

const schemaPackage = {};

schemaPackage.user = {
  create: {
    name: { ...stringValidation, errorMessage: 'invalid_name' },
    cpf: cpfValidation,
    email: emailValidation,
    password: passwordValidation,
    phone: { ...phoneValidation, optional: false },
    birthday: {
      in: 'body',
      isDate: true,
      custom: {
        options: (birthday) => dayjs(birthday).isBefore(dayjs()),
      },
      errorMessage: 'invalid_birthday',
    },
    profilePhoto: {
      in: 'body',
      custom: {
        // eslint-disable-next-line max-len
        options: (profilePhoto) => /^data:image\/(?:png|jpeg|jpg)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/g.test(profilePhoto),
      },
      errorMessage: 'invalid_photo_file',
    },
    gender: {
      in: 'body',
      custom: {
        options: (gender) => Object.values(GenderType).some((o) => o === gender),
      },
      errorMessage: 'invalid_gender',
    },
  },
  update: {
    phone: phoneValidation,
    ip: ipValidation,
    profilePhoto: {
      in: 'body',
      custom: {
        // eslint-disable-next-line max-len
        options: (profilePhoto) => /^data:image\/(?:png|jpeg|jpg)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/g.test(profilePhoto),
      },
      optional: true,
      errorMessage: 'invalid_photo_file',
    },
  },
};

schemaPackage.auth = {
  login: {
    email: emailValidation,
    password: passwordValidation,
  },
};

export default schemaPackage;
