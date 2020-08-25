import { Op } from 'sequelize';
import moment from 'moment-timezone';
// import PersistenceError from '../../utils/errors/persistence';
 

export default class ModelRepository {
  static async create(ModelEntity, data, options) {
    let response = null;

    try {
      response = ModelEntity.build(data);

      response = await response.save({
        transaction: options ? options.transaction : null,
        returning: true,
      });
    } catch (err) {
      throw err;
      // throw new PersistenceError(err);
    }

    return response;
  }

  static async selectOne(ModelEntity, options) {
    let response = null;

    try {
      
      response = await ModelEntity.findOne(options);
    } catch (err) {
      throw err;
      // throw new PersistenceError(err);
    }

    return response;
  }

  static async selectByIdList(ModelEntity, idList) {
    let response = null;

    try {
      response = await ModelEntity.findAll({ where: { id: { [Op.in]: idList } } });
    } catch (err) {
      throw err;
      // throw new PersistenceError(err);
    }

    return response;
  }

  static async selectAll(ModelEntity, options) {
    let response = null;

    try {
      response = await ModelEntity.findAll(options);
    } catch (err) {
      throw err;
      // throw new PersistenceError(err);
    }

    return response;
  }

  static async selectWithPagination(ModelEntity, options) {
    let response = null;

    try {
      options = {
        ...options,
        distinct: options && options.include && options.include.length > 0,
      };
      response = await ModelEntity.findAndCountAll(options);
    } catch (err) {
      throw err;
      // throw new PersistenceError(err);
    }

    return response;
  }

  static async updateById(ModelEntity, id, data, options) {
    let response = null;

    try {
      response = await ModelEntity.update(data, {
        where: { id },
        transaction: options && options.transaction,
        returning: true,
      });

      [, [response]] = response;
    } catch (err) {
      throw err;
      // throw new PersistenceError(err);
    }

    return response;
  }

  static async deleteById(ModelEntity, id, updatedBy, options) {
    let response = null;

    try {
      response = await ModelEntity.update({
        deletedAt: moment().format(),
        updatedBy,
      }, {
        where: { id },
        transaction: options && options.transaction,
        returning: true,
      });
      [, [response]] = response;
    } catch (err) {
      throw err;
      // throw new PersistenceError(err);
    }

    return response;
  }
}
