import express from 'express';
import httpStatus from 'http-status';
import { param, validationResult } from 'express-validator';
import schemaPackage from '../schema';
import MedicService from '../../services/medic';
import UserType from '../../enums/user-type';
import { schemaValidation, authenticate, authorize } from '../middlewares';
import { ValidationCodeError } from '../../utils/error/business-errors';

const routes = express.Router();

routes.post('/',
  schemaValidation(schemaPackage.medic.create),
  async (req, res, next) => {
    let response;

    try {
      response = await MedicService.create(req.body);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.CREATED).json(response);
  });

routes.get('/:id',
  authenticate,
  authorize([UserType.ADMIN]),
  param('id').isNumeric().withMessage(ValidationCodeError.INVALID_ID),
  async (req, res, next) => {
    let response;

    try {
      validationResult(req).throw();
      response = await MedicService.getById(req.params.id);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.OK).json(response);
  });

routes.put('/:id',
  authenticate,
  authorize([UserType.ADMIN]),
  param('id').isNumeric().withMessage(ValidationCodeError.INVALID_ID),
  schemaValidation(schemaPackage.user.update),
  async (req, res, next) => {
    let response;

    try {
      response = await MedicService.updateById(req.params.id, req.body);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.OK).json(response);
  });

export default routes;
