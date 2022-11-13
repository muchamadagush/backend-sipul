"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = __importDefault(require("sequelize"));
var path_1 = __importDefault(require("path"));
var env = process.env.NODE_ENV || 'development';
var config = require(path_1.default.join("".concat(__dirname, "/../config/database")))[env];
var sequelize = new sequelize_1.default.Sequelize(config.database, config.username, config.password, __assign(__assign({}, config), { logQueryParameters: true, pool: {
        max: 100,
        min: 0,
        acquire: 60000,
        idle: 10000,
    } }));
var db = {
    sequelize: sequelize,
    Sequelize: sequelize_1.default,
};
exports.default = db;
