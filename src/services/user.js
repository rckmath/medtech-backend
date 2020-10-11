import { Op } from 'sequelize';
import ModelRepository from '../db/repository';
import db from '../db/database';

const UserModel = db.models.User;

const PrivateMethods = {
  checkIfUserExists: (exists, user) => {
    if (!exists) { return false; }

    const emailExists = user.email === exists.email;
    const cpfExists = user.cpf === exists.cpf;

    if (emailExists || cpfExists) return 'Já registrado!';

    return false;
  },
};

const Toolbox = {
  getExistentUser: (user) => {
    const or = [];

    if (user.cpf) { or.push({ cpf: user.cpf }); }

    if (user.email) { or.push({ email: user.email }); }

    const exists = ModelRepository.selectOne(UserModel, {
      where: { [Op.or]: or, deletedAt: null },
    });

    PrivateMethods.checkIfUserExists(exists, user);

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

    if (!user) { return 'Not found!'; }

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
    return Promise.all([
      UserService.getById(id),
      ModelRepository.deleteById(UserModel, id, actor.id),
    ]);
  }
}
