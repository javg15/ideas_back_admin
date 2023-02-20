const ctrl = {};
ctrl.auth = require("../controllers/auth.controller.js");
ctrl.user = require("../controllers/user.controller.js");
ctrl.catpreguntas = require("../controllers/catpreguntas.controller.js");

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
        case "getmenu": ctrl.user.getMenu(req, res); break;
        case "/catpreguntas/getcuestionario":ctrl.catpreguntas.getCuestionario(req, res); break;
        default:res.status(200).send(
            { 
                codigo:"00100",
                mensaje: "no existe el metodo",
                response: {
                }
             }
            )
    }
    
};

