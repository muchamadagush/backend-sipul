"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var project_1 = __importDefault(require("./project"));
var models = {
    Project: project_1.default,
};
exports.default = models;
// Object.entries(models).map(([, model]) => {
//   if (model.associate) {
//     model.associate(models)
//   }
//   return model
// })
