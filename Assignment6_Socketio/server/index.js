const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();

app.use(morgan('dev'));

// Just serve static files
const static = path.join(__dirname + '/client/');
app.use(express.static(static));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server is running on port:', PORT));
