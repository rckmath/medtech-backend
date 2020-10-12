const cpfValidation = {
  in: 'body',
  custom: {
    options: (cpf) => /^[0-9]{11}/g.test(cpf),
  },
  optional: false,
  errorMessage: 'invalid_cpf',
};

const phoneValidation = {
  in: 'body',
  custom: {
    options: (phone) => /^[0-9]{10,11}$/g.test(phone),
  },
  optional: true,
  errorMessage: 'invalid_phone',
};

const stringValidation = {
  in: 'body',
  isString: true,
  notEmpty: true,
  errorMessage: 'invalid_string',
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

const passwordValidation = {
  in: 'body',
  isString: true,
  notEmpty: true,
  isLength: {
    options: { min: 8 },
  },
  errorMessage: 'invalid_password',
};

const ipValidation = {
  in: 'body',
  isIP: true,
  optional: true,
  errorMessage: 'invalid_ip_address',
};

export {
  cpfValidation,
  phoneValidation,
  emailValidation,
  passwordValidation,
  stringValidation,
  ipValidation,
};
