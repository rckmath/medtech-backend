import { createDtRangeSearch, stringTrim } from './helper';

const commonFilters = (req) => {
  let searchParameter = {};

  searchParameter = stringTrim(searchParameter, 'email', req.query.email);
  searchParameter = stringTrim(searchParameter, 'name', req.query.name);
  searchParameter = stringTrim(searchParameter, 'cpf', req.query.cpf);

  searchParameter = createDtRangeSearch(searchParameter, 'createdAtRange', req.query.createdAtRange);
  searchParameter = createDtRangeSearch(searchParameter, 'updatedAtRange', req.query.updatedAtRange);

  return searchParameter;
};

const userFilters = (req) => {

};

// eslint-disable-next-line import/prefer-default-export
export const getAllFilter = (req) => {
  const searchParameter = {};

  if (req.query.userType) {
    searchParameter.userType = req.query.userType;
  }

  return searchParameter;
};
