const { authJwt } = require("../middleware");
const controller = require("../controllers/catsistemas.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/catsistemas/getCatalogo", [authJwt.verifyToken],
        controller.getCatalogo
    );
    app.post(
        "/api/catsistemas/getCatalogoOpen",
        controller.getCatalogoOpen
    );
    app.post(
        "/api/catsistemas/getAdmin", [authJwt.verifyToken],
        controller.getAdmin
    );
    app.post(
        "/api/catsistemas/getRecord", [authJwt.verifyToken],
        controller.getRecord
    );
};