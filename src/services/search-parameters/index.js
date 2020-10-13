import { Op } from 'sequelize';

export default class CommonSearchParameter {
  static createCommonQuery(searchParameter, includeDeleted = false) {
    const where = {};

    if (!includeDeleted) { where.deletedAt = null; }

    if (searchParameter.email) {
      where.email = { [Op.iLike]: `%${searchParameter.email}%` };
    }

    if (searchParameter.name) {
      where.name = { [Op.iLike]: `%${searchParameter.name}%` };
    }

    if (searchParameter.cpf) {
      where.cpf = searchParameter.cpf;
    }

    return {
      where,
    };
  }

  static createUserQuery(searchParameter, includeDeleted = false) {
    const where = {};

    if (!includeDeleted) { where.deletedAt = null; }
  }
}
