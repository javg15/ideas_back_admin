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
        case "getmenu": ctrl.user.getMenu(req, res); break;
        case "/catpreguntas/getcuestionario":ctrl.catpreguntas.getCuestionario(req, res); break;
        case "/respuestas/setcuestionario":ctrl.respuestas.setCuestionario(req, res); break;
        case "/respuestas/getriesgo_percepcion_idea":
                req.body.request.id_grafica=1
                ctrl.respuestas.getIdeacion(req, res); break;
        case "/respuestas/getriesgo_objetivo_idea":
            req.body.request.id_grafica=2
            ctrl.respuestas.getIdeacion(req, res); break;
        case "/respuestas/getcreacion_personaje":
            req.body.request.id_grafica=3
            ctrl.respuestas.getIdeacion(req, res); break;
        case "/respuestas/getfoda":
            req.body.request.id_grafica=4
            ctrl.respuestas.getIdeacion(req, res); break;
        case "/respuestas/getcultura":
            req.body.request.id_grafica=5
            ctrl.respuestas.getIdeacion(req, res); break;
        case "/respuestas/getvalores":
            req.body.request.id_grafica=5
            ctrl.respuestas.getIdeacion(req, res); break;
        case "/respuestas/getvision":
            req.body.request.id_grafica=6
            ctrl.respuestas.getIdeacion(req, res); break;
        case "/respuestas/getproductonombre":ctrl.respuestas.getProductoNombre(req, res); break;
        case "/respuestas/getproductoatributos":ctrl.respuestas.getProductoNombre(req, res); break;
        case "/respuestas/getproductopropuesta":ctrl.respuestas.getProductoPropuesta(req, res); break;
        case "/respuestas/getproductotipo":ctrl.respuestas.getProductoTipo(req, res); break;
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

