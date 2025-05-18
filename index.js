const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const session = require('express-session');
const indexRoutes = require('./routes/index.js');

const app = express();
const port = 8080;

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'resources')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'teste-1234',
    resave: false,
    saveUninitialized: true
  }));




    
app.use('/', indexRoutes);
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });