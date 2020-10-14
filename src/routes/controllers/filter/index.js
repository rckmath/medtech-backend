import { createDtRangeSearch, stringTrim } from './helper';

export const commonFilters = (req) => {
  let searchParameter = {};

  searchParameter = createDtRangeSearch(searchParameter, 'createdAtRange', req.query.createdAtRange);
  searchParameter = createDtRangeSearch(searchParameter, 'updatedAtRange', req.query.updatedAtRange);

  return searchParameter;
};

export const appointmentFilters = (req) => {
  let searchParameter = {};

  if (req.query.patientId) {
    searchParameter.patientId = req.query.patientId;
  }

  if (req.query.medicId) {
    searchParameter.medicId = req.query.medicId;
  }

  if (req.query.status) {
    searchParameter.status = req.query.status.split(',');
  }

  searchParameter = createDtRangeSearch(searchParameter, 'appointmentAtRange', req.query.appointmentAtRange);

  return searchParameter;
};

export const userFilters = (req) => {
  let searchParameter = {};

  searchParameter = stringTrim(searchParameter, 'email', req.query.email);
  searchParameter = stringTrim(searchParameter, 'name', req.query.name);
  searchParameter = stringTrim(searchParameter, 'cpf', req.query.cpf);

  if (req.query.userType) {
    searchParameter.userType = req.query.userType.split(',');
  }

  return searchParameter;
};

export const medicFilters = (req) => {
  let searchParameter = {};

  searchParameter = stringTrim(searchParameter, 'regUf', req.query.regUf);
  searchParameter = stringTrim(searchParameter, 'specialization', req.query.specialization);

  return searchParameter;
};
