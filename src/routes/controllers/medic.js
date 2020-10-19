import express from 'express';
import httpStatus from 'http-status';
import { param, validationResult } from 'express-validator';
import schemaPackage from '../schema';
import MedicService from '../../services/medic';
import UserType from '../../enums/user-type';
import { schemaValidation, authenticate, authorize } from '../middlewares';
import { ValidationCodeError } from '../../utils/error/business-errors';
import { controllerPaginationHelper } from '../../utils/tools';
import { commonFilters, userFilters, medicFilters } from './filter';

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
  param('id').isUUID().withMessage(ValidationCodeError.INVALID_ID),
  async (req, res, next) => {
    let response;

    try {
      validationResult(req).throw();
      response = await MedicService.getById(req.params.id, req.user);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.OK).json(response);
  });

routes.get('/',
  authenticate,
  authorize([UserType.ADMIN, UserType.PATIENT]),
  async (req, res, next) => {
    let response;

    try {
      const searchParameter = {
        ...controllerPaginationHelper(req),
        ...commonFilters(req),
        ...userFilters(req),
        ...medicFilters(req),
      };

      response = await MedicService.getAllWithPagination(searchParameter);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.OK).json(response);
  });

routes.put('/:id',
  authenticate,
  authorize([UserType.ADMIN, UserType.MEDIC]),
  param('id').isUUID().withMessage(ValidationCodeError.INVALID_ID),
  schemaValidation(schemaPackage.medic.update),
  async (req, res, next) => {
    let response;

    try {
      response = await MedicService.updateById(req.params.id, req.body, req.user);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.OK).json(response);
  });

export default routes;
