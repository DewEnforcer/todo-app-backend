const Joi = require("joi");

module.exports = function(data) {
    const schema = Joi.object({
        description: Joi.string().min(3).required(),
        finished: Joi.boolean().required()
    })

    const {error} = schema.validate(data);
    return error
}