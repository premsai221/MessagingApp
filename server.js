const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const parser = require("body-parser");
const mainRouter = require("./routes/index");
const {chatRouter, io} = require("./routes/chat");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/usersDB", {useNewUrlParser: true}, () => {
    console.log("Connected to DB");
});

const app = express();


app.set("view engine", "ejs");
app.set("views", __dirname + "/views")
app.use(express.static(__dirname + "/static"));
app.use(parser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(mainRouter);
app.use("/chat", chatRouter);

io.listen(5999);
app.listen(3000);