const express = require('express');
const path = require('path');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.render('layout');
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('🚀  Server running on Port:', port));
