const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const router = express.Router();
const {User, validate} = require("../models/user");

router.get("/", async (req, res) =>{
    const users = await User.find();
    res.send(users);
})

router.get("/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User not found");

    const userCopy = {...user};
    delete userCopy.password;

    res.send(user);
});

router.post("/", async (req, res) => {
    const error = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(req.body.password, salt);

    const user = new User(_.pick(req.body, ["username", "email", "password"]));

    const resQuery = await User.findOne().or({email: req.body.email}, {username: req.body.username});
    if (resQuery) return res.status(400).send("This email/username is already in use!");
    
    user.password = hashedPwd;
    await user.save();
    
    res
    .header("x-auth-token", user.generateToken())
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["username", "email", "_id"]));
})

module.exports = router;