module.exports = (sequelize, DataTypes) => {
    return sequelize.define('usuarios_zonas', {
        
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        id_usuarios: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_catzonageografica: {
            type: DataTypes.INTEGER,
            allowNull: false
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
        },
        state: {
            type: DataTypes.CHAR(1),
            allowNull: true,
            defaultValue: "A"
        },
        sistema: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
        sequelize,
        tableName: 'usuarios_zonas',
        schema: 'adm',
        //timestamps: false

        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};