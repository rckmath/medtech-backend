import express from 'express';
import httpStatus from 'http-status';
import { param, validationResult } from 'express-validator';
import schemaPackage from '../schema';
import AuthService from '../../services/auth';
import schemaValidation from '../middlewares/schema-validation';
import { ValidationCodeError } from '../../utils/error/business-errors';

const routes = express.Router();

routes.post('/',
  schemaValidation(schemaPackage.auth.login),
  async (req, res, next) => {
    let response;

    try {
      response = await AuthService.login(req.body.email, req.body.password);
    } catch (err) {
      return next(err);
    }

    return res.status(httpStatus.A).json(response);
  });

export default routes;
