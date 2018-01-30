const express = require('express');
const path = require('path');
const morgan = require('morgan');
const data = require('./src/data.json');
const app = express();

// Logger
app.use(morgan('dev'));

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Static Assets
app.use(express.static(path.join(__dirname, 'public')));

// Main Page
app.get('/', (req, res) => {
  res.render('portfolio', { showcase: data });
});

// 404
app.get('*', (req, res) => {
  res.status(404).render('fourohfour', { url: req.url });
});

// Run server
const port = process.env.PORT || 8080;
app.listen(port, () => console.log('🚀  Server running on Port:', port));
