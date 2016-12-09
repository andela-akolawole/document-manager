module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Roles', [{
      roleTitle: 'admin',
    }, {
      roleTitle: 'user',
    }], {});
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Roles', null, {});
  },
};
