module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tb_appointment', {
      id: { type: Sequelize.UUID, primaryKey: true },

      id_patient: {
        type: Sequelize.UUID,
        references: {
          model: 'tb_user',
          key: 'id',
        },
      },
      id_medic: {
        type: Sequelize.UUID,
        references: {
          model: 'tb_medic',
          key: 'id',
        },
      },

      int_appointment_number: { type: Sequelize.INTEGER, autoIncrement: true },
      int_status: { type: Sequelize.INTEGER },
      dt_appointment_at: { type: Sequelize.DATE },

      str_created_by: { type: Sequelize.STRING },
      str_updated_by: { type: Sequelize.STRING },
      dt_created_at: { type: Sequelize.DATE },
      dt_updated_at: { type: Sequelize.DATE },
      dt_deleted_at: { type: Sequelize.DATE },
    });

    await queryInterface.addIndex('tb_appointment', ['id_patient', 'id_medic']);
  },

  down: async (queryInterface) => {
    await queryInterface.removeIndex('tb_appointment', ['id_patient', 'id_medic']);
    await queryInterface.dropTable('tb_appointment');
  },
};
