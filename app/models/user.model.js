import Sequelize from 'sequelize';
import bcrypt from 'bcrypt';
import config from './../../config/config';


function hashedPassword(plainTextPassword) {
  if (!plainTextPassword) return '';
  return bcrypt.hashSync(plainTextPassword, 10);
}

const sequelize = new Sequelize(config.database, config.dbUsename, config.dbPassword);
const User = sequelize.define('User', {
  firstname: {
    type: Sequelize.STRING,
    allowNull: false,
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
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    set(val) {
      this.setDataValue('password', hashedPassword(val));
    },
  },
  role: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 2,
  },
});

export default User;
