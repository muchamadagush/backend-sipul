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
var SequelizeAttributes_1 = __importDefault(require("../utils/SequelizeAttributes"));
var _instance_1 = __importDefault(require("./_instance"));
var Project = _instance_1.default.sequelize.define('Projects', __assign({}, SequelizeAttributes_1.default.Projects), { paranoid: true });
// Project.associate = (models) => {
//   //
// }
exports.default = Project;
