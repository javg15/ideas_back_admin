const ctrl = {};
const globales = require("../config/global.config");
ctrl.auth = require("../controllers/auth.controller.js");
ctrl.user = require("../controllers/user.controller.js");
ctrl.catpreguntas = require("../controllers/catpreguntas.controller.js");
ctrl.respuestas = require("../controllers/respuestas.controller.js");

exports.index = (req, res) => {

    switch(req.body.metodo.toLowerCase()){
        case "signup": ctrl.auth.signup(req, res); break;
        case "signin": ctrl.auth.signin(req, res); break;
        case "refreshtoken": ctrl.auth.refreshToken(req, res); break;
        case "getmenu": ctrl.user.getMenu(req, res); break;
        case "/catpreguntas/getcuestionario":ctrl.catpreguntas.getCuestionario(req, res); break;
        case "/respuestas/setcuestionario":ctrl.respuestas.setCuestionario(req, res); break;
        case "/respuestas/getideacion":ctrl.respuestas.getIdeacion(req, res); break;
        case "/respuestas/getproducto":ctrl.respuestas.getProducto(req, res); break;
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

