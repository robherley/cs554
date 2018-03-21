const express = require('express');
const morgan = require('morgan');
const app = express();

// Express >=4.16.0 has body-parser built in (again)
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use(require('./routes'));
app.use('*', (req, res) => {
  res
    .status(404)
    .json({ error: 'Route Not Found', code: 404, route: req.originalUrl });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server is running on port:', PORT));
