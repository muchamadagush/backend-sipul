"use strict";
// this utils help you to get All Attributes from migrations file
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
var MockQueryInterface = /** @class */ (function () {
    function MockQueryInterface() {
        this.attributeTables = {};
    }
    MockQueryInterface.prototype.setAttribute = function (tableName, attributes) {
        this.attributeTables[tableName] = __assign(__assign({}, (this.attributeTables[tableName] || {})), (attributes || {}));
    };
    MockQueryInterface.prototype.deleteAttribute = function (tableName, attributeName) {
        var defTable = this.attributeTables[tableName];
        if (defTable) {
            delete defTable[attributeName];
        }
    };
    MockQueryInterface.prototype.getAttribute = function (tableName, attributeName) {
        var defTable = this.attributeTables[tableName];
        if (defTable) {
            return defTable[attributeName];
        }
        return null;
    };
    MockQueryInterface.prototype.createTable = function (tableName, attributes) {
        this.setAttribute(tableName, attributes);
    };
    MockQueryInterface.prototype.addColumn = function (table, key, attribute) {
        var _a;
        this.setAttribute(table, (_a = {},
            _a[key] = attribute,
            _a));
    };
    MockQueryInterface.prototype.changeColumn = function (tableName, attributeName, dataTypeOrOptions, options) {
        var _a;
        this.setAttribute(tableName, (_a = {},
            _a[attributeName] = dataTypeOrOptions,
            _a));
    };
    MockQueryInterface.prototype.removeColumn = function (tableName, attributeName) {
        this.deleteAttribute(tableName, attributeName);
    };
    MockQueryInterface.prototype.renameColumn = function (tableName, attrNameBefore, attrNameAfter, options) {
        var _a;
        var curAttribute = this.getAttribute(tableName, attrNameBefore);
        this.setAttribute(tableName, (_a = {},
            _a[attrNameAfter] = curAttribute,
            _a));
        this.deleteAttribute(tableName, attrNameBefore);
    };
    MockQueryInterface.prototype.renameTable = function (before, after, options) {
        this.attributeTables[after] = this.attributeTables[before];
        delete this.attributeTables[before];
    };
    MockQueryInterface.prototype.addConstraint = function () {
        return this;
    };
    MockQueryInterface.prototype.removeConstraint = function () {
        return this;
    };
    return MockQueryInterface;
}());
var fs = require('fs');
var path = require('path');
function read(sequelize, mockQueryInterface, curPath) {
    var basePath = path.resolve(curPath);
    var files = fs.readdirSync(basePath);
    files.forEach(function (file) {
        // eslint-disable-next-line global-require,import/no-dynamic-require
        var script = require([basePath, file].join('/'));
        script.up(mockQueryInterface, sequelize);
    });
}
module.exports = {
    MockQueryInterface: MockQueryInterface,
    read: read,
};
