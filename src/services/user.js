import { Op } from 'sequelize';
import crypto from 'crypto';
import dayjs from 'dayjs';
import httpStatus from 'http-status';
import ModelRepository from '../db/repository';
import db from '../db/database';
import ExtendableError from '../utils/error/extendable';
import { UserCodeError, ValidationCodeError } from '../utils/error/business-errors';
import ErrorType from '../enums/error-type';
import { serviceOrderHelper, sha256 } from '../utils/tools';
import UserType from '../enums/user-type';
import MedicService from './medic';
import SearchParameter from './search-parameters';
import MailService from './mailing';

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

    const response = await ModelRepository.create(UserModel, {
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

    MailService.sendRegister(response);

    return response;
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
      genderType: user.genderType,

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

  static async generateRecoveryToken(email) {
    const user = await ModelRepository.selectOne(UserModel, { where: { email, deletedAt: null } });

    if (!user) {
      throw new ExtendableError(ErrorType.BUSINESS, UserCodeError.USER_NOT_FOUND, httpStatus.BAD_REQUEST);
    }

    const recoveryToken = crypto.randomBytes(3).toString('hex').toUpperCase();

    await ModelRepository.updateById(UserModel, user.id, {
      recoveryToken, recoveryTokenExpiresAt: dayjs().add(30, 'minute').toDate(),
    });

    await MailService.sendRecoveryToken(user, recoveryToken);

    return { email };
  }

  static async validateRecoveryToken(email, recoveryToken) {
    const user = await ModelRepository.selectOne(UserModel, {
      attributes: ['id', 'recoveryToken'],
      where: {
        email,
        recoveryToken,
        recoveryTokenExpiresAt: { [Op.gt]: dayjs().toDate() },
        deletedAt: null,
      },
    });

    if (!user) {
      throw new ExtendableError(ErrorType.BUSINESS, ValidationCodeError.INVALID_TOKEN, httpStatus.BAD_REQUEST);
    }

    return user;
  }

  static async recoveryPassword(id, { token: recoveryToken, password }) {
    const user = await ModelRepository.selectOne(UserModel, {
      attributes: ['id'],
      where: {
        id,
        recoveryToken,
        recoveryTokenExpiresAt: { [Op.gt]: dayjs().toDate() },
        deletedAt: null,
      },
    });

    if (!user) {
      await ModelRepository.updateById(UserModel, id, {
        recoveryToken: null,
        recoveryTokenExpiresAt: null,
      });

      throw new ExtendableError(ErrorType.BUSINESS, UserCodeError.USER_NOT_FOUND, httpStatus.BAD_REQUEST);
    }

    password = sha256(password);

    await ModelRepository.updateById(UserModel, id, {
      password,
      recoveryToken: null,
      recoveryTokenExpiresAt: null,
    });
  }

  static async updatePassword(id, { oldPassword, newPassword }) {
    if (oldPassword === newPassword) {
      throw new ExtendableError(
        ErrorType.BUSINESS,
        ValidationCodeError.OLD_AND_NEW_PASSWORD_ARE_THE_SAME,
        httpStatus.BAD_REQUEST,
      );
    }

    const user = await ModelRepository.selectOne(UserModel, {
      where: { id, password: sha256(oldPassword), deletedAt: null },
    });

    if (!user) {
      throw new ExtendableError(ErrorType.BUSINESS, ValidationCodeError.BAD_PASSWORD, httpStatus.BAD_REQUEST);
    }

    await ModelRepository.updateById(UserModel, id, { password: sha256(newPassword), updatedBy: id });
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
