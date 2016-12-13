module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Roles', [{
      roleTitle: 'admin',
    }, {
      roleTitle: 'regular',
    }], {});
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Roles', null, {});
  },
};
