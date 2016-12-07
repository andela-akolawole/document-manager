import Sequelize from 'sequelize';
import bcrypt from 'bcrypt';

const dotenv = require('dotenv').config();


function hashedPassword(plainTextPassword) {
  if (!plainTextPassword) return '';
  return bcrypt.hashSync(plainTextPassword, 10);
}
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: '127.0.0.1',
  dialect: 'postgres',
  port: 5432,
  logging: false,
});
const User = sequelize.define('User', {
  firstName: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
    },
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    set(val) {
      this.setDataValue('password', hashedPassword(val));
    },
  },
  role: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

sequelize.sync();

export default User;
