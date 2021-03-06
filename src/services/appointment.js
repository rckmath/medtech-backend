import httpStatus from 'http-status';
import ModelRepository from '../db/repository';
import db from '../db/database';
import ExtendableError from '../utils/error/extendable';
import { AppointmentCodeError } from '../utils/error/business-errors';
import ErrorType from '../enums/error-type';
import UserType from '../enums/user-type';
import AppointmentStatus from '../enums/appointment-status';
import { serviceOrderHelper } from '../utils/tools';
import SearchParameter from './search-parameters';
import MailService from './mailing';

const UserModel = db.models.User;
const MedicModel = db.models.Medic;
const AppointmentModel = db.models.Appointment;

export default class AppointmentService {
  static async create(appointment, actor) {
    const response = await ModelRepository.create(AppointmentModel, {
      medicId: actor.medic.id,
      patientId: appointment.patientId,

      appointmentAt: appointment.at,
      status: AppointmentStatus.PENDING,

      createdBy: actor && actor.id,
    });

    if (response) {
      const mailData = await AppointmentService.getById(response.id, actor);
      MailService.sendAppointment(mailData);
    }

    return response;
  }

  static async getAllMyAppointments(searchParameter, actor) {
    const commonQuery = SearchParameter.createCommonQuery(searchParameter);
    const appointmentQuery = SearchParameter.createAppointmentQuery(searchParameter);
    const where = { ...commonQuery.where, ...appointmentQuery.where };

    const include = [{
      model: MedicModel,
      as: 'medic',
      where: { deletedAt: null },
      include: {
        model: UserModel,
        as: 'user',
        where: { deletedAt: null },
        attributes: ['name', 'email', 'phone'],
      },
    }, {
      model: UserModel,
      as: 'patient',
      where: { deletedAt: null },
      attributes: {
        exclude: ['password', 'recoveryToken', 'recoveryTokenExpiresAt'],
      },
    }];

    if (actor.userType === UserType.MEDIC) {
      include[0].where.id = actor.medic.id;
    } else if (actor.userType === UserType.PATIENT) {
      include[1].where.id = actor.id;
    }

    const appointments = await ModelRepository.selectWithPagination(AppointmentModel, {
      where,
      include,
      offset: searchParameter.offset,
      limit: searchParameter.limit,
      order: [serviceOrderHelper(searchParameter)],
    });

    return appointments;
  }

  static async getSimpleById(id, actor) {
    const where = { id, deletedAt: null };

    if (actor.userType === UserType.MEDIC) { where.medicId = actor.medic.id; }

    const appointment = await ModelRepository.selectOne(AppointmentModel, { where: { id, deletedAt: null } });

    if (!appointment) {
      throw new ExtendableError(ErrorType.BUSINESS, AppointmentCodeError.APPOINTMENT_NOT_FOUND, httpStatus.BAD_REQUEST);
    }

    return appointment;
  }

  static async getById(id, actor) {
    const where = { id, deletedAt: null };

    if (actor.userType === UserType.MEDIC) { where.medicId = actor.medic.id; }

    const appointment = await ModelRepository.selectOne(AppointmentModel, {
      where,
      include: [{
        model: UserModel,
        as: 'patient',
        where: { deletedAt: null },
        attributes: {
          exclude: ['password', 'recoveryToken', 'recoveryTokenExpiresAt'],
        },
      }, {
        model: MedicModel,
        as: 'medic',
        where: { deletedAt: null },
        include: {
          model: UserModel,
          as: 'user',
          where: { deletedAt: null },
          attributes: ['name', 'email', 'phone', 'genderType'],
        },
      }],
    });

    if (!appointment) {
      throw new ExtendableError(ErrorType.BUSINESS, AppointmentCodeError.APPOINTMENT_NOT_FOUND, httpStatus.BAD_REQUEST);
    }

    return appointment;
  }

  static async getAllWithPagination(searchParameter, actor) {
    let response = null;
    let where = {};

    if (actor.userType === UserType.MEDIC) { where.medicId = actor.medic.id; }

    const commonQuery = SearchParameter.createCommonQuery(searchParameter);
    const appointmentQuery = SearchParameter.createAppointmentQuery(searchParameter);

    where = { ...where, ...commonQuery.where, ...appointmentQuery.where };

    response = await ModelRepository.selectWithPagination(AppointmentModel, {
      where,
      offset: searchParameter.offset,
      limit: searchParameter.limit,
      order: [serviceOrderHelper(searchParameter)],
    });

    return response;
  }

  static async updateById(id, appointment, actor) {
    await AppointmentService.getSimpleById(id, actor);
    await ModelRepository.updateById(AppointmentModel, id, {
      status: appointment.status,
      appointmentAt: appointment.at,
      updatedBy: actor && actor.id,
    });
  }

  static async deleteById(id, actor) {
    await AppointmentService.getSimpleById(id);
    await ModelRepository.deleteById(AppointmentModel, id, actor && actor.id);
  }
}
