const { authJwt } = require("../middleware");
const controller = require("../controllers/permgrupos.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/permgrupos/getAdmin", [authJwt.verifyToken],
        controller.getAdmin
    );
    app.post(
        "/api/permgrupos/getRecord", [authJwt.verifyToken],
        controller.getRecord
    );
    app.post(
        "/api/permgrupos/getTreePermisos", [authJwt.verifyToken],
        controller.getTreePermisos
    );
    app.post(
        "/api/permgrupos/setRecord", [authJwt.verifyToken],
        controller.setRecord
    );

    app.post(
        "/api/permgrupos/getCatalogo", [authJwt.verifyToken],
        controller.getCatalogo
    );
    app.post(
        "/api/permgrupos/getCatalogoSegunSistema", [authJwt.verifyToken],
        controller.getCatalogoSegunSistema
    );
};