const { authJwt } = require("../middleware");
const controller = require("../controllers/catzonageografica.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/catzonageografica/getCatalogo", [authJwt.verifyToken],
        controller.getCatalogo
    );
    app.post(
        "/api/catzonageografica/getCatalogoOpen",
        controller.getCatalogoOpen
    );
    app.post(
        "/api/catzonageografica/getAdmin", [authJwt.verifyToken],
        controller.getAdmin
    );
    app.post(
        "/api/catzonageografica/getRecord", [authJwt.verifyToken],
        controller.getRecord
    );
};