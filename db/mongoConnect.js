const mongoose = require('mongoose');
const config = require('config');

module.exports = function connectDatabase()
{
    let db_connection_uri = "";

    if(process.env.NODE_ENV == undefined || process.env.NODE_ENV == 'development')
        db_connection_uri = config.get('uri');

    if(process.env.NODE_ENV == 'production')
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




