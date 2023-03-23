const config = require("../config/auth.config");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, Sequelize) => {
  const RefreshToken = sequelize.define("refreshToken", {
    id_usuario:{
        type: Sequelize.INTEGER,
    },
    token: {
      type: Sequelize.STRING,
    },
    expirydate: {
      type: Sequelize.DATE,
    },
  }, {
    sequelize,
    tableName: 'refreshtoken',
    schema: 'adm',
    timestamps: false
});

  RefreshToken.createToken = async function (user) {
    let expiredAt = new Date();

    expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);

    let _token = uuidv4();

    let refreshToken = await this.create({
      token: _token,
      id_usuario: user.id,
      expirydate: expiredAt.getTime(),
    });

    return refreshToken.token;
  };

  RefreshToken.verifyExpiration = (token) => {
    return token.expirydate.getTime() < new Date().getTime();
  };

  return RefreshToken;
};