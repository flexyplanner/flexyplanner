"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (cb) => (req, res, next) => {
    return cb(req, res, next).catch((err) => next(err));
};
