const db = require("../models");
const { Op } = require("sequelize");
const mensajesValidacion = require("../config/validate.config");
const globales = require("../config/global.config");
const Usuariossistemas = db.usuarios_sistemas;
const Usuarios_zonas = db.usuarios_zonas;

const { QueryTypes } = require('sequelize');
let Validator = require('fastest-validator');
/* create an instance of the validator */
let dataValidator = new Validator({
    useNewCustomCheckerFunction: true, // using new version
    messages: mensajesValidacion
});


exports.getAdmin = async(req, res) => {
    let datos = "",
        query = "",
        params = req.body.dataTablesParameters;

    if (req.body.solocabeceras == 1) {
        params = req.body;
        query = "SELECT * FROM adm.s_usuariossistemas_mgr('&modo=10&id_usuario=:id_usuario')"; //el modo no existe, solo es para obtener un registro

        datos = await db.sequelize.query(query, {
            replacements: {
                id_usuario: req.userId,
            },
            plain: false,
            raw: true,
            type: QueryTypes.SELECT
        });
    } else {
        query = "SELECT * FROM adm.s_usuariossistemas_mgr('" +
            "&sistema=adm&modo=:modo&id_usuario=:id_usuario" +
            "&inicio=:start&largo=:length" +
           // "&ordencampo=" + req.body.columns[req.body.order[0].column].data +
            //"&ordensentido=" + req.body.order[0].dir +
            //"&state=" + params.opcionesAdicionales.state +
            "&fkey=" + params.opcionesAdicionales.fkey +
            "&fkeyvalue=" + params.opcionesAdicionales.fkeyvalue.join(",") + "')";

        datos = await db.sequelize.query(query, {
            // A function (or false) for logging your queries
            // Will get called for every SQL query that gets sent
            // to the server.
            logging: console.log,

            replacements: {
                id_usuario: req.userId,
                modo: params.opcionesAdicionales.modo,

                start: (typeof params.start !== typeof undefined ? params.start : 0),
                length: (typeof params.start !== typeof undefined ? params.length : 1),

            },
            // If plain is true, then sequelize will only return the first
            // record of the result set. In case of false it will return all records.
            plain: false,

            // Set this to true if you don't have a model definition for your query.
            raw: true,
            type: QueryTypes.SELECT
        });
    }

    var columnNames = (datos.length > 0 ? Object.keys(datos[0]).map(function(key) {
        return key;
    }) : []);
    var quitarKeys = false;

    for (var i = 0; i < columnNames.length; i++) {
        if (columnNames[i] == "total_count") quitarKeys = true;
        if (quitarKeys)
            columnNames.splice(i);
    }

    respuesta = {
            draw: params.opcionesAdicionales.raw,
            recordsTotal: (datos.length > 0 ? parseInt(datos[0].total_count) : 0),
            recordsFiltered: (datos.length > 0 ? parseInt(datos[0].total_count) : 0),
            data: datos,
            columnNames: columnNames
        }
    res.status(200).send(respuesta);
    //return res.status(200).json(data);
    // res.status(500).send({ message: err.message });
}


