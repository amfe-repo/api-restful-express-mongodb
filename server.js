const express = require('express');
const path = require('path');

const mongoDb = require('./db/mongo-connect');
const usersRoutes = require('./routes/usersRoutes');
const coursesRoutes = require('./routes/coursesRoutes');
const userAuthRoutes = require('./routes/userAuth');

const server = express();

//Db Connection
mongoDb();

//Middlewares
server.use(express.json());
server.use(express.urlencoded({extended:true}));

server.use('/api/users', usersRoutes);
server.use('/api/courses', coursesRoutes);
server.use('/api/auth', userAuthRoutes);


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