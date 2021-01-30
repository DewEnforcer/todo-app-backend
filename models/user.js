const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const schema = new mongoose.Schema({
    username: {type: String, required: true, min: 3, max: 30},
    password: {type: String, required: true, min: 20, max: 1024},
    email: {type: String, required: true, min: 5, max: 50},
    todoList: [mongoose.Types.ObjectId],
})

schema.methods.generateToken = function () {
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email,
    }, config.get("jwtPrivateKey")) //TODO REPLACE WITH ENV VAR
}

const User = mongoose.model("users", schema);

const validate = function (body) {
    const schema = Joi.object({
        username: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().min(5).max(50).required(),
        password: Joi.string().min(5).max(256).required()
    })
    const {error} = schema.validate(body);
    return error;
}

exports.User = User;
exports.schema = schema;
exports.validate = validate;