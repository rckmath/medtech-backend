import { Op } from 'sequelize';
import httpStatus from 'http-status';
import ModelRepository from '../db/repository';
import db from '../db/database';
import ExtendableError from '../utils/error/extendable';
import { AuthCodeError } from '../utils/error/business-errors';
import ErrorType from '../enums/error-type';
import { sha256 } from '../utils/tools';

const UserModel = db.models.User;

export default class AuthService {
  static async login(email, password) {
    const user = await ModelRepository.selectOne(UserModel, {
      where: {
        email,
        password: sha256(password),
        deletedAt: null,
      },
      attributes: ['id', 'name', 'email'],
    });

    if (!user) {
      throw new ExtendableError(
        ErrorType.UNAUTHORIZED,
        AuthCodeError.BAD_CREDENTIALS,
        httpStatus.UNAUTHORIZED,
      );
    }

    const response = await AuthService.generateToken(user.toJSON());

    return response;
  }

  static async generateToken(user) {
    
  }
}
