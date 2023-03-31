const db = require("../models");
const { Op } = require("sequelize");
const mensajesValidacion = require("../config/validate.config");
const globales = require("../config/global.config");
const Proyectos = db.proyectos;
const Request = require("request");
var moment = require('moment');

const { QueryTypes } = require('sequelize');
let Validator = require('fastest-validator');
/* create an instance of the validator */
let dataValidator = new Validator({
    useNewCustomCheckerFunction: true, // using new version
    messages: mensajesValidacion
});


exports.getRecord = async(req, res) => {

    Proyectos.findOne({
            where: {
                id: req.body.id
            }
        })
        .then(proyectos => {
            /*if (!proyectos) {
                return res.status(200).send({ message: "Proyectos Not found." });
            }*/

            res.status(200).send(proyectos);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}


exports.setRecord = async(dataPack) => {
    Object.keys(dataPack).forEach(function(key) {
        if (key.indexOf("id_", 0) >= 0) {
            if (dataPack[key] != '')
                dataPack[key] = parseInt(dataPack[key]);
        } else if (key == "descripcion" ) {
            dataPack[key] = dataPack[key].toUpperCase();
        }

        if (typeof dataPack[key] == 'number' && isNaN(parseFloat(dataPack[key]))) {
            dataPack[key] = null;
        }
    })
    //let curpValido = false;
    //console.log(JSON.parse(curpValido).Response)
    /* customer validator shema */
    const dataVSchema = {
        /*first_name: { type: "string", min: 1, max: 50, pattern: namePattern },*/

        id: { type: "number" },
        descripcion: { type: "string", empty: false },

    };



    var vres = true;
    if (req.body.actionForm.toUpperCase() == "NUEVO" ||
        req.body.actionForm.toUpperCase() == "EDITAR") {
        vres = await dataValidator.validate(dataPack, dataVSchema);
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
    Proyectos.findOne({
            where: {
                [Op.and]: [{ id: dataPack.id }, {
                    id: {
                        [Op.gt]: 0
                    }
                }],
            }
        })
        .then(proyectos => {
            if (!proyectos) {
                delete dataPack.id;
                delete dataPack.created_at;
                delete dataPack.updated_at;
                dataPack.id_usuarios_r = dataPack.id_usuarios;
                dataPack.state = globales.GetStatusSegunAccion(dataPack.actionForm);

                Proyectos.create(
                    dataPack
                ).then((self) => {
                    // here self is your instance, but updated
                    Resolve(
                        { 
                            codigo:"00200",
                            mensaje: "",
                            response: {
                                        id: self.id,
                                    }
                        })
                }).catch(err => {
                    Resolve(
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
                dataPack.state = globales.GetStatusSegunAccion(dataPack.actionForm);

                proyectos.update(dataPack).then((self) => {
                    // here self is your instance, but updated
                    Resolve(
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
            Resolve(
                { 
                    codigo:"00400",
                    mensaje: err.message,
                    response: {
                            }
                });
        });

}

