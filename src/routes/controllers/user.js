import express from 'express';
import httpStatus from 'http-status';
import { param, validationResult } from 'express-validator';
import schemaPackage from '../schema';
import UserService from '../../services/user';
import schemaValidation from '../middlewares/schema-validation';
import { ValidationCodeError } from '../../utils/error/business-errors';

const routes = express.Router();

routes.post('/',
  schemaValidation(schemaPackage.user.create),
  async (req, res, next) => {
    let response;

    try {
      response = await UserService.create(req.body);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.CREATED).json(response);
  });

routes.get('/:id',
  param('id').isNumeric().withMessage(ValidationCodeError.INVALID_ID),
  async (req, res, next) => {
    let response;

    try {
      validationResult(req).throw();
      response = await UserService.getById(req.params.id);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.OK).json(response);
  });

routes.put('/:id',
  param('id').isNumeric().withMessage(ValidationCodeError.INVALID_ID),
  schemaValidation(schemaPackage.user.update),
  async (req, res, next) => {
    let response;

    try {
      response = await UserService.updateById(req.params.id, req.body);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.OK).json(response);
  });

routes.delete('/:id',
  param('id').isNumeric().withMessage(ValidationCodeError.INVALID_ID),
  async (req, res, next) => {
    let response;

    try {
      validationResult(req).throw();
      response = await UserService.deleteById(req.params.id);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.OK).json(response);
  });

export default routes;
