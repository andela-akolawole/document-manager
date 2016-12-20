module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Documents', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      content: {
        type: Sequelize.TEXT,
      },
      owner: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'username',
          deferrable: Sequelize.Deferrable.INITIALLY_DEFERRED,
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      role: {
        type: Sequelize.STRING,
        references: {
          model: 'Roles',
          key: 'roleTitle',
          deferrable: Sequelize.Deferrable.INITIALLY_DEFERRED,
          
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  down(queryInterface) {
    return queryInterface.dropAllTables();
  },
};
