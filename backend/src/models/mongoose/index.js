const path = require('path');
const fs = require('fs');
const { mongoose } = require('../../config/mongo');

const db = {};

// Load all model files in this directory (except index.js)
fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== path.basename(__filename) && file.slice(-3) === '.js')
  .forEach(file => {
    const modelFactory = require(path.join(__dirname, file));
    const model = modelFactory(mongoose);
    db[model.modelName] = model;
  });

db.mongoose = mongoose;

module.exports = db;
