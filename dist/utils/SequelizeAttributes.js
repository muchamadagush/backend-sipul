"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize = require('sequelize');
var _a = require('./ReaderMigrationSequelize'), MockQueryInterface = _a.MockQueryInterface, read = _a.read;
var newMockQueryInterface = new MockQueryInterface();
read(sequelize, newMockQueryInterface, 'src/migrations');
var SequelizeAttributes = newMockQueryInterface.attributeTables;
exports.default = SequelizeAttributes;
