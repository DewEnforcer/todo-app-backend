const mongoose = require("mongoose");
const Joi = require("joi");

const schema = new mongoose.Schema({
    description: {type: String, required: true, min: 3},
    finished: {type: Boolean, required: true, default: false}
})

const Todo = mongoose.model("todos", schema);

const validate = function (body) {
    const schema = Joi.object({
        description: Joi.string().min(3).required(),
        finished: Joi.boolean().required()
    })
    const {error} = schema.validate(body,{
        allowUnknown: true
      });
    return error;
}

exports.Todo = Todo;
exports.schema = schema;
exports.validate = validate;