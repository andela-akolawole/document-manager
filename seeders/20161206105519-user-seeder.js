
module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Users', [{
      firstName: 'Kolawole',
      lastName: 'Alade',
      username: 'kolafas',
      password: 'password',
      email: 'kolawole.alade@andela.com',
      role: 'admin',
      createdAt: new Date(),
    }, {
      firstName: 'Femi',
      lastName: 'Alade',
      username: 'kolafas2',
      password: 'password',
      email: 'kolawole.alade@andela.com',
      role: 'regular',
      createdAt: new Date(),
    }], {});
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('User', null, {});
  },
};
