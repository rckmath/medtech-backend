import { Op } from 'sequelize';
import httpStatus from 'http-status';
import ModelRepository from '../db/repository';
import db from '../db/database';
import ExtendableError from '../utils/error/extendable';
import { UserCodeError } from '../utils/error/business-errors';
import ErrorType from '../enums/error-type';

const UserModel = db.models.User;

const PrivateMethods = {
  checkIfUserExists: (exists, user) => {
    const emailExists = user.email === exists.email;
    const cpfExists = user.cpf === exists.cpf;

    if (cpfExists) {
      throw new ExtendableError(
        ErrorType.BUSINESS,
        UserCodeError.CPF_ALREADY_REGISTERED,
        httpStatus.CONFLICT,
      );
    }

    if (emailExists || cpfExists) {
      throw new ExtendableError(
        ErrorType.BUSINESS,
        UserCodeError.EMAIL_ALREADY_REGISTERED,
        httpStatus.CONFLICT,
      );
    }
  },
};

const Toolbox = {
  getExistentUser: async (user) => {
    const or = [];

    if (user.cpf) { or.push({ cpf: user.cpf }); }

    if (user.email) { or.push({ email: user.email }); }

    const exists = await ModelRepository.selectOne(UserModel, {
      where: { [Op.or]: or, deletedAt: null },
    });

    if (exists) { PrivateMethods.checkIfUserExists(exists, user); }

    return exists;
  },
};

export default class UserService {

  static async create(user, actor) {
    await Toolbox.getExistentUser(user);

    return ModelRepository.create(UserModel, {
      name: user.name,
      cpf: user.cpf,
      email: user.email,
      password: user.password,
      cellphone: user.cellphone,
      birthday: user.birthday,

      genderType: user.gender,
      userType: user.type,

      ip: user.ip,

      createdBy: actor && actor.id,
    });
  }

  static async getById(id) {
    const user = await ModelRepository.selectOne(UserModel, { where: { id, deletedAt: null } });

    if (!user) {
      throw new ExtendableError(
        ErrorType.BUSINESS,
        UserCodeError.USER_NOT_FOUND,
        httpStatus.BAD_REQUEST,
      );
    }

    return user;
  }

  static async updateById(id, user, actor) {
    await ModelRepository.updateById(UserModel, id, {
      name: user.name,
      cellphone: user.cellphone,

      ip: user.ip,

      updatedBy: actor && actor.id,
    });
  }

  static async deleteById(id, actor) {
    await Promise.all([
      UserService.getById(id),
      ModelRepository.deleteById(UserModel, id, actor && actor.id),
    ]);
  }
}
