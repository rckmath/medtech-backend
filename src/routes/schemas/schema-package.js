import {
  emailValidation,
  cpfValidation,
  cellphoneValidation,
} from '../validation';

const schemaPackage = {};

schemaPackage.user = {
  create: {
    cpf: cpfValidation,
    email: emailValidation,
  },
  update: {
    cellphone: cellphoneValidation,
  },
};

export default schemaPackage;
