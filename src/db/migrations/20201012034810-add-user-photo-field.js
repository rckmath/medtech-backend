module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tb_user', 'str_profile_photo_url', {
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('tb_user', 'str_profile_photo_url');
  },
};
