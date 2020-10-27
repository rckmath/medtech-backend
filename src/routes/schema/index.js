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
    name: { ...stringValidation, optional: true, errorMessage: 'invalid_name' },
    phone: phoneValidation,
    cpf: { ...cpfValidation, optional: true },
    ip: ipValidation,
    email: emailValidation,
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
  signIn: {
    login: {
      in: 'body',
      isString: true,
      notEmpty: true,
      custom: {
        options: (login) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}/g.test(login) || /^[0-9]{11}/g.test(login),
      },
      errorMessage: 'invalid_login',
    },
    password: {
      in: 'body',
      isString: true,
      notEmpty: true,
      errorMessage: 'invalid_password',
    },
  },
};

schemaPackage.appointment = {
  create: {
    patientId: {
      in: 'body',
      isUUID: true,
      errorMessage: 'invalid_patient_id',
    },
    at: {
      in: 'body',
      custom: {
        options: (date) => dayjs(date, 'YYYY-MM-DDTHH:mm:ss').isValid(),
      },
      errorMessage: 'invalid_appointment_date',
    },
  },
  update: {
    at: {
      in: 'body',
      custom: {
        options: (date) => dayjs(date, 'YYYY-MM-DDTHH:mm:ss').isValid(),
      },
      optional: true,
      errorMessage: 'invalid_appointment_date',
    },
  },
};

export default schemaPackage;
