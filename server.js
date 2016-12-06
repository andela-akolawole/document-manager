import Sequelize from 'sequelize';


const connect = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: '127.0.0.1',
  dialect: 'postgres',
  port: 5432,
});

const User = connect.define('Users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: Sequelize.STRING,
  },
});

User.sync({ force: true });
