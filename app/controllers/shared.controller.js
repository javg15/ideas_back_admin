const db = require("../models");

const { QueryTypes } = require('sequelize');

exports.getSearchcampos = async(req, res) => {

    const query = "SELECT s.id,s.etiqueta as idesc,s.orden,s.edicion " +
        ",case when s.edicion=1 then adm.fn_search_valores(UPPER(:modulo),s.campo,:id_usuario) else '' end as valores " +
        "FROM adm.searchcampos as s " +
        "LEFT JOIN adm.modulos AS m ON s.id_modulos=m.id " +
        "WHERE s.state='A' AND upper(m.ruta)=UPPER(:modulo) " +
        "ORDER BY s.orden";

    const datos = await db.sequelize.query(query, {
        // A function (or false) for logging your queries
        // Will get called for every SQL query that gets sent
        // to the server.
        logging: console.log,

        replacements: {
            modulo: req.body.nombreModulo,
            id_usuario: req.body.id_usuario,
        },
        // If plain is true, then sequelize will only return the first
        // record of the result set. In case of false it will return all records.
        plain: false,

        // Set this to true if you don't have a model definition for your query.
        raw: true,
        type: QueryTypes.SELECT
    });

    respuesta = {
            data: datos,
        }
        //console.log(JSON.stringify(respuesta));
    res.status(200).send(respuesta);
    //return res.status(200).json(data);
    // res.status(500).send({ message: err.message });
}

exports.getSearchoperadores = async(req, res) => {

    const query = "SELECT so.id,so.etiqueta as idesc,so.orden " +
        "FROM adm.searchoperador AS so " +
        "    INNER JOIN adm.searchcampos AS sc ON so.tipo =sc.tipo " +
        "WHERE so.state='A' AND sc.id=:id_campo " +
        "ORDER BY so.orden,so.etiqueta";

    const datos = await db.sequelize.query(query, {
        // A function (or false) for logging your queries
        // Will get called for every SQL query that gets sent
        // to the server.
        logging: console.log,

        replacements: {
            id_campo: req.body.id_campo,
        },
        // If plain is true, then sequelize will only return the first
        // record of the result set. In case of false it will return all records.
        plain: false,

        // Set this to true if you don't have a model definition for your query.
        raw: true,
        type: QueryTypes.SELECT
    });

    respuesta = {
            data: datos,
        }
        //console.log(JSON.stringify(respuesta));
    res.status(200).send(respuesta);
    //return res.status(200).json(data);
    // res.status(500).send({ message: err.message });
}