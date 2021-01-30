const express = require("express");
const router = express.Router();
const {Todo, schema, validate} = require("../models/todo");
const {User} = require("../models/user");
const auth = require("../middleware/auth");

router.get("/", [auth], async (req, res) => {
    const {todoList} = await User.findById(req.user._id).select("todoList");

    const todos = await Todo.find({_id: {$in: todoList}})
    res.send(todos);
})
router.post("/", [auth], async (req, res) => {
    const error = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).send(error.details[0].message);

    const todo = new Todo({
        description: req.body.description,
    })
    //transaction, TODO
    await todo.save();

    user.todoList.push(todo._id);

    await user.save();
    
    res.send(todo);
});

router.patch("/:id", [auth], async (req, res) => {
    const error = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {todoList} = await User.findById(req.user._id).select("todoList");
    if (!todoList.includes(req.params.id)) return res.status(404).send("No todo with given ID has been found!");

    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).send("No todo with given ID has been found!");

    todo.finished = req.body.finished;
    await todo.save();

    res.send(todo);
});
router.delete("/:id", [auth], async (req, res) => {
    const user = await User.findById(req.user._id).select("todoList");
    if (!user.todoList.includes(req.params.id)) return res.status(404).send("No todo with given ID has been found!");

    const todo = await Todo.findByIdAndRemove(req.params.id);
    if (!todo) return res.status(404).send("No todo with given ID has been found!");

    user.todoList = user.todoList.filter((t) => t !== req.params.id);

    await user.save();

    res.send(todo);
})

module.exports = router;