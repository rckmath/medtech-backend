import { checkSchema, validationResult } from 'express-validator';

export default function schemaValidation(schema) {
  return [checkSchema(schema), (req, _res, next) => {
    try {
      validationResult(req).throw();
      next();
    } catch (err) {
      next(err);
    }
  }];
}
