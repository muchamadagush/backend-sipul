"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var type_1 = __importDefault(require("./type"));
var scale_1 = __importDefault(require("./scale"));
var product_1 = __importDefault(require("./product"));
var weightscale_1 = __importDefault(require("./weightscale"));
var models = {
    Type: type_1.default,
    Scale: scale_1.default,
    Product: product_1.default,
    WeightScale: weightscale_1.default,
};
exports.default = models;
Object.entries(models).map(function (_a) {
    var model = _a[1];
    if (model.associate) {
        model.associate(models);
    }
    return model;
});
