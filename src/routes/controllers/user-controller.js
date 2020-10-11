import express from 'express';
import httpStatus from 'http-status';
import { checkSchema, param, validationResult } from 'express-validator';
import UserType from '../../enums/user-type';
import UserService from '../../services/user';

const routes = express.Router();

routes.post('/',
  async (req, res) => {
    let response;

    try {
      response = await UserService.create(req.body);
    } catch (err) {
      throw new Error(err.message);
    }

    return res.status(httpStatus.CREATED).json(response);
  });

routes.get('/:id',
  async (req, res) => {
    let response;

    try {
      response = await UserService.getById(req.params.id);
    } catch (err) {
      throw new Error(err.message);
    }

    return res.status(httpStatus.OK).json(response);
  });

routes.put('/:id',
  async (req, res) => {
    let response;

    try {
      response = await UserService.updateById(req.params.id, req.body);
    } catch (err) {
      throw new Error(err.message);
    }

    return res.status(httpStatus.OK).json(response);
  });

routes.delete('/:id',
  async (req, res) => {
    let response;

    try {
      response = await UserService.deleteById(req.params.id);
    } catch (err) {
      throw new Error(err.message);
    }

    return res.status(httpStatus.OK).json(response);
  });

export default routes;
