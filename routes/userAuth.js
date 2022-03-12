const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UsersModel = require('../models/usersModel');

const route = express.Router();

route.post('/', (req, res)=>
{
    UsersModel.findOne({email: req.body.email})
    .then(data =>
        {
            if(data)
            {
                const pass = bcrypt.compareSync(req.body.password, data.password);
                if(!pass) return res.status(400).json({ error: true, msg: 'User not found' });

                const twtToken = jwt.sign({data: data}, 'my_secret', {expiresIn: 600})
                return res.json({token: twtToken});
            }
            else
                res.status(400).json({ error: true, msg: 'User not found' });
        })
    .catch(err => 
        {
            res.status(400).json({ error: err, msg: 'Request error' }); 
        })
});

module.exports = route;