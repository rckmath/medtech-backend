const cpfValidation = {
  in: 'body',
  custom: {
    options: (cpf) => /^[0-9]{11}/g.test(cpf),
  },
  optional: false,
  errorMessage: 'invalid_cpf',
};

const cellphoneValidation = {
  in: 'body',
  custom: {
    options: (cellphone) => /^[0-9]{13,14}$/g.test(cellphone),
  },
  optional: true,
  errorMessage: 'invalid_cellphone',
};

const emailValidation = {
  in: 'body',
  isEmail: true,
  customSanitizer: {
    options: (val) => val && val.toLowerCase(),
  },
  optional: true,
  errorMessage: 'invalid_email',
};

export {
  cpfValidation,
  cellphoneValidation,
  emailValidation,
};
