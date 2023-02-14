const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    const param = {};
    param.username=req.body.request.user
    param.password=req.body.request.pass
    param.email=req.body.request.email
    // Save User to Database
    User.create({
            username: param.username,
            email: param.email,
            pass: bcrypt.hashSync(param.password, 8)
        })
        .then(user => {
            res.send({ 
                codigo:"00400",
                mensaje: "Usuario registrado correctamente",
                response: {
                }
             });
        })
        .catch(err => {
            let mensaje="";
            if(err.original.code=="23505")
                mensaje="El nombre de usuario ya existe"
                
            res.status(200).send({ 
                codigo:"00400",
                mensaje: mensaje,
                response: {
                }
             });
        });
};

exports.signin = (req, res) => {
    const param = {};
    param.username=req.body.request.user
    param.password=req.body.request.pass
    
    User.findOne({
            where: {
                username: param.username
            }
        })
        .then(user => {
            if (!user) {
                return res.status(200).send({ 
                        codigo:"00400",
                        mensaje: "Usuario no registrado",
                        response: {
                        }
                     });
            }

            var passwordIsValid = bcrypt.compareSync(
                param.password,
                user.pass
            );

            if (!passwordIsValid) {
                return res.status(200).send({ 
                    codigo:"00400",
                    mensaje: "Contraseña inválida",
                    response: {
                    }
                 });
            }

            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            var authorities = [];
            /*for (let i = 0; i < roles.length; i++) {
                authorities.push("ROLE_" + roles[i].name.toUpperCase());
            }*/
            res.status(200).send(
                { 
                    codigo:"00200",
                    mensaje: "Usuario válido",
                    response: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        roles: authorities,
                        accessToken: token
                    }
                }
            );
        })
        .catch(err => {
            res.status(200).send(
                { 
                    codigo:"00500",
                    mensaje: err.mensaje,
                    response: {
                    }
                 });
        });
};