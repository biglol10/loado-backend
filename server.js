const express = require('express');
const dotenv = require('dotenv');
// const logger = require('./middleware/logger')
const morgan = require('morgan');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
var path = require('path');

const axios = require('axios');
const cron = require('node-cron');

// middleware
const errorHandler = require('./middleware/error');

// LOAD env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
const homeworks = require('./routes/homeworks');
const usersRoute = require('./routes/users');
const adminFeatures = require('./routes/adminFeatures');
const userConfigure = require('./routes/userConfigure');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Enable CORS
app.use(cors());

// Dev logging middleware (like in logger)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // in console.log GET /api/v1/bootcamps?page=2&limit=2 200 648.149 ms - 3377
}

app.use('/loado/api/homeworks', homeworks);
app.use('/loado/api/users', usersRoute);
app.use('/loado/api/adminFeatures', adminFeatures);
app.use('/loado/api/userConfigure', userConfigure);

// this should be below the routes or it will cause error
app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// this should be below controller to use
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

cron.schedule('0 21 1-31 * *', () => {
  if (process.env.BACKEND_URL.indexOf('localhost') > 0) return;
  axios
    .get(
      process.env.BACKEND_URL +
        `/loado/api/homeworks/loadoupdatework?key=${process.env.UPDATE_KEY}`
    )
    .then((response) =>
      console.log('biglolbiglol, whole update success ', new Date())
    )
    .catch((err) => console.log('update failed', err, new Date()));
});

// cron.schedule('* * * * *', () => {
//   axios
//     .get(process.env.BACKEND_URL + '/loado/api/homeworks/crontest')
//     .then((response) => console.log('biglolbiglol ', response.data))
//     .catch((err) => console.log(err));
// });

module.exports = app;
