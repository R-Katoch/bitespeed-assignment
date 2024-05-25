const deepmerge = require('deepmerge');
const swagger = require('./docs/swagger.json');

// Base Swagger document structure
const baseSwagger = {
  openapi: '3.0.0',
  info: {
    title: 'Bitespeed Backend Task: Identity Reconciliation',
    version: '1.0.0',
    description: 'API Documentation for Bitespeed Backend Task: Identity Reconciliation',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local Server',
    },
    {
      url: 'https://bitespeed-assignment-f8i0.onrender.com',
      description: 'Production Server',
    },
  ],
};

const combinedSwagger = deepmerge.all([
  baseSwagger,
  swagger,
]);

module.exports = {
  combinedSwagger,
};
