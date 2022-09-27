const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(__dirname + "/static"));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'static/main.html'));
  });


app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, 'static/login.html'));
})

app.listen(3000);
