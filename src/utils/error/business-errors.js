const ValidationCodeError = {
  INVALID_ID: 'invalid_id',
  INVALID_PARAMS: 'invalid_params',
  BAD_CREDENTIALS: 'bad_credentials',
};
const UserCodeError = {
  USER_NOT_FOUND: 'user_not_found',
  CPF_ALREADY_REGISTERED: 'cpf_already_registered',
  EMAIL_ALREADY_REGISTERED: 'email_already_registered',
};

export {
  UserCodeError,
  ValidationCodeError,
};
