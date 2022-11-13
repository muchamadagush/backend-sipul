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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.migrate = function (tableName, newColumns) {
    return {
        up: function (queryInterface, Sequelize) {
            var columns = newColumns(Sequelize);
            return Promise.all(columns.map(function (item) {
                return queryInterface.addColumn(tableName, item.key, {
                    type: item.type,
                });
            }));
        },
        down: function (queryInterface, Sequelize) {
            var columns = newColumns(Sequelize);
            return Promise.all(columns.map(function (item) { return queryInterface.removeColumn(tableName, item.key); }));
        },
    };
};
exports.rename = function (tableName, newColumns) {
    return {
        up: function (queryInterface, Sequelize) {
            var columns = newColumns(Sequelize);
            return Promise.all(columns.map(function (item) {
                return queryInterface.renameColumn(tableName, item.nameBefore, item.nameAfter);
            }));
        },
        down: function (queryInterface, Sequelize) {
            var columns = newColumns(Sequelize);
            return Promise.all(columns.map(function (item) {
                return queryInterface.renameColumn(tableName, item.nameAfter, item.nameBefore);
            }));
        },
    };
};
exports.addColumns = function (tableName, newColumns) {
    return {
        up: function (queryInterface, Sequelize) {
            var columns = newColumns(Sequelize);
            return Promise.all(columns.map(function (item) {
                var key = item.key, type = item.type, options = __rest(item, ["key", "type"]);
                return queryInterface.addColumn(tableName, key, __assign({ type: type }, options));
            }));
        },
        down: function (queryInterface, Sequelize) {
            var columns = newColumns(Sequelize);
            return Promise.all(columns.map(function (item) { return queryInterface.removeColumn(tableName, item.key); }));
        },
    };
};
exports.removeColumns = function (tableName, cols) {
    return {
        up: function (queryInterface, Sequelize) {
            var columns = cols(Sequelize);
            return Promise.all(columns.map(function (item) { return queryInterface.removeColumn(tableName, item.key); }));
        },
        down: function (queryInterface, Sequelize) {
            var columns = cols(Sequelize);
            return Promise.all(columns.map(function (item) {
                var key = item.key, type = item.type, options = __rest(item, ["key", "type"]);
                return queryInterface.addColumn(tableName, key, __assign({ type: type }, options));
            }));
        },
    };
};
exports.changeColumns = function (tableName, changeColumns) {
    return {
        up: function (queryInterface, Sequelize) {
            var columns = changeColumns(Sequelize);
            return Promise.all(columns.map(function (item) {
                var key = item.key, dataTypeOrOptions = __rest(item, ["key"]);
                return queryInterface.changeColumn(tableName, key, __assign({}, dataTypeOrOptions), null);
            }));
        },
        down: function (queryInterface, Sequelize) {
            return true;
        },
    };
};
exports.renameColumns = function (tableName, newColumns) {
    return {
        up: function (queryInterface, Sequelize) {
            var columns = newColumns(Sequelize);
            return Promise.all(columns.map(function (item) {
                return queryInterface.renameColumn(tableName, item.nameBefore, item.nameAfter);
            }));
        },
        down: function (queryInterface, Sequelize) {
            var columns = newColumns(Sequelize);
            return Promise.all(columns.map(function (item) {
                return queryInterface.renameColumn(tableName, item.nameAfter, item.nameBefore);
            }));
        },
    };
};
exports.renameTables = function (changeTables) {
    return {
        up: function (queryInterface, Sequelize) {
            var columns = changeTables(Sequelize);
            return Promise.all(columns.map(function (item) {
                return queryInterface.renameTable(item.nameBefore, item.nameAfter);
            }));
        },
        down: function (queryInterface, Sequelize) {
            var columns = changeTables(Sequelize);
            return Promise.all(columns.map(function (item) {
                return queryInterface.renameTable(item.nameAfter, item.nameBefore);
            }));
        },
    };
};
var getDefaultNameColumns = function (obj) {
    var entries = Object.entries(obj);
    return entries.map(function (x) { return x[0]; });
};
exports.createTable = function (tableName, newColumns) {
    return {
        up: function (queryInterface, Sequelize) {
            var columns = newColumns(Sequelize);
            var defaultColumn = {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
            };
            var defNameColumns = getDefaultNameColumns(defaultColumn);
            for (var i = 0; i < defNameColumns.length; i += 1) {
                var name_1 = defNameColumns[i];
                if (columns[name_1]) {
                    defaultColumn[name_1] = columns[name_1];
                    delete columns[name_1];
                }
            }
            return queryInterface.createTable(tableName, __assign(__assign({}, defaultColumn), columns));
        },
        down: function (queryInterface, Sequelize) {
            return queryInterface.dropTable(tableName);
        },
    };
};
