const mongoose = require("mongoose");

module.exports = function () {
    mongoose.connect("mongodb://localhost/todo_app", {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log("Connected to db..")).catch(() => console.log("Failed connecting to db..."));
}