module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Roles', [{
      roleTitle: 'admin',
      createdAt: new Date(),
    }, {
      roleTitle: 'regular',
      createdAt: new Date(),
    }], {});
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Roles', null, {});
  },
};
