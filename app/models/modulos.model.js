module.exports = function(sequelize, DataTypes) {
    return sequelize.define('modulos', {
 
        icode: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: ""
        },
        idesc: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: ""
        },
        state: {
            type: DataTypes.CHAR(1),
            allowNull: false,
            defaultValue: "A"
        },
        ruta: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ""
        },
        rutamenu: {
            type: DataTypes.STRING(300),
            allowNull: false,
            defaultValue: ""
        },
        controller: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: ""
        },
        route: {
            type: DataTypes.STRING(300),
            allowNull: false,
            defaultValue: ""
        },
        tabla: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: ""
        },
        espordepartamento: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        essolousuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        opciones: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: "ver"
        },
        ismenu: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        isroot: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        orden: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        iconmenu: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ""
        },
        observaciones: {
            type: DataTypes.STRING(300),
            allowNull: false,
            defaultValue: ""
        },
        clase: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: ""
        },
        esfuncion: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        foliadotipo: {
            type: DataTypes.CHAR(1),
            allowNull: false,
            defaultValue: "G"
        },
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        sistema: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
        sequelize,
        tableName: 'modulos',
        schema: 'adm',
        //timestamps: false

        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};