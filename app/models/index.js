const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD, {
        host: config.HOST,
        dialect: config.dialect,
        operatorsAliases: config.operatorsAliases,
        timezone: '-06:00'
            /*pool: {
                max: config.pool.max,
                min: config.pool.min,
                acquire: config.pool.acquire,
                idle: config.pool.idle
            }*/
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
//historial de plazas segun sistema de nomina

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.usuarios_zonas = require("../models/usuarios_zonas.model.js")(sequelize, Sequelize);
db.usuarios_sistemas = require("../models/usuarios_sistemas.model.js")(sequelize, Sequelize);
db.catzonageografica = require("../models/catzonageografica.model.js")(sequelize, Sequelize);
db.catsistemas = require("../models/catsistemas.model.js")(sequelize, Sequelize);
db.personal = require("../models/personal.model.js")(sequelize, Sequelize);
db.archivos = require("../models/archivos.model.js")(sequelize, Sequelize);
db.permgrupos = require("../models/permgrupos.model.js")(sequelize, Sequelize);
db.permgruposmodulos = require("../models/permgruposmodulos.model.js")(sequelize, Sequelize);
db.permusuariosmodulos = require("../models/permusuariosmodulos.model.js")(sequelize, Sequelize);
db.respuestas = require("../models/respuestas.model.js")(sequelize, Sequelize);

module.exports = db;