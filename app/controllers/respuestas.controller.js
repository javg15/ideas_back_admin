const db = require("../models");
const mensajesValidacion = require("../config/validate.config");
const Respuestas = db.respuestas;

const { QueryTypes } = require('sequelize');
let Validator = require('fastest-validator');
/* create an instance of the validator */
let dataValidator = new Validator({
    useNewCustomCheckerFunction: true, // using new version
    messages: mensajesValidacion
});


exports.getAdmin = async(req, res) => {
    let datos = "",
        query = "";

    if (req.body.solocabeceras == 1) {
        query = "SELECT * FROM s_respuestas_mgr('&modo=10&id_usuario=:id_usuario')"; //el modo no existe, solo es para obtener un registro

        datos = await db.sequelize.query(query, {
            replacements: {
                id_usuario: req.userId,
            },
            plain: false,
            raw: true,
            type: QueryTypes.SELECT
        });
    } else {
        query = "SELECT * FROM s_respuestas_mgr('" +
            "&modo=0&id_usuario=:id_usuario" +
            "&inicio=:start&largo=:length" +
            "&scampo=" + req.body.opcionesAdicionales.datosBusqueda.campo + "&soperador=" + req.body.opcionesAdicionales.datosBusqueda.operador + "&sdato=" + req.body.opcionesAdicionales.datosBusqueda.valor +
            "&ordencampo=" + req.body.columns[req.body.order[0].column].data +
            "&ordensentido=" + req.body.order[0].dir + "')";

        datos = await db.sequelize.query(query, {
            // A function (or false) for logging your queries
            // Will get called for every SQL query that gets sent
            // to the server.
            logging: console.log,

            replacements: {
                id_usuario: req.userId,
                start: (typeof req.body.start !== typeof undefined ? req.body.start : 0),
                length: (typeof req.body.start !== typeof undefined ? req.body.length : 1),

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
            draw: req.body.opcionesAdicionales.raw,
            recordsTotal: (datos.length > 0 ? parseInt(datos[0].total_count) : 0),
            recordsFiltered: (datos.length > 0 ? parseInt(datos[0].total_count) : 0),
            data: datos,
            columnNames: columnNames
        }
        //console.log(JSON.stringify(respuesta));
    res.status(200).send(respuesta);
    //return res.status(200).json(data);
    // res.status(500).send({ message: err.message });
}

exports.getRegistros = async(req, res) => {

    let datos = "",
    query = "";

    query = "SELECT r.id,r.respuestas "
    + "FROM proyectos as p "
    + "    left join respuestas r on p.id =r.id_proyectos "
    + "    left join catpreguntas c on r.id_catpreguntas =c.id "
    + "    left join catseccioncuest cs on c.id_catseccioncuest =cs.id  "
    + "WHERE p.id_usuarios = :id_usuarios "
    + "    and p.id =:id_proyectos "
    + "    and cs.id_cuestionario =:id_cuestionario "
    + "    and p.state IN('A','B')";

    datos = await db.sequelize.query(query, {
        // A function (or false) for logging your queries
        // Will get called for every SQL query that gets sent
        // to the server.
        logging: console.log,

        replacements: {
            id_usuarios: req.body.request.id_usuarios,
            id_proyectos: req.body.request.id_proyectos,
            id_cuestionario: req.body.request.id_cuestionario
        },
        // If plain is true, then sequelize will only return the first
        // record of the result set. In case of false it will return all records.
        plain: false,

        // Set this to true if you don't have a model definition for your query.
        raw: true,
        type: QueryTypes.SELECT
    });


    //console.log(JSON.stringify(respuesta));
    res.status(200).send({ 
        codigo:"00200",
        mensaje: "",
        response: {
                    datos
                }
            });
    //return res.status(200).json(data);
    // res.status(500).send({ message: err.message });
}

exports.setRecord = async(req, res) => {
    Object.keys(req.body.request.dataPack).forEach(function(key) {
        if (key.indexOf("id_", 0) >= 0) {
            if (req.body.request.dataPack[key] != '')
                req.body.request.dataPack[key] = parseInt(req.body.request.dataPack[key]);
        }
    })

    /* customer validator shema */
    const dataVSchema = {
        /*first_name: { type: "string", min: 1, max: 50, pattern: namePattern },*/

        sistema: { type: "string", min: 2, max: 2 },
    };

    var vres = true;
    if (req.body.request.actionForm.toUpperCase() == "NUEVO" ||
        req.body.request.actionForm.toUpperCase() == "EDITAR") {
        vres = await dataValidator.validate(req.body.request.dataPack, dataVSchema);
    }

    /* validation failed */
    if (!(vres === true)) {
        let errors = {},
            item;

        for (const index in vres) {
            item = vres[index];

            errors[item.field] = item.message;
        }

        res.status(200).send(
            { 
                codigo:"00400",
                mensaje: errors,
                response: {
                        }
            });
        return;
        /*throw {
            name: "ValidationError",
            message: errors
        };*/
    }

    //buscar si existe el registro
    Respuestas.findOne({
            where: {
                [Op.and]: [{ id: req.body.request.dataPack.id }, {
                    id: {
                        [Op.gt]: 0
                    }
                }],
            }
        })
        .then(respuestas => {
            if (!respuestas) {
                delete req.body.request.dataPack.id;
                delete req.body.request.dataPack.created_at;
                delete req.body.request.dataPack.updated_at;
                req.body.request.dataPack.id_usuarios_r = req.userId;
                req.body.request.dataPack.state = globales.GetStatusSegunAccion(req.body.request.actionForm);

                Respuestas.create(
                    req.body.request.dataPack
                ).then((self) => {
                    // here self is your instance, but updated
                    res.status(200).send(
                        { 
                            codigo:"00200",
                            mensaje: "",
                            response: {
                                        id: self.id,
                                    }
                        })
                }).catch(err => {
                    res.status(200).send(
                        { 
                            codigo:"00400",
                            mensaje: err,
                            response: {
                                    }
                        });
                });
            } else {
                delete req.body.request.dataPack.created_at;
                delete req.body.request.dataPack.updated_at;
                req.body.request.dataPack.id_usuarios_r = req.userId;
                req.body.request.dataPack.state = globales.GetStatusSegunAccion(req.body.request.actionForm);

                respuestas.update(req.body.request.dataPack).then((self) => {
                    // here self is your instance, but updated
                    res.status(200).send(
                        { 
                            codigo:"00200",
                            mensaje: "",
                            response: {
                                        id: self.id,
                                    }
                        })
                });
            }


        })
        .catch(err => {
            res.status(200).send(
                { 
                    codigo:"00400",
                    mensaje: err.message,
                    response: {
                            }
                });
        });
}