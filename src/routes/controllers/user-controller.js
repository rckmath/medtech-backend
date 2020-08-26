import express from 'express';
import httpStatus from 'http-status';
import { checkSchema, param, validationResult } from 'express-validator';
import UserType from '../../enums/user-type';
import UserService from '../../services/user';

const routes = express.Router();

routes.get('/',
  async (req, res) => res.json({
    hello_world: "Teste!", 
  }));

routes.post('/',
  async (req, res) => {
    let response;

    try {
      response = await UserService.create(req.body, req.user);
    } catch (err) {
      throw err;
    }
    
    return res.status(httpStatus.OK).json(response);
  });

export default routes;
