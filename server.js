const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const usersRoutes = require('./routes/usersRoutes');
const coursesRoutes = require('./routes/coursesRoutes');

const server = express();

//Db Connection
mongoose.connect(process.env.MONGO_URI)
    .then(function()
    {
        console.log('Connected to db');
    })
    .catch(function()
    {
        console.log('Conexion error');
    });


//Middlewares
server.use(express.json());
server.use(express.urlencoded({extended:true}));

server.use('/api/users', usersRoutes);
server.use('/api/courses', coursesRoutes);


//Configurations environments
const port = process.env.PORT || 3000;

server.get('/', (req, res)=>
{
    res.sendFile(path.join(__dirname,'/views/index.html'));
});

server.listen(port, ()=>
{
    console.log('Init server');
});