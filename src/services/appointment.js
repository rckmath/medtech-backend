import httpStatus from 'http-status';
import ModelRepository from '../db/repository';
import db from '../db/database';
import ExtendableError from '../utils/error/extendable';
import { AppointmentCodeError } from '../utils/error/business-errors';
import ErrorType from '../enums/error-type';
import AppointmentStatus from '../enums/appointment-status';

const UserModel = db.models.User;
const MedicModel = db.models.Medic;
const AppointmentModel = db.models.Appointment;

export default class AppointmentService {
  static async create(appointment, actor) {
    return ModelRepository.create(AppointmentModel, {
      medicId: actor.medic.id,
      patientId: appointment.patientId,

      appointmentAt: appointment.at,
      status: AppointmentStatus.PENDING,

      createdBy: actor && actor.id,
    });

  }

  static async getSimpleById(id) {
    const appointment = await ModelRepository.selectOne(AppointmentModel, { where: { id, deletedAt: null } });

    if (!appointment) {
      throw new ExtendableError(ErrorType.BUSINESS, AppointmentCodeError.APPOINTMENT_NOT_FOUND, httpStatus.BAD_REQUEST);
    }

    return appointment;
  }

  static async getById(id) {
    const appointment = await ModelRepository.selectOne(AppointmentModel, {
      where: { id, deletedAt: null },
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
          attributes: ['name', 'email', 'phone'],
        },
      }],
    });

    if (!appointment) {
      throw new ExtendableError(ErrorType.BUSINESS, AppointmentCodeError.APPOINTMENT_NOT_FOUND, httpStatus.BAD_REQUEST);
    }

    return appointment;
  }

  static async updateById(id, appointment, actor) {
    await ModelRepository.updateById(AppointmentModel, id, {
      status: appointment.status,

      updatedBy: actor && actor.id,
    });
  }

  static async deleteById(id, actor) {
    await Promise.all([
      AppointmentService.getSimpleById(id),
      ModelRepository.deleteById(AppointmentModel, id, actor && actor.id),
    ]);
  }
}
