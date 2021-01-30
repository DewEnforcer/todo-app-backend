const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const {User} = require("../models/user");
const router = express.Router();

router.post("/", async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({username: req.body.username});
    if (!user) return res.status(404).send("User with given username/password not found!");

    const validPwd = await bcrypt.compare(req.body.password, user.password);
    if (!validPwd) return res.status(404).send("User with given username/password not found!");

    const token = user.generateToken();
    res.send(token);
});

function validate(req) {
    const schema = Joi.object({
      username: Joi.string().min(5).max(255).required(),
      password: Joi.string().min(5).max(255).required()
    });
  
    return schema.validate(req);
  }

module.exports = router;