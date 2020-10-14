import { Op } from 'sequelize';

export default class SearchParameter {
  static createCommonQuery(searchParameter, includeDeleted = false) {
    const where = {};

    if (!includeDeleted) { where.deletedAt = null; }

    /**
     * Dates
     */

    if (searchParameter.createdAtStart) {
      where.createdAt = {
        ...where.createdAt,
        [Op.gte]: searchParameter.createdAtStart,
      };
    }

    if (searchParameter.createdAtEnd) {
      where.createdAt = {
        ...where.createdAt,
        [Op.lte]: searchParameter.createdAtEnd,
      };
    }

    if (searchParameter.updatedAtStart) {
      where.updatedAt = {
        ...where.updatedAt,
        [Op.gte]: searchParameter.updatedAtStart,
      };
    }

    if (searchParameter.updatedAtEnd) {
      where.updatedAt = {
        ...where.updatedAt,
        [Op.lte]: searchParameter.updatedAtEnd,
      };
    }

    return { where };
  }

  static createAppointmentQuery(searchParameter) {
    const where = {};

    if (searchParameter.patientId) {
      where.patientId = searchParameter.patientId;
    }

    if (searchParameter.medicId) {
      where.medicId = searchParameter.medicId;
    }

    if (searchParameter.status) {
      where.status = { [Op.or]: searchParameter.status };
    }

    /**
     * Dates
     */

    if (searchParameter.appointmentAtRange) {
      where.appointmentAt = {
        ...where.appointmentAt,
        [Op.gte]: searchParameter.appointmentAtRange.startAt,
      };
    }

    if (searchParameter.appointmentAtRange) {
      where.appointmentAt = {
        ...where.appointmentAt,
        [Op.lte]: searchParameter.appointmentAtRange.endAt,
      };
    }

    return { where };
  }

  static createUserQuery(searchParameter) {
    const where = {};

    if (searchParameter.email) {
      where.email = { [Op.iLike]: `%${searchParameter.email}%` };
    }

    if (searchParameter.name) {
      where.name = { [Op.iLike]: `%${searchParameter.name}%` };
    }

    if (searchParameter.cpf) {
      where.cpf = searchParameter.cpf;
    }

    if (searchParameter.userType) {
      where.userType = { [Op.or]: searchParameter.userType };
    }

    return { where };
  }

  static createMedicQuery(searchParameter) {
    const where = {};

    console.log(searchParameter);

    if (searchParameter.regUf) {
      where.regUf = { [Op.iLike]: `%${searchParameter.regUf}%` };
    }

    if (searchParameter.specialization) {
      where.specialization = { [Op.iLike]: `%${searchParameter.specialization}%` };
    }

    return { where };
  }
}
