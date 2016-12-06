import Sequelize from 'sequelize';
import config from './../../config/config';

const sequelize = new Sequelize(config.database, config.dbUsername, config.dbPassword);
sequelize.authenticate().complete((err) => {
  if (err) {
    console.log('Error connecting');
  } else {
    console.log('Connection has been established successfully');
  }
});

const Role = sequelize.define('Role', {
  roleTitle: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
});

export default Role;
