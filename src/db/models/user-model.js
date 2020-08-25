export default (sequelize, type) => {
  const User = sequelize.define('User',
    {
      id: {
        type: type.INTEGER, primaryKey: true, field: 'id', defaultValue: type.INTEGER,
      },

      name: { type: type.STRING, field: 'str_name' },
      cpf: { type: type.STRING, field: 'str_cpf' },
      email: { type: type.STRING, field: 'str_email' },
      password: { type: type.STRING, field: 'str_password' },
      cellphone: { type: type.STRING, field: 'str_cellphone' },
      birthday: { type: type.DATE, field: 'dt_birthday' },
      
      genderType: { type: type.INTEGER, field: 'int_gender_type' },
      profileType: { type: type.INTEGER, field: 'int_profile_type' },

      recoveryToken: { type: type.STRING, field: 'str_recovery_token' },
      recoveryTokenExpiresAt: { type: type.DATE, field: 'dt_recovery_token_expires_at' },

      ip: { type: type.STRING, field: 'str_ip' },

      createdBy: { type: type.STRING, field: 'str_created_by' },
      updatedBy: { type: type.STRING, field: 'str_updated_by' },
      createdAt: { type: type.DATE, field: 'dt_created_at' },
      updatedAt: { type: type.DATE, field: 'dt_updated_at' },
      deletedAt: { type: type.DATE, field: 'dt_deleted_at' },
    },
    {
      tableName: 'tb_user',
      freezeTableName: true,
      timestamps: true,

      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'deletedAt',
    });

  User.associate = (models) => {};

  return User;
};
