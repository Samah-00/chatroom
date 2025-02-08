const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
});

const User = require('./models/User')(sequelize);
const Message = require('./models/Message')(sequelize);

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await sequelize.sync({ alter: true });
    console.log('Models have been synchronized with the database.');

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

connectDB();

module.exports = { sequelize, User, Message };