exports.getRecord = async(req, res) => {

    Usuariossistemas.findOne({
            where: {
                id: req.body.id
            }
        })
        .then(usuariossistemas => {
            if (!usuariossistemas) {
                return res.status(404).send({ message: "Usuariossistemas Not found." });
            }

            res.status(200).send(usuariossistemas);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}


exports.setRecord = async(req, res) => {
    Object.keys(req.body.dataPack).forEach(function(key) {
        if (key.indexOf("id_", 0) >= 0) {
            if (req.body.dataPack[key] != '')
                req.body.dataPack[key] = parseInt(req.body.dataPack[key]);
        }
    });

    let existeUsuarioSistema=false;
    await Usuariossistemas.findOne({
        where: {
                [Op.and]: [{ id_usuarios: req.body.dataPack.id_usuarios }, {
                    sistema: req.body.dataPack.sistema,
                    state:'A'
                }],
        }
    })
    .then(usuariossistemas => {
        if (usuariossistemas) existeUsuarioSistema=true;
    });

    /* customer validator shema */
    const dataVSchema = {
        /*first_name: { type: "string", min: 1, max: 50, pattern: namePattern },*/
        
        id: { type: "number" },
        sistema: { type: "string" ,
            custom(value, errors) {
                if (existeUsuarioSistema ==true) errors.push({ type: "uniqueRecord"})
                return value; // Sanitize: remove all special chars except numbers
            },
        },
        id_permgrupos: {
            type: "number",
            custom(value, errors) {
                if (value <= 0) errors.push({ type: "selected"})
                return value; // Sanitize: remove all special chars except numbers
            }
        },
    };

    var vres = true;
    if (req.body.actionForm.toUpperCase() == "NUEVO" ||
        req.body.actionForm.toUpperCase() == "EDITAR") {
        vres = await dataValidator.validate(req.body.dataPack, dataVSchema);
    }

    /* validation failed */
    if (!(vres === true)) {
        let errors = {},
            item;

        for (const index in vres) {
            item = vres[index];

            errors[item.field] = item.message;
        }

        res.status(200).send({
            error: true,
            message: errors
        });
        return;
        /*throw {
            name: "ValidationError",
            message: errors
        };*/
    }

    //buscar si existe el registro
    Usuariossistemas.findOne({
            where: {
                [Op.or]: [{
                    [Op.and]: [{ id: req.body.dataPack.id }, {
                        id: {
                            [Op.gt]: 0
                        }
                    }],
                    [Op.and]: [{ id_usuarios: req.body.dataPack.id_usuarios }, {
                        sistema: req.body.dataPack.sistema
                    }],
                    
                }],
            }
        })
        .then(usuariossistemas => {
            if (!usuariossistemas) {
                req.body.dataPack.id=0;
                delete req.body.dataPack.created_at;
                delete req.body.dataPack.updated_at;
                req.body.dataPack.id_usuarios_r = req.userId;
                req.body.dataPack.state = globales.GetStatusSegunAccion(req.body.actionForm);

                Usuariossistemas.create(
                    req.body.dataPack
                ).then((self) => {
                    // here self is your instance, but updated
                    req.body.dataPack.id = self.id
                    this.setPerfilExtra(req, record_catzonasgeograficas)
                    res.status(200).send({ message: "success", id: self.id });
                }).catch(err => {
                    res.status(200).send({ error: true, message: [err.errors[0].message] });
                });
            } else {
                delete req.body.dataPack.created_at;
                delete req.body.dataPack.updated_at;
                req.body.dataPack.id_usuarios_r = req.userId;
                req.body.dataPack.state = globales.GetStatusSegunAccion(req.body.actionForm);

                usuariossistemas.update(req.body.dataPack).then((self) => {
                    // here self is your instance, but updated
                    req.body.dataPack.id = self.id;
                    this.setPerfilExtra(req, record_catzonasgeograficas)
                    res.status(200).send({ message: "success", id: req.body.dataPack.id });
                });
            }

            let record_catzonasgeograficas;
            record_catzonasgeograficas = req.body.dataPack.record_catzonasgeograficas;
            delete req.body.dataPack.created_at;
            delete req.body.dataPack.updated_at;
            delete req.body.dataPack.record_catzonasgeograficas;
            req.body.dataPack.id_usuarios_r = req.userId;
            req.body.dataPack.state = globales.GetStatusSegunAccion(req.body.actionForm);
            //req.body.dataPack.state = globales.GetStatusSegunAccion(req.body.actionForm);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

exports.setPerfilExtra = async(req, record_catzonasgeograficas) => {
    
    //Eliminar las zonas
    await Usuarios_zonas.destroy({
        where: {
            id_usuarios: req.body.dataPack.id_usuarios,
            sistema:req.body.dataPack.sistema,
        },
    });

    if (req.body.actionForm.toUpperCase() == "NUEVO" ||
    req.body.actionForm.toUpperCase() == "EDITAR"){
        //ingresar las zonas
        for (let i = 0; i < record_catzonasgeograficas.length; i++) {
            await Usuarios_zonas.create({
                id_usuarios: req.body.dataPack.id_usuarios,
                id_catzonageografica: record_catzonasgeograficas[i],
                id_usuarios_r: req.userId,
                sistema:req.body.dataPack.sistema
            });
        }
    }
}