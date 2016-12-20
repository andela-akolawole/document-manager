import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: '127.0.0.1',
  dialect: 'postgres',
  port: 5432,
  logging: false,
});

const Role = sequelize.define('Role', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  roleTitle: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
});

export default Role;
