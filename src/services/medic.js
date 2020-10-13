import { Op } from 'sequelize';
import httpStatus from 'http-status';
import ModelRepository from '../db/repository';
import db from '../db/database';
import ExtendableError from '../utils/error/extendable';
import { UserCodeError, MedicCodeError } from '../utils/error/business-errors';
import ErrorType from '../enums/error-type';
import { sha256 } from '../utils/tools';
import UserType from '../enums/user-type';

const MedicModel = db.models.Medic;
const UserModel = db.models.User;

const PrivateMethods = {
  checkIfUserExists: (exists, medic) => {
    const emailExists = medic.email === exists.user && exists.user.email;
    const cpfExists = medic.cpf === exists.user && exists.user.cpf;

    if (cpfExists) {
      throw new ExtendableError(ErrorType.BUSINESS, UserCodeError.CPF_ALREADY_REGISTERED, httpStatus.CONFLICT);
    }

    if (emailExists) {
      throw new ExtendableError(ErrorType.BUSINESS, UserCodeError.EMAIL_ALREADY_REGISTERED, httpStatus.CONFLICT);
    }

    throw new ExtendableError(ErrorType.BUSINESS, MedicCodeError.CRM_ALREADY_REGISTERED, httpStatus.CONFLICT);
  },
};

const Toolbox = {
  getExistentMedic: async (medic) => {
    const exists = {};
    const userOr = [];

    if (medic.cpf) { userOr.push({ cpf: medic.cpf }); }

    if (medic.email) { userOr.push({ email: medic.email }); }

    if (medic.regNum && medic.regUf) {
      exists.medic = await ModelRepository.selectOne(MedicModel, {
        where: { regNum: medic.regNum, regUf: medic.regUf, deletedAt: null },
      });
    }

    exists.user = await ModelRepository.selectOne(UserModel, {
      where: { [Op.or]: userOr, deletedAt: null },
    });

    if (exists.medic || exists.user) { PrivateMethods.checkIfUserExists(exists, medic); }

    return exists;
  },
};

export default class MedicService {
  static async create(medic, actor) {
    let response = null;
    let transaction = null;

    await Toolbox.getExistentMedic(medic);

    try {
      transaction = await db.sequelize.transaction();

      response = await ModelRepository.create(UserModel, {
        name: medic.name,
        cpf: medic.cpf,
        email: medic.email,
        password: sha256(medic.password),
        phone: medic.phone,
        birthday: medic.birthday,

        genderType: medic.gender,
        userType: UserType.MEDIC,

        createdBy: actor && actor.id,
      }, { transaction });

      const createdMedic = await ModelRepository.create(MedicModel, {
        userId: response.id,

        regNum: medic.regNum,
        regUf: medic.regUf,
        specialization: medic.specialization,

        createdBy: actor && actor.id,
      }, { transaction });

      response = { ...response.toJSON(), medic: createdMedic.toJSON() };

      await transaction.commit();
    } catch (err) {
      if (transaction) { await transaction.rollback(); }

      throw new ExtendableError(ErrorType.PERSISTENCE, err.message, httpStatus.INTERNAL_SERVER_ERROR);
    }

    return response;
  }

  static async getById(id) {
    const medic = await ModelRepository.selectOne(MedicModel, {
      where: { id, deletedAt: null },
      include: {
        model: UserModel,
        as: 'user',
        where: { deletedAt: null },
        attributes: {
          exclude: ['password', 'recoveryToken', 'recoveryTokenExpiresAt'],
        },
      },
    });

    if (!medic) {
      throw new ExtendableError(ErrorType.BUSINESS, UserCodeError.USER_NOT_FOUND, httpStatus.BAD_REQUEST);
    }

    return medic;
  }

  static async updateById(id, medic, actor) {
    await ModelRepository.updateById(MedicModel, id, {
      specialization: medic.specialization,
      regNum: medic.regNum,
      regUf: medic.regUf,

      updatedBy: actor && actor.id,
    });
  }
}
