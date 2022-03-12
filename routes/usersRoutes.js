const express = require('express');
const UsersModel = require('../models/usersModel');

const route = express.Router();

route.get('/', (req, res)=>
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
    .then(()=>
    {
        res.json({ user: req.body, value: true });
    })
    .catch((err)=>
    {
        res.status(400).json({user: err, value: false});
    })
});


route.put('/:email', (req, res)=>
{
    updateUser(req.params.email, req.body)
        .then(user => res.json({ user: user, value: true }))
        .catch(err => res.json({ user: err, value: false }))
});


route.delete('/:email', (req, res)=>
{
    updateStateUser(req.params.email)
        .then(response => res.json({user: response, value: true }))
        .catch(err => res.json({ user: err, value: false }))
        
});


//helpers functions
async function findUsersActive()
{
    let response = await UsersModel.find({'state': true});
    return response;
}


async function createUser(info)
{
    const user = new UsersModel(
        {
            email: info.email,
            name: info.name,
            password: info.password
        });
    
    return await user.save();
}

async function updateUser(email, info)
{
    let response = await findUserState(email);

    try
    {
        if(response)
        {
            await UsersModel.updateOne({"email": email}, {name: info.name, password: info.password});
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
    return await UsersModel.find({"email": email});
}

async function findUserState(email)
{
    let user = await UsersModel.findOne({"email": email});
    return user.state;
}

module.exports = route;