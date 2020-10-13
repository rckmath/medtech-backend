import express from 'express';
import httpStatus from 'http-status';
import { param, validationResult } from 'express-validator';
import schemaPackage from '../schema';
import UserService from '../../services/user';
import UserType from '../../enums/user-type';
import { schemaValidation, authenticate, authorize } from '../middlewares';
import { ValidationCodeError } from '../../utils/error/business-errors';

const routes = express.Router();

routes.post('/',
  schemaValidation(schemaPackage.user.create),
  async (req, res, next) => {
    let response;

    try {
      response = await UserService.createPatient(req.body);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.CREATED).json(response);
  });

routes.post('/admin',
  authenticate,
  authorize([UserType.ADMIN]),
  schemaValidation(schemaPackage.user.create),
  async (req, res, next) => {
    let response;

    try {
      response = await UserService.create(req.body, req.user);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.CREATED).json(response);
  });

routes.get('/me',
  authenticate,
  authorize([UserType.ADMIN, UserType.MEDIC, UserType.PATIENT]),
  async (req, res, next) => {
    let response;

    try {
      response = await UserService.getById(req.user.id);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.OK).json(response);
  });

routes.get('/:id',
  authenticate,
  authorize([UserType.ADMIN]),
  param('id').isUUID().withMessage(ValidationCodeError.INVALID_ID),
  async (req, res, next) => {
    let response;

    try {
      validationResult(req).throw();
      response = await UserService.getById(req.params.id, req.user);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.OK).json(response);
  });

routes.put('/:id',
  authenticate,
  authorize([UserType.ADMIN, UserType.MEDIC, UserType.PATIENT]),
  param('id').isUUID().withMessage(ValidationCodeError.INVALID_ID),
  schemaValidation(schemaPackage.user.update),
  async (req, res, next) => {
    let response;

    try {
      response = await UserService.updateById(req.params.id, req.body, req.user);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.OK).json(response);
  });

routes.delete('/:id',
  authenticate,
  authorize([UserType.ADMIN]),
  param('id').isUUID().withMessage(ValidationCodeError.INVALID_ID),
  async (req, res, next) => {
    let response;

    try {
      validationResult(req).throw();
      response = await UserService.deleteById(req.params.id, req.user);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.OK).json(response);
  });

export default routes;
