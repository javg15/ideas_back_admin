const db = require("../models");
const config = require("../config/auth.config");
const { user: User,  refreshToken: RefreshToken  } = db;
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
                codigo:"00200",
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
                mensaje: mensaje,//err.original,
                response: {
                }
             });
        });
};

exports.signin =  (req, res) => {
    const param = {};
    param.username=req.body.request.user
    param.password=req.body.request.pass
    
    User.findOne({
            where: {
                username: param.username
            }
        })
        .then(async (user) => {
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

            const token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: config.jwtExpiration
              });
            
            let refreshToken = await RefreshToken.createToken(user);

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
                        accessToken: token,
                        refreshToken: refreshToken,
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

exports.refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;
  
    if (requestToken == null) {
        res.status(200).send(
            { 
                codigo:"00400",
                mensaje: "Refresh Token is required!",
                response: {
                }
             });
    }
  
    try {
      let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });
  
      //console.log(refreshToken)
  
      if (!refreshToken) {
        res.status(200).send(
            { 
                codigo:"00400",
                mensaje: "Refresh token is not in database!",
                response: {
                }
             });
        return;
      }
  
      if (RefreshToken.verifyExpiration(refreshToken)) {
        RefreshToken.destroy({ where: { id: refreshToken.id } });
        
        res.status(200).send(
            { 
                codigo:"00400",
                mensaje: "Refresh token was expired. Please make a new signin request",
                response: {
                }
             });

        return;
      }
  
      const user = await refreshToken.getUser();
      let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration,
      });
  
      return res.status(200).send(
        { 
            codigo:"00200",
            mensaje: "Refresh token was expired. Please make a new signin request",
            response: {
                accessToken: newAccessToken,
                refreshToken: refreshToken.token,
            }
         });

    } catch (err) {
        return res.status(200).send(
            { 
                codigo:"00500",
                mensaje: err,
                response: {
                    accessToken: newAccessToken,
                    refreshToken: refreshToken.token,
                }
             });
    }
  };