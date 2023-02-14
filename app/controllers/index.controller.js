const ctrl = {};
ctrl.auth = require("../controllers/auth.controller.js");

exports.index = (req, res) => {
    /*{
    uid: '321654656',
    usuario: 'bvelasco',
    fecha: '01/01/2023',
    accion: 'autenticacion',
    request: {
          user: 'bvelasco',
          pass: '1233456'
     }
    }
     */
    //res.status(200).send("hola");
    console.log("req.body=>",req.body)
    switch(req.body.accion.toLowerCase()){
        case "signup": ctrl.auth.signup(req, res); break;
        case "signin": ctrl.auth.signin(req, res); break;
    }
    
};

