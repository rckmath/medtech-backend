const ValidationCodeError = {
  INVALID_ID: 'invalid_id',
  INVALID_PARAMS: 'invalid_params',
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
};

export {
  UserCodeError,
  MedicCodeError,
  ValidationCodeError,
  AuthCodeError,
  AppointmentCodeError,
};
