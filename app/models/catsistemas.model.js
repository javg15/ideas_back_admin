module.exports = function(sequelize, DataTypes) {
    return sequelize.define('catsistemas', {
        sistema: {
            type: DataTypes.STRING,
            allowNull: true
        },

    }, {
        sequelize,
        tableName: 'catsistemas',
        schema: 'adm',
        //timestamps: false

        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
};