module.exports = function(sequelize, DataTypes) {
    return sequelize.define('permgruposmodulos', {
       
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        icode: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: ""
        },
        idesc: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ""
        },
        id_permgrupos: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        id_modulos: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        privilegios: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: "nada"
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
        },
        sistema: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
        sequelize,
        tableName: 'permgruposmodulos',
        schema: 'adm',
        //timestamps: false

        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};