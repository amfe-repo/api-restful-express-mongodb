const express = require('express');
const bcrypt = require('bcrypt');


const UsersModel = require('../models/usersModel');
const UsersValidate = require('../validations/userSchemaValidate');
const validateToken = require('../middlewares/authMiddleware');

const route = express.Router();

route.get('/', validateToken, (req, res)=>
{
    findUsersActive()
        .then((users)=>
        {
            res.json(users);
        })
        .catch(()=>
        {
            res.json({msg: 'Error', value: false});
        })
});


route.post('/', (req, res)=>
{
    createUser(req.body)
    .then((user_data)=>
    {
        res.json({ user: user_data, value: true });
    })
    .catch((err)=>
    {
        res.status(400).json({user: err, value: false});
    })
});


route.put('/:email', validateToken, (req, res)=>
{
    updateUser(req.params.email, req.body)
        .then(user => res.json({ user: user, value: true }))
        .catch(err => res.json({ user: err, value: false }))
});


route.delete('/:email', validateToken, (req, res)=>
{
    updateStateUser(req.params.email)
        .then(response => res.json({user: response, value: true }))
        .catch(err => res.json({ user: err, value: false }))
        
});


//helpers functions
async function findUsersActive()
{
    let response = await UsersModel.find({'state': true})
        .select({name: 1, email: 1});

    return response;
}


async function createUser(info)
{
    const value = await UsersValidate.validate({name: info.name, password: info.password, email: info.email});

    if(value.error)
        throw value.error.message;
    
    if(await findUserState(info.email))
        throw 'This email exist';

    const user = new UsersModel(
        {
            email: info.email,
            name: info.name,
            password: bcrypt.hashSync(info.password, 10)
        });
    
    return await user.save();
}


async function updateUser(email, info)
{
    // Security error -- search user to name or password too
    const value = await UsersValidate.validate({name: info.name, password: info.password});

    if(value.error)
        throw value.error.message;

    let response = await findUserState(email);

    try
    {
        if(response)
        {
            await UsersModel.updateOne({"email": email}, 
            {
                name: info.name,
                password: bcrypt.hashSync(info.password, 10)
            });
            return await findUserByEmail(email);
        }

        return 'User not exist';
    }
    catch
    {
        throw 400;
    }
}


async function updateStateUser(email)
{
    let response = await findUserState(email);

    if(response)
    {
        try
        {
            await UsersModel.updateOne({"email": email}, {state: false});
            return 'User deleted';
        }
        catch
        {
            throw 'Error with insertion';
        }
    }
       
    return 'User not exist';
}


async function findUserByEmail(email)
{
    return await UsersModel.findOne({"email": email});
}


async function findUserState(email)
{
    let user = await findUserByEmail(email);
    if (user == null) return false;
    return user.state;
}


module.exports = route;