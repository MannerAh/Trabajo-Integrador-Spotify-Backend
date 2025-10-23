// models/userModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    create_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    gender: {
        type: DataTypes.STRING(9),
        allowNull: true,
    },
    birth_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    zipcode: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    pass_updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    role: { 
        type: DataTypes.ENUM('FREE', 'PREMIUM', 'ADMIN'),
        allowNull: false,
        defaultValue: 'FREE', // r0l por defecto para nuevos registros
        comment: 'Rol del usuario: FREE, PREMIUM, ADMIN'
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Por defecto, el usuario no está eliminado
        allowNull: true,
    },
    deleted_at: {
        type: DataTypes.DATE,
        allowNull: true, // Puede ser NULL si el usuario no ha sido eliminado
    },

}, {
    tableName: 'user',
    timestamps: true,
    underscored: true,
    // Esto asegura que Sequelize utilice "deleted_at" para el borrado lógico
    paranoid: true, // Habilita el uso de deleted_at
    deletedAt: 'deleted_at',
    

    defaultScope: {
        where: {
            is_deleted: false
        }
    },
});

module.exports = User;

