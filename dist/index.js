"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var ExpressErrorSequelize_1 = __importDefault(require("./middlewares/ExpressErrorSequelize"));
var ExpressErrorResponse_1 = __importDefault(require("./middlewares/ExpressErrorResponse"));
var http_errors_1 = __importDefault(require("http-errors"));
var routes_1 = __importDefault(require("./routes"));
var helmet_1 = __importDefault(require("helmet"));
var body_parser_1 = __importDefault(require("body-parser"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var cors = require('cors');
var logger = require('morgan');
var winston_1 = __importStar(require("./config/winston"));
dotenv_1.default.config();
var app = (0, express_1.default)();
var port = process.env.PORT;
app.use((0, helmet_1.default)());
app.use(cors());
app.use(logger('combined', { stream: winston_1.winstonStream }));
app.use(body_parser_1.default.json({ limit: '100mb', type: 'application/json' }));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(routes_1.default);
app.use('/v1', ExpressErrorSequelize_1.default);
app.use('/v1', ExpressErrorResponse_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // add this line to include winston logging
    winston_1.default.error("".concat(err.status || 500, " - ").concat(err.message, " - ").concat(req.originalUrl, " - ").concat(req.method, " - ").concat(req.ip));
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
app.listen(port, function () {
    console.log("\u26A1\uFE0F[server]: Server is running at http://localhost:".concat(port));
});
