/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('archivos', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        tabla: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        id_tabla: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        tipo: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        datos: {
            type: Sequelize.BLOB('long'),
            allowNull: true
        },
        ruta: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        id_usuarios_r: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        state: {
            type: DataTypes.CHAR(1),
            allowNull: false,
            defaultValue: "A"
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'archivos',
        schema: 'public',
        //timestamps: false

        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};