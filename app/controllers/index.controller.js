const ctrl = {};
ctrl.auth = require("../controllers/auth.controller.js");

exports.index = (req, res) => {
    //res.status(200).send("hola");
    ctrl.auth.signup(req, res)
};

