const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db-connection');

const Meetings = sequelize.define('meetings', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false
    }
});

module.exports = Meetings;