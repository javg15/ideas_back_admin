const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
// set port, listen for requests
const PORT = process.env.PORT || 8082;

var corsOptions = {
    origin: "http://localhost:8081"
};

//app.use(cors(corsOptions));
app.use((req, res, next) => {
    /*const allowedOrigins = ['http://localhost:8081', 'http://localhost:4200', 'http://127.0.0.1:8080', 'https://app.visorplus.mx/'];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }*/
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
});

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./app/models");

db.sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        // inside our db sync callback, we start the server.
        // this is our way of making sure the server is not listening
        // to requests if we have not yet made a db connection
        app.listen(PORT, () => {
            console.log(`App listening on PORT ${PORT}`);
        });
    }).catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application.", });
});

// routes
/*require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/shared.routes')(app);
require('./app/routes/personal.routes')(app);
require('./app/routes/archivos.routes')(app);
require('./app/routes/permgrupos.routes')(app);
require('./app/routes/catzonageografica.routes')(app);
require('./app/routes/catsistemas.routes')(app);
require('./app/routes/usuariossistemas.routes')(app);*/
require('./app/routes/index.routes')(app);