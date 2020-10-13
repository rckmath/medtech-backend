import dayjs from 'dayjs';
import validator from 'validator';
import GenderType from '../../enums/gender-type';
import UserType from '../../enums/user-type';
import StateCode from '../../enums/state-uf-list';
import {
  emailValidation, cpfValidation, phoneValidation,
  stringValidation, ipValidation, passwordValidation,
} from '../validation';

const schemaPackage = {};

schemaPackage.user = {
  create: {
    name: { ...stringValidation, errorMessage: 'invalid_name' },
    cpf: cpfValidation,
    password: passwordValidation,
    email: { ...emailValidation, optional: false },
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
      optional: true,
      errorMessage: 'invalid_photo_file',
    },
    gender: {
      in: 'body',
      custom: {
        options: (gender) => Object.values(GenderType).some((o) => o === gender),
      },
      errorMessage: 'invalid_gender',
    },
    type: {
      in: 'body',
      custom: {
        options: (type) => Object.values(UserType).some((o) => o === type),
      },
      optional: true,
      errorMessage: 'invalid_user_type',
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
    type: {
      in: 'body',
      custom: {
        options: (type) => Object.values(UserType).some((o) => o === type),
      },
      optional: true,
      errorMessage: 'invalid_user_type',
    },
  },
};

schemaPackage.medic = {
  create: {
    regNum: {
      in: 'body',
      isInt: true,
      errorMessage: 'invalid_crm_number',
    },
    regUf: {
      in: 'body',
      custom: {
        options: (state) => StateCode.find((o) => o === state),
      },
      errorMessage: 'invalid_uf',
    },
    specialization: { ...stringValidation, errorMessage: 'invalid_specialization' },
    ...schemaPackage.user.create,
  },
  update: {
    regNum: {
      in: 'body',
      isInt: true,
      optional: true,
      errorMessage: 'invalid_crm_number',
    },
    regUf: {
      in: 'body',
      custom: {
        options: (state) => StateCode.find((o) => o === state),
      },
      optional: true,
      errorMessage: 'invalid_uf',
    },
    specialization: { ...stringValidation, optional: true, errorMessage: 'invalid_specialization' },
    scheduleStartsAt: {
      in: 'body',
      custom: {
        options: (time) => dayjs(time, 'HH:mm:ss', true).isValid(),
      },
      optional: true,
      errorMessage: 'invalid_schedule_time',
    },
    scheduleEndsAt: {
      in: 'body',
      custom: {
        options: (time) => dayjs(time, 'HH:mm:ss', true).isValid(),
      },
      optional: true,
      errorMessage: 'invalid_schedule_time',
    },
  },
};

schemaPackage.auth = {
  signin: {
    login: {
      in: 'body',
      custom: {
        options: (login) => validator.isEmail(login) || /^[0-9]{11}/g.test(login),
      },
      customSanitizer: {
        options: (login) => login && login.toLowerCase(),
      },
      errorMessage: 'invalid_login',
    },
    password: passwordValidation,
  },
};

schemaPackage.appointment = {
  create: {

  },
  update: {

  },
};

export default schemaPackage;
