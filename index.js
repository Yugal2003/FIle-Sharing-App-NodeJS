const express = require("express");
const mongoose = require("mongoose");

const fileRouters = require("./routes/file");

const app = express();

mongoose.connect(process.env.DATABASE_URL).
then(() => console.log("Connect With MongoDB is Success")).
catch(() => console.log("MongoDB Connect To Failed"));

app.use(express.urlencoded());

app.use(fileRouters);

app.listen(5050, () => {
    console.log("Server running on 5050");
})