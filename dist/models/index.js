"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var file_1 = __importDefault(require("./file"));
var user_1 = __importDefault(require("./user"));
var category_1 = __importDefault(require("./category"));
var models = {
    File: file_1.default,
    User: user_1.default,
    Category: category_1.default,
};
exports.default = models;
Object.entries(models).map(function (_a) {
    var model = _a[1];
    if (model.associate) {
        model.associate(models);
    }
    return model;
});
