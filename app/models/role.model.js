import Sequelize from 'sequelize';

const dotenv = require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: '127.0.0.1',
  dialect: 'postgres',
  port: 5432,
  logging: false,
});

const Role = sequelize.define('Role', {
  roleTitle: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
});

export default Role;
