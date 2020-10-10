import { Op } from 'sequelize';
import ModelRepository from '../db/repository';
import db from '../db/database';

const UserModel = db.models.User;

const PrivateMethods = {
  checkIfUserExists: (exists, user) => {
    if (!exists) { return; }

    const emailExists = user.email === exists.email;
    const cpfExists = user.cpf === exists.cpf;

    if (emailExists || cpfExists) return 'Já cadastrado.';
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

    let creator;

    if (actor) { creator = actor.id; }

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

      createdBy: creator,
    });
  }
}
