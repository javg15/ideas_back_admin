const db = require("../models");
const { Op } = require("sequelize");
const mensajesValidacion = require("../config/validate.config");
const globales = require("../config/global.config");
const Permgrupos = db.permgrupos;
const Permgruposmodulos = db.permgruposmodulos;

const { QueryTypes } = require('sequelize');
let Validator = require('fastest-validator');
/* create an instance of the validator */
let dataValidator = new Validator({
    useNewCustomCheckerFunction: true, // using new version
    messages: mensajesValidacion
});

let jsonPermisos=[];


exports.getAdmin = async(req, res) => {
    let datos = "",
        query = "";

    if (req.body.solocabeceras == 1) {
        query = "SELECT * FROM adm.s_permgrupos_mgr('&sistema=adm&modo=10&id_usuario=:id_usuario')"; //el modo no existe, solo es para obtener un registro

        datos = await db.sequelize.query(query, {
            replacements: {
                id_usuario: req.userId,
            },
            plain: false,
            raw: true,
            type: QueryTypes.SELECT
        });
    } else {
        query = "SELECT * FROM adm.s_permgrupos_mgr('" +
            "&sistema=adm&modo=0&id_usuario=:id_usuario" +
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


exports.getRecord = async(req, res) => {

    Permgrupos.findOne({
            where: {
                id: req.body.id
            }
        })
        .then(permgrupos => {
            if (!permgrupos) {
                return res.status(200).send({ message: "Permgrupos Not found." });
            }

            res.status(200).send(permgrupos);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

exports.getCatalogo = async(req, res) => {

    Permgrupos.findAll({
            attributes: ['id', 'idesc'],
            where: [{
                icode: {
                    [Op.not]: 'SAD'
                }
            }],
            order: [
                ['idesc', 'ASC'],
            ]
        }).then(permgrupos => {
            if (!permgrupos) {
                return res.status(200).send({ message: "Permgrupos Not found." });
            }

            res.status(200).send(permgrupos);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

exports.getCatalogoSegunSistema = async(req, res) => {

    Permgrupos.findAll({
            attributes: ['id', 'idesc'],
            where: {
                [Op.and]: [
                    {sistema: req.body.sistema},
                    [{
                        icode: {
                            [Op.not]: 'SAD'
                        }
                    }]
                  ]
                
            },
            order: [
                ['idesc', 'ASC'],
            ]
        }).then(permgrupos => {
            if (!permgrupos) {
                return res.status(200).send({ message: "Permgrupos Not found." });
            }

            res.status(200).send(permgrupos);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}


exports.getTreePermisos = async(req, res) => {
    let datos = "",
    query = "";

    query = "SELECT adm.fn_permisosgrupo_seleccion(:id_grupos,0,:sistema) AS treejson";

    datos = await db.sequelize.query(query, {
        // A function (or false) for logging your queries
        // Will get called for every SQL query that gets sent
        // to the server.
        logging: console.log,

        replacements: {
            id_grupos: req.body.id_grupos,
            sistema: req.body.sistema,
        },
        // If plain is true, then sequelize will only return the first
        // record of the result set. In case of false it will return all records.
        plain: false,

        // Set this to true if you don't have a model definition for your query.
        raw: true,
        type: QueryTypes.SELECT
    });


    //console.log(JSON.stringify(respuesta));
    res.status(200).send(datos[0].treejson);
    //return res.status(200).json(data);
    // res.status(500).send({ message: err.message });
}

exports.setRecord = async(req, res) => {
    Object.keys(req.body.dataPack).forEach(function(key) {
        if (key.indexOf("id_", 0) >= 0) {
            if (req.body.dataPack[key] != '')
                req.body.dataPack[key] = parseInt(req.body.dataPack[key]);
        }
    })

    /* customer validator shema */
    const dataVSchema = {
        /*first_name: { type: "string", min: 1, max: 50, pattern: namePattern },*/

        id: { type: "number" },
        idesc: { type: "string", empty: false },
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
    Permgrupos.findOne({
        where: {
            [Op.and]: [{ id: req.body.dataPack.id }, {
                id: {
                    [Op.gt]: 0
                }
            }],
        }
    })
    .then(permgrupos => {
        if (!permgrupos) {
            delete req.body.dataPack.id;
            delete req.body.dataPack.created_at;
            delete req.body.dataPack.updated_at;
            req.body.dataPack.id_usuarios_r = req.userId;
            req.body.dataPack.state = globales.GetStatusSegunAccion(req.body.actionForm);

            Permgrupos.create(
                req.body.dataPack
            ).then((self) => {
                // Actualizar los permisos
                jsonPermisos=[];
                this.loopPermisos(req.body.nodes,this.setJsonPermisos);    
                this.updatePermisos(self.id);
                //res.status(200).send({ message: "success" });
                res.status(200).send({ message: "success", id: self.id });

            }).catch(err => {
                res.status(500).send({ message: err });
            });
        } else {
            delete req.body.dataPack.created_at;
            delete req.body.dataPack.updated_at;
            req.body.dataPack.id_usuarios_r = req.userId;
            req.body.dataPack.state = globales.GetStatusSegunAccion(req.body.actionForm);

            permgrupos.update(req.body.dataPack).then((self) => {
                 // Actualizar los permisos
                 jsonPermisos=[];
                 this.loopPermisos(req.body.nodes,this.setJsonPermisos);    
                 this.updatePermisos(req.body.dataPack["id"]);
                    // here self is your instance, but updated
                res.status(200).send({ message: "success", id: self.id });
            });
        }


    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });

    
}

exports.loopPermisos = (o,func) => {
    for (var i in o) {
        if(i=="checked" && o[i]==true)
          func.apply(this,[o["id_item"].split("-")[0],o["id_item"].split("-")[1]]);  
        if (o[i] !== null && typeof(o[i])=="object") {
            //going one step down in the object tree!!
            this.loopPermisos(o[i],func);
        }
    }
}

exports.setJsonPermisos = (id,permiso) => {

    for (var i = 0; i < jsonPermisos.length; i++){
        // look for the entry with a matching `code` value
        if (jsonPermisos[i].id_item == id){
           // we found it
           jsonPermisos[i].permisos=jsonPermisos[i].permisos+ "," + permiso ;
           return;
        }
    }
    jsonPermisos.push({"id_item":id,permisos:permiso})
}

exports.updatePermisos = async (id_grupo) => {
    //vaciar los permisos
    await Permgruposmodulos.destroy({
        where: {
            [Op.and]: [{ id_permgrupos: id_grupo }, {
                state: ["A"]
            }],
        }
    })

    //buscar si existe el registro
    for (var i = 0; i < jsonPermisos.length; i++){
        // look for the entry with a matching `code` value
        await Permgruposmodulos.create(
            { id_permgrupos: id_grupo, 
            id_modulos:jsonPermisos[i].id_item,
            privilegios:jsonPermisos[i].permisos 
        }).then((self) => {
            // here self is your instance, but updated
            //res.status(200).send({ message: "success", id: self.id });
        }).catch(err => {
            console.log("err=>",err)
            return({ message: err });
        });
    }
    
    
}