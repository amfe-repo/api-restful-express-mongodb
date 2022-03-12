const mongoose = require('mongoose');

module.exports = function connectDatabase()
{
    let db_connection_uri = "";

    if(process.env.WORK_ENV == undefined || process.env.WORK_ENV == 'development')
        db_connection_uri = require('../config/development.json').uri;

    if(process.env.WORK_ENV == 'production')
        db_connection_uri = process.env.MONGO_URI;


    mongoose.connect(db_connection_uri)
        .then(function()
        {
            console.log('Connected to db');
        })
        .catch(function()
        {
            console.log('Conexion error');
        });
}




