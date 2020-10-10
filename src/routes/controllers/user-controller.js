import express from 'express';
import httpStatus from 'http-status';
import { checkSchema, param, validationResult } from 'express-validator';
import UserType from '../../enums/user-type';
import UserService from '../../services/user';

const routes = express.Router();

routes.post('/',
  async (req, res) => {
    const response = await UserService.create(req.body, req.user);

    return res.status(httpStatus.OK).json(response);
  });

export default routes;
