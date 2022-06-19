const express = require('express');
const config = require('config');
const app = express();
const session = require("express-session")
const {checkStatus} = require('../apps/middlewares/auth')
const paypal  =  require('paypal-rest-sdk');
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.set("views",config.get('app').views_floder);
app.set("view engine",  config.get('app').views_engine);
app.use("/static", express.static(config.get('app').static_folder));

app.set('trust proxy', 1) // trust first proxy
const sessionDriver = session({
    secret: config.get("app").session_key ,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: config.get("app").session_secure }
});
app.use(sessionDriver);
// app.use(checkStatus)
app.use(require("../apps/middlewares/share"));
    


app.use(require("../routers/web"));
module.exports = app;