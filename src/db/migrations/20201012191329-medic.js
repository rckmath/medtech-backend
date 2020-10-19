module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tb_medic', {
      id: { type: Sequelize.UUID, primaryKey: true },

      id_user: {
        type: Sequelize.UUID,
        references: {
          model: 'tb_user',
          key: 'id',
        },
      },

      int_reg_num: { type: Sequelize.INTEGER },
      str_reg_uf: { type: Sequelize.STRING(2) },
      str_specialization: { type: Sequelize.STRING },

      tm_schedule_starts_at: { type: Sequelize.TIME },
      tm_schedule_ends_at: { type: Sequelize.TIME },

      str_created_by: { type: Sequelize.STRING },
      str_updated_by: { type: Sequelize.STRING },
      dt_created_at: { type: Sequelize.DATE },
      dt_updated_at: { type: Sequelize.DATE },
      dt_deleted_at: { type: Sequelize.DATE },
    });

    await queryInterface.addIndex('tb_medic', ['id_user']);
  },

  down: async (queryInterface) => {
    await queryInterface.removeIndex('tb_medic', ['id_user']);
    await queryInterface.dropTable('tb_medic');
  },
};
