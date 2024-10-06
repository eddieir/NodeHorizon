const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const expressWinston = require('express-winston');
const winston = require('winston');
const bodyParser = require('body-parser');
const { logError, logInfo } = require('./logger');
dotenv.config();

const app = express();
// Log all incoming requests
app.use(expressWinston.logger({
    winstonInstance: logInfo,
    msg: "HTTP {{req.method}} {{req.url}}",
    meta: true,  // Include request and response meta data
    expressFormat: true,  // Use the default Express/morgan format
    colorize: false,
    transports: [
        new winston.transports.File({ filename: 'logs/combined.log' }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
      ],
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
}));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes); 

// Error handling middleware
app.use((err, req, res, next) => {
    logError(`Error in ${req.method} ${req.url}`, {
        errorMessage: err.message,
        stack: err.stack,
        requestBody: req.body,
        queryParams: req.query,
        user: req.user ? req.user._id : 'Unauthenticated',
    });
    res.status(500).json({ message: 'Internal Server Error' });
});

app.use(expressWinston.errorLogger({
    transports: [
      new winston.transports.File({ filename: 'logs/error.log' })
    ],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  }));
app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
