module.exports = function(sequelize, DataTypes) {
    return sequelize.define('respuestas', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        id_proyectos: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_catpreguntas: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        respuesta: {
            type: DataTypes.STRING,
            allowNull: true
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        id_usuarios_r: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'respuestas',
        schema: 'public',
        //timestamps: false

        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};