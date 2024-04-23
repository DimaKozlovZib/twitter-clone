const { Sequelize } = require("sequelize");

module.exports = new Sequelize(`postgres://${process.env.POSTGRESUSER}:${process.env.POSTGRESPASSWORD}@db:${process.env.DB_PORT}/${process.env.POSTGRESUSER}`)