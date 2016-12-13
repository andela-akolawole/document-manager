module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Documents', [
      {
        title: 'A tale of two cities',
        role: 'regular',
        content: 'A very interesting insight into the daily workings of two inner cities',
        owner: 'amcdonald',
        type: 'public',
        createdAt: new Date(),
      },
      {
        title: 'Percy Jackson and the Olympians',
        role: 'admin',
        content: 'A boy discovers the not so hidden world of demigods.',
        owner: 'amcdonald',
        type: 'private',
        createdAt: new Date(),
      },
      {
        title: 'Eragon',
        role: 'regular',
        content: 'A boy finds a dragon egg in the forest and it changes the course of history.',
        owner: 'pescobar',
        type: 'pubic',
        createdAt: new Date(),
      },
      {
        title: 'Sea of Monsters',
        role: 'admin',
        content: 'A boy continues his foray into the dangerous world of demigods and battles for his very survival.',
        owner: 'pescobar',
        type: 'private',
        createdAt: new Date(),
      },
    ], {});
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Documents', null, {});
  }
};
