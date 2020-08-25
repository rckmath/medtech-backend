export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER, primaryKey: true, field: 'id', defaultValue: DataTypes.INTEGER,
    },

    name: { type: DataTypes.STRING, field: 'str_name' },
    cpf: { type: DataTypes.STRING, field: 'str_cpf', unique: true },
    email: { type: DataTypes.STRING, field: 'str_email', unique: true },
    password: { type: DataTypes.STRING, field: 'str_password' },
    cellphone: { type: DataTypes.STRING, field: 'str_cellphone' },
    birthday: { type: DataTypes.DATE, field: 'dt_birthday' },
    
    genderType: { type: DataTypes.INTEGER, field: 'int_gender_type' },
    userType: { type: DataTypes.INTEGER, field: 'int_user_type' },
  
    recoveryToken: { type: DataTypes.STRING, field: 'str_recovery_token' },
    recoveryTokenExpiresAt: { type: DataTypes.DATE, field: 'dt_recovery_token_expires_at' },
  
    ip: { type: DataTypes.STRING, field: 'str_ip' },
  
    createdBy: { type: DataTypes.STRING, field: 'str_created_by' },
    updatedBy: { type: DataTypes.STRING, field: 'str_updated_by' },
    createdAt: { type: DataTypes.DATE, field: 'dt_created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'dt_updated_at' },
    deletedAt: { type: DataTypes.DATE, field: 'dt_deleted_at' },
  }, {
    sequelize,
    tableName: 'tb_user',
    modelName: 'User',
  
    freezeTableName: true,
    timestamps: true,
    
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
  });

  return User;
}
