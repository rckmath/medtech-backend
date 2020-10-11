const moment = require('moment-timezone');
const UserType = require('../../enums/user-type').default;

module.exports = {
  up: async (queryInterface) => {
    const exist = await queryInterface.rawSelect('tb_user', {
      where: {
        str_email: 'system-admin@medtech.com.br',
        str_password: '123123',
      },
    }, ['id']);

    if (exist) { return; }

    const now = moment().toDate();
    const baseEntity = {
      dt_created_at: now,
      dt_updated_at: now,
      str_created_by: 'SYSTEM',
      str_updated_by: 'SYSTEM',
    };

    await queryInterface.bulkInsert('tb_user', [{
      id: 1,
      str_name: 'System Admin',
      str_email: 'system-admin@medtech.com.br',
      str_password: '96cae35ce8a9b0244178bf28e4966c2ce1b8385723a96a6b838858cdd6ca0a1e',
      int_user_type: UserType.ADMIN,
      ...baseEntity,
    }], {});
  },

  down: (queryInterface) => queryInterface.bulkDelete('tb_user', null, {}),
};
