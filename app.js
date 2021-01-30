const express = require("express");
const app = express();

require("./startup/db")();
require("./startup/cors")(app);
require("./startup/routes")(app);

app.listen(3001, () => {
    console.log("Listening on port 3001...");
})