const express = require("express");
const path = require("path");
const parser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views")
app.use(express.static(__dirname + "/static"));
app.use(parser.urlencoded({ extended: true }));


app.get('/', function (req, res) {
  res.render("index", {page:"index"});
});


app.get("/login", (req, res) => {
  res.render("login", {page:"login"});
});

app.post("/auth", (req, res) => {
  console.log(req.body.username);
  console.log(req.body.password);
  res.redirect('/login');
});

app.listen(3000);
