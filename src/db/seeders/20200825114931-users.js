require('dotenv').config();
const dayjs = require('dayjs');
const UserType = require('../../enums/user-type').default;
const { sha256 } = require('../../utils/tools');

module.exports = {
  up: async (queryInterface) => {
    const exist = await queryInterface.rawSelect('tb_user', {
      where: {
        id: '5df95340-736e-4e11-b2fe-481d51275bfc',
        str_email: 'system-admin@medtech.com.br',
        str_password: sha256(process.env.SYSTEM_PASSWORD),
      },
    }, ['str_email']);

    if (exist) { return; }

    const now = dayjs().toDate();
    const baseEntity = {
      dt_created_at: now,
      dt_updated_at: now,
      str_created_by: 'SYSTEM',
      str_updated_by: 'SYSTEM',
    };

    await queryInterface.bulkInsert('tb_user', [{
      id: '5df95340-736e-4e11-b2fe-481d51275bfc',
      str_name: 'System Admin',
      str_email: 'system-admin@medtech.com.br',
      str_password: sha256(process.env.SYSTEM_PASSWORD),
      int_user_type: UserType.ADMIN,
      ...baseEntity,
    }], {});
  },

  down: (queryInterface) => queryInterface.bulkDelete('tb_user', null, {}),
};
