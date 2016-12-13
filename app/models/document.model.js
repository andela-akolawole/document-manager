import Sequelize from 'sequelize';
import Role from './role.model';
import User from './user.model';

const dotenv = require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: '127.0.0.1',
  dialect: 'postgres',
  port: 5432,
  logging: false,
});

const Document = sequelize.define('Document', {
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
      model: User,
      key: 'username',
    },
  },
  role: {
    type: Sequelize.STRING,
    references: {
      model: Role,
      key: 'roleTitle',
    },
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

export default Document;
