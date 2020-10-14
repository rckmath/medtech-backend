import { Op } from 'sequelize';
import httpStatus from 'http-status';
import ModelRepository from '../db/repository';
import db from '../db/database';
import ExtendableError from '../utils/error/extendable';
import { UserCodeError } from '../utils/error/business-errors';
import ErrorType from '../enums/error-type';
import { serviceOrderHelper, sha256 } from '../utils/tools';
import UserType from '../enums/user-type';
import MedicService from './medic';
import SearchParameter from './search-parameters';

const UserModel = db.models.User;
const MedicModel = db.models.Medic;

const PrivateMethods = {
  checkIfUserExists: (exists, user) => {
    const emailExists = user.email === exists.email;
    const cpfExists = user.cpf === exists.cpf;

    if (cpfExists) {
      throw new ExtendableError(ErrorType.BUSINESS, UserCodeError.CPF_ALREADY_REGISTERED, httpStatus.CONFLICT);
    }

    if (emailExists) {
      throw new ExtendableError(ErrorType.BUSINESS, UserCodeError.EMAIL_ALREADY_REGISTERED, httpStatus.CONFLICT);
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
  static async createPatient(user) {
    user.type = UserType.PATIENT;

    return UserService.create(user);
  }

  static async create(user, actor) {
    await Toolbox.getExistentUser(user);

    if (user.type === UserType.MEDIC) {
      return MedicService.create(user, actor);
    }

    return ModelRepository.create(UserModel, {
      name: user.name,
      cpf: user.cpf,
      email: user.email,
      password: sha256(user.password),
      phone: user.phone,
      birthday: user.birthday,

      genderType: user.gender,
      userType: user.type,

      createdBy: actor && actor.id,
    });

  }

  static async getSimpleById(id) {
    const user = await ModelRepository.selectOne(UserModel, { where: { id, deletedAt: null } });

    if (!user) {
      throw new ExtendableError(ErrorType.BUSINESS, UserCodeError.USER_NOT_FOUND, httpStatus.BAD_REQUEST);
    }

    return user;
  }

  static async getById(id) {
    const user = await ModelRepository.selectOne(UserModel, {
      where: { id, deletedAt: null },
      include: {
        model: MedicModel,
        as: 'medic',
        where: { deletedAt: null },
        required: false,
      },
    });

    if (!user) {
      throw new ExtendableError(ErrorType.BUSINESS, UserCodeError.USER_NOT_FOUND, httpStatus.BAD_REQUEST);
    }

    return user;
  }

  static async getAllWithPagination(searchParameter, actor) {
    let response = null;
    let where = {};

    if (actor.userType === UserType.MEDIC) { where.userType = UserType.PATIENT; }

    const commonQuery = SearchParameter.createCommonQuery(searchParameter);
    const userQuery = SearchParameter.createUserQuery(searchParameter);

    where = { ...where, ...commonQuery.where, ...userQuery.where };

    response = await ModelRepository.selectWithPagination(UserModel, {
      where,
      offset: searchParameter.offset,
      limit: searchParameter.limit,
      order: [serviceOrderHelper(searchParameter)],
    });

    return response;
  }

  static async updateById(id, user, actor) {
    if (actor.userType !== UserType.ADMIN) {
      if (user.userType || user.cpf || user.email || user.name) {
        throw new ExtendableError(ErrorType.FORBIDDEN, 'Permission denied.', httpStatus.FORBIDDEN);
      }
    }

    await ModelRepository.updateById(UserModel, id, {
      userType: user.type,

      name: user.name,
      email: user.email,
      cpf: user.cpf,
      phone: user.phone,
      birthday: user.birthday,
      profilePhotoUrl: user.profilePhotoUrl,
      recoveryToken: user.recoveryToken,
      recoveryTokenExpiresAt: user.recoveryTokenExpiresAt,

      ip: user.ip,

      updatedBy: actor && actor.id,
    });
  }

  static async deleteById(id, actor) {
    const user = await UserService.getById(id);

    await Promise.all([
      ModelRepository.deleteById(UserModel, id, actor && actor.id),
      user.userType === UserType.MEDIC
        ? ModelRepository.deleteById(MedicModel, user.medic.id, actor && actor.id) : '',
    ]);
  }
}
