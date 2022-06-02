const express = require('express');
const app = express();
const morgan = require('morgan');
require('dotenv').config();


if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    console.log('Logger ishlayapti...')
}

