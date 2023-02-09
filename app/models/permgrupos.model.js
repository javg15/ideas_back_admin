module.exports = function(sequelize, DataTypes) {
    return sequelize.define('permgrupos', {
       
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        icode: {
            type: DataTypes.STRING(5),
            allowNull: false,
            defaultValue: ""
        },
        idesc: {
            type: DataTypes.STRING(300),
            allowNull: false,
            defaultValue: ""
        },
        sistema: {
            type: DataTypes.STRING(300),
            allowNull: false,
            defaultValue: ""
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
        tableName: 'permgrupos',
        schema: 'adm',
        //timestamps: false

        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};