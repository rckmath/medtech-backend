import express from 'express';
import httpStatus from 'http-status';
import { param, body, validationResult } from 'express-validator';
import schemaPackage from '../schema';
import UserService from '../../services/user';
import UserType from '../../enums/user-type';
import { schemaValidation, authenticate, authorize } from '../middlewares';
import { ValidationCodeError } from '../../utils/error/business-errors';
import { controllerPaginationHelper } from '../../utils/tools';
import { commonFilters, userFilters } from './filter';

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

routes.get('/',
  authenticate,
  authorize([UserType.ADMIN, UserType.MEDIC]),
  async (req, res, next) => {
    let response;

    try {
      const searchParameter = {
        ...controllerPaginationHelper(req),
        ...commonFilters(req),
        ...userFilters(req),
      };

      response = await UserService.getAllWithPagination(searchParameter, req.user);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.OK).json(response);
  });

routes.put('/update-password',
  authenticate,
  authorize([UserType.ADMIN, UserType.MEDIC, UserType.PATIENT]),
  body('oldPassword').isString().isLength({ min: 8 }).withMessage(ValidationCodeError.INVALID_PASSWORD),
  body('newPassword').isString().isLength({ min: 8 }).withMessage(ValidationCodeError.INVALID_PASSWORD),
  async (req, res, next) => {
    let response;

    try {
      validationResult(req).throw();
      response = await UserService.updatePassword(req.user.id, req.body);
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

routes.post('/recovery',
  body('email').isEmail().withMessage(ValidationCodeError.INVALID_EMAIL),
  async (req, res, next) => {
    let response;

    try {
      validationResult(req).throw();
      response = await UserService.generateRecoveryToken(req.body.email);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.OK).json(response);
  });

routes.post('/recovery/:token',
  param('token').isAlphanumeric().isLength({ min: 6, max: 6 }).withMessage(ValidationCodeError.INVALID_TOKEN),
  body('email').isEmail().withMessage(ValidationCodeError.INVALID_EMAIL),
  async (req, res, next) => {
    let response;

    try {
      validationResult(req).throw();
      response = await UserService.validateRecoveryToken(req.body.email, req.params.token);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.OK).json(response);
  });

routes.put('/recovery/:id',
  param('id').isUUID().withMessage(ValidationCodeError.INVALID_ID),
  body('password').isString().isLength({ min: 8 }).withMessage(ValidationCodeError.INVALID_PASSWORD),
  body('token').isString().isLength({ min: 6, max: 6 }).withMessage(ValidationCodeError.INVALID_TOKEN),
  async (req, res, next) => {
    let response;

    try {
      validationResult(req).throw();
      response = await UserService.recoveryPassword(req.params.id, req.body);
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
