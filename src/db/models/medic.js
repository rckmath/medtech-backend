export default (sequelize, DataTypes) => {
  const Medic = sequelize.define('Medic', {
    id: {
      type: DataTypes.UUID, primaryKey: true, field: 'id', defaultValue: DataTypes.UUIDV4,
    },

    userId: { type: DataTypes.UUID, field: 'id_user' },

    regNum: { type: DataTypes.INTEGER, field: 'int_reg_num' },
    regUf: { type: DataTypes.STRING, field: 'str_reg_uf' },
    specialization: { type: DataTypes.STRING, field: 'str_specialization' },

    scheduleStartsAt: { type: DataTypes.TIME, field: 'tm_schedule_starts_at' },
    scheduleEndsAt: { type: DataTypes.TIME, field: 'tm_schedule_ends_at' },

    createdBy: { type: DataTypes.STRING, field: 'str_created_by' },
    updatedBy: { type: DataTypes.STRING, field: 'str_updated_by' },
    createdAt: { type: DataTypes.DATE, field: 'dt_created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'dt_updated_at' },
    deletedAt: { type: DataTypes.DATE, field: 'dt_deleted_at' },
  }, {
    sequelize,
    tableName: 'tb_medic',
    modelName: 'Medic',

    freezeTableName: true,
    timestamps: true,

    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
  });

  Medic.associate = (models) => {
    Medic.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
    });
  };

  return Medic;
};
