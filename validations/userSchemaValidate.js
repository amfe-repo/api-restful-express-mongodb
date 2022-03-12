const joi = require('joi');

const schema = joi.object({
    name: joi.string()
        .min(3)
        .max(40)
        .required(),

    password: joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,40}$')),

    email: joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})

module.exports = schema;