export default (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment', {
    id: {
      type: DataTypes.UUID, primaryKey: true, field: 'id', defaultValue: DataTypes.UUIDV4,
    },

    appointmentNumber: { type: DataTypes.INTEGER, autoIncrement: true, field: 'int_appointment_number' },
    patientId: { type: DataTypes.UUID, field: 'id_patient' },
    medicId: { type: DataTypes.UUID, field: 'id_medic' },

    status: { type: DataTypes.INTEGER, field: 'int_status' },
    appointmentAt: { type: DataTypes.DATE, field: 'dt_appointment_at' },

    createdBy: { type: DataTypes.STRING, field: 'str_created_by' },
    updatedBy: { type: DataTypes.STRING, field: 'str_updated_by' },
    createdAt: { type: DataTypes.DATE, field: 'dt_created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'dt_updated_at' },
    deletedAt: { type: DataTypes.DATE, field: 'dt_deleted_at' },
  }, {
    sequelize,
    tableName: 'tb_appointment',
    modelName: 'Appointment',

    freezeTableName: true,
    timestamps: true,

    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
  });

  Appointment.associate = (models) => {
    Appointment.belongsTo(models.User, {
      as: 'patient',
      foreignKey: 'patientId',
    });
    Appointment.belongsTo(models.Medic, {
      as: 'medic',
      foreignKey: 'medicId',
    });
  };

  return Appointment;
};
