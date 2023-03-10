"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (schema, reqPart = "body") => {
    return (req, res, next) => {
        const validationResult = schema.validate(req[reqPart]);
        if (validationResult.error) {
            return res.status(400).send({ message: validationResult.error.message });
        }
        next();
    };
};
