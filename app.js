require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const errorHandler = require('./middleware/errorHandler');
const { combinedSwagger } = require('./swagger');

const app = express();

const indexRoute = require('./routes/index');

// Performance optimizations
app.use(compression());

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Increase the payload size for image upload
app.use(express.json({ limit: '40mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS setup
app.options('*', cors());
app.use(cors({ origin: '*' }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/identify', indexRoute);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(combinedSwagger));

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Global error handler
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Listening on port ${server.address().port} in ${process.env.NODE_ENV} mode`);
});

// Increase the default timeout if necessary
server.timeout = 240000;

module.exports = app;
