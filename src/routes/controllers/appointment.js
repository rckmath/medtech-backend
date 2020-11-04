import express from 'express';
import httpStatus from 'http-status';
import { param, validationResult } from 'express-validator';
import schemaPackage from '../schema';
import AppointmentService from '../../services/appointment';
import UserType from '../../enums/user-type';
import { schemaValidation, authenticate, authorize } from '../middlewares';
import { controllerPaginationHelper } from '../../utils/tools';
import { commonFilters, appointmentFilters } from './filter';
import { ValidationCodeError } from '../../utils/error/business-errors';

const routes = express.Router();

routes.post('/',
  authenticate,
  authorize([UserType.MEDIC]),
  schemaValidation(schemaPackage.appointment.create),
  async (req, res, next) => {
    let response;

    try {
      response = await AppointmentService.create(req.body, req.user);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.CREATED).json(response);
  });

routes.get('/my',
  authenticate,
  authorize([UserType.MEDIC, UserType.PATIENT]),
  async (req, res, next) => {
    let response;

    try {
      const searchParameter = {
        ...controllerPaginationHelper(req),
        ...commonFilters(req),
        ...appointmentFilters(req),
      };

      response = await AppointmentService.getAllMyAppointments(searchParameter, req.user);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.OK).json(response);
  });

routes.get('/:id',
  authenticate,
  authorize([UserType.ADMIN, UserType.MEDIC]),
  param('id').isUUID().withMessage(ValidationCodeError.INVALID_ID),
  async (req, res, next) => {
    let response;

    try {
      validationResult(req).throw();
      response = await AppointmentService.getById(req.params.id, req.user);
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
        ...appointmentFilters(req),
      };

      response = await AppointmentService.getAllWithPagination(searchParameter, req.user);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.OK).json(response);
  });

routes.put('/:id',
  authenticate,
  authorize([UserType.ADMIN, UserType.MEDIC]),
  param('id').isUUID().withMessage(ValidationCodeError.INVALID_ID),
  schemaValidation(schemaPackage.appointment.update),
  async (req, res, next) => {
    let response;

    try {
      response = await AppointmentService.updateById(req.params.id, req.body, req.user);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.OK).json(response);
  });

routes.delete('/:id',
  authenticate,
  authorize([UserType.ADMIN, UserType.MEDIC]),
  param('id').isUUID().withMessage(ValidationCodeError.INVALID_ID),
  async (req, res, next) => {
    let response;

    try {
      validationResult(req).throw();
      response = await AppointmentService.deleteById(req.params.id, req.user);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.OK).json(response);
  });

export default routes;
