const ValidationCodeError = {
  INVALID_ID: 'invalid_id',
  INVALID_PARAMS: 'invalid_params',
  INVALID_EMAIL: 'invalid_email',
  INVALID_TOKEN: 'invalid_token',
  INVALID_PASSWORD: 'invalid_password',
  BAD_PASSWORD: 'bad_password',
  OLD_AND_NEW_PASSWORD_ARE_THE_SAME: 'old_and_new_password_are_the_same',
};
const UserCodeError = {
  USER_NOT_FOUND: 'user_not_found',
  CPF_ALREADY_REGISTERED: 'cpf_already_registered',
  EMAIL_ALREADY_REGISTERED: 'email_already_registered',
};

const MedicCodeError = {
  MEDIC_NOT_FOUND: 'medic_not_found',
  CRM_ALREADY_REGISTERED: 'crm_already_registered',
};

const AppointmentCodeError = {
  APPOINTMENT_NOT_FOUND: 'appointment_not_found',
};

const AuthCodeError = {
  BAD_CREDENTIALS: 'bad_credentials',
  ACCESS_NOT_ALLOWED: 'access_not_allowed',
  AUTHENTICATION_FAILED: 'authentication_failed',
};

export {
  UserCodeError,
  MedicCodeError,
  ValidationCodeError,
  AuthCodeError,
  AppointmentCodeError,
};
