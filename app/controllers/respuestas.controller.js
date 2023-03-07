const db = require("../models");
const globales = require("../config/global.config");
const mensajesValidacion = require("../config/validate.config");
const Respuestas = db.respuestas;
const Op = db.Sequelize.Op;

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

exports.setCuestionario = async(req, res) => {

    const resArr=req.body.request.respuestas
    const id_proyectos=req.body.request.id_proyectos
    const id_usuarios=req.body.id_usuarios
    let dataPack=""; 

    for(let i=0;i<resArr.length;i++){
        dataPack={
            "id_usuarios":id_usuarios,
            "id_proyectos":id_proyectos,
            "id_catpreguntas":resArr[i].id_catpreguntas,
            "respuesta":resArr[i].respuesta,
        }
        this.setRecord(dataPack)
    }

     //console.log(JSON.stringify(respuesta));
    res.status(200).send( { 
        codigo:"00200",
        mensaje: "",
        response: {
                   
                }
            }
        );
    //return res.status(200).json(data);
    // res.status(500).send({ message: err.message });
}

exports.setRecord = async(dataPack) => {
    Object.keys(dataPack).forEach(function(key) {
        if (key.indexOf("id_", 0) >= 0) {
            if (dataPack[key] != '')
                dataPack[key] = parseInt(dataPack[key]);
        }
    })

    /* customer validator shema */
    const dataVSchema = {
        /*first_name: { type: "string", min: 1, max: 50, pattern: namePattern },*/
    };

    var vres = true;
    vres = await dataValidator.validate(dataPack, dataVSchema);

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
                [Op.and]: [{ id_proyectos: dataPack.id_proyectos }, {
                    id_catpreguntas: dataPack.id_catpreguntas
                }],
            }
        })
        .then(respuestas => {
            if (!respuestas) {
                delete dataPack.id;
                delete dataPack.created_at;
                delete dataPack.updated_at;
                dataPack.id_usuarios_r = dataPack.id_usuarios;
                dataPack.state = globales.GetStatusSegunAccion("editar");

                Respuestas.create(
                    dataPack
                ).then((self) => {
                    // here self is your instance, but updated
                    return(
                        { 
                            codigo:"00200",
                            mensaje: "",
                            response: {
                                        id: self.id,
                                    }
                        })
                }).catch(err => {
                    return(
                        { 
                            codigo:"00400",
                            mensaje: err,
                            response: {
                                    }
                        });
                });
            } else {
                delete dataPack.created_at;
                delete dataPack.updated_at;
                dataPack.id_usuarios_r = dataPack.id_usuarios;
                dataPack.state = globales.GetStatusSegunAccion("editar");

                respuestas.update(dataPack).then((self) => {
                    // here self is your instance, but updated
                    return(
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
            return(
                { 
                    codigo:"00400",
                    mensaje: err.message,
                    response: {
                            }
                });
        });
}