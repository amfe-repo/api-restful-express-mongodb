const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = validateToken = (req, res, next)=>
{
    jwt.verify(req.get('AuthToken'), 'my_secret', (err, decoded)=>
    {
        if(err) return res.status(400).json({err: err});

        req.user = decoded.data;
        next();
    })

}