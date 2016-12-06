import Sequelize from 'sequelize';
import config from './../../config/config';
import Role from './role.model';
import User from './user.model';

const sequelize = new Sequelize(config.database, config.dbUsename, config.dbPassword);

const Document = sequelize.define('Document', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  docTitle: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  owner: {
    type: Sequelize.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'username',
    },
  },
  role: {
    type: Sequelize.INTEGER,
    references: {
      model: Role,
      key: 'roleTitle',
    },
  },
});

export default Document;
