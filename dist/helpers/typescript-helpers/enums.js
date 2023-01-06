"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReqBodyParts = exports.BloodType = void 0;
var BloodType;
(function (BloodType) {
    BloodType[BloodType["ONE"] = 1] = "ONE";
    BloodType[BloodType["TWO"] = 2] = "TWO";
    BloodType[BloodType["THREE"] = 3] = "THREE";
    BloodType[BloodType["FOUR"] = 4] = "FOUR";
})(BloodType = exports.BloodType || (exports.BloodType = {}));
var ReqBodyParts;
(function (ReqBodyParts) {
    ReqBodyParts["BODY"] = "body";
    ReqBodyParts["PARAMS"] = "params";
    ReqBodyParts["QUERY"] = "query";
})(ReqBodyParts = exports.ReqBodyParts || (exports.ReqBodyParts = {}));
