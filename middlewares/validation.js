const Joi = require('joi');

const validateUser = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        // Add other fields as needed
    });

    return schema.validate(data);
};

module.exports = { validateUser };
