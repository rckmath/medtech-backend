module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tb_user', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },

      str_name: { type: Sequelize.STRING },
      str_cpf: { type: Sequelize.STRING, unique: true },
      str_email: { type: Sequelize.STRING, unique: true },
      str_password: { type: Sequelize.STRING },
      str_phone: { type: Sequelize.STRING },
      str_ip: { type: Sequelize.STRING },

      dt_birthday: { type: Sequelize.DATE },

      int_gender_type: { type: Sequelize.INTEGER },
      int_user_type: { type: Sequelize.INTEGER },

      str_recovery_token: { type: Sequelize.STRING },
      dt_recovery_token_expires_at: { type: Sequelize.DATE },

      str_created_by: { type: Sequelize.STRING },
      str_updated_by: { type: Sequelize.STRING },
      dt_created_at: { type: Sequelize.DATE },
      dt_updated_at: { type: Sequelize.DATE },
      dt_deleted_at: { type: Sequelize.DATE },
    });

    await queryInterface.addIndex('tb_user', ['str_email']);
  },

  down: async (queryInterface) => {
    await queryInterface.removeIndex('tb_user', ['str_email']);
    await queryInterface.dropTable('tb_user');
  },
};
