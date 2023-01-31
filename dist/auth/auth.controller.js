"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshTokens = exports.authorize = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../REST-entities/user/user.model"));
const session_model_1 = __importDefault(require("../REST-entities/session/session.model"));
const summary_model_1 = __importDefault(require("../REST-entities/summary/summary.model"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, username } = req.body;
    const existingUser = yield user_model_1.default.findOne({ email });
    if (existingUser) {
        return res
            .status(409)
            .send({ message: `User with ${email} email already exists` });
    }
    const passwordHash = yield bcryptjs_1.default.hash(password, Number(process.env.HASH_POWER));
    const newMom = yield user_model_1.default.create({
        username,
        email,
        passwordHash,
    });
    return res.status(201).send({
        email,
        username,
        id: newMom._id,
    });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        return res
            .status(403)
            .send({ message: `User with ${email} email doesn't exist` });
    }
    const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user.passwordHash);
    if (!isPasswordCorrect) {
        return res.status(403).send({ message: "Password is wrong" });
    }
    const newSession = yield session_model_1.default.create({
        uid: user._id,
    });
    const accessToken = jsonwebtoken_1.default.sign({ uid: user._id, sid: newSession._id }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME,
    });
    const refreshToken = jsonwebtoken_1.default.sign({ uid: user._id, sid: newSession._id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME,
    });
    const date = new Date();
    const today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const todaySummary = yield summary_model_1.default.findOne({ date: today });
    if (!todaySummary) {
        return res.status(200).send({
            accessToken,
            refreshToken,
            sid: newSession._id,
            todaySummary: {},
            user: {
                email: user.email,
                username: user.username,
                userData: user.userData,
                id: user._id,
            },
        });
    }
    return res.status(200).send({
        accessToken,
        refreshToken,
        sid: newSession._id,
        todaySummary: {
            date: todaySummary.date,
            kcalLeft: todaySummary.kcalLeft,
            kcalConsumed: todaySummary.kcalConsumed,
            dailyRate: todaySummary.dailyRate,
            percentsOfDailyRate: todaySummary.percentsOfDailyRate,
            userId: todaySummary.userId,
            id: todaySummary._id,
        },
        user: {
            email: user.email,
            username: user.username,
            userData: user.userData,
            id: user._id,
        },
    });
});
exports.login = login;
const authorize = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authorizationHeader = req.get("Authorization");
    if (authorizationHeader) {
        const accessToken = authorizationHeader.replace("Bearer ", "");
        console.log(accessToken);
        console.log(process.env.JWT_ACCESS_SECRET);
        let payload;
        try {
            payload = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_ACCESS_SECRET);
            console.log(payload);
        }
        catch (err) {
            return res.status(401).send({ message: "Unauthorized", err: err });
        }
        const user = yield user_model_1.default.findById(payload.uid);
        const session = yield session_model_1.default.findById(payload.sid);
        if (!user) {
            return res.status(404).send({ message: "Invalid user" });
        }
        if (!session) {
            return res.status(404).send({ message: "Invalid session" });
        }
        req.user = user;
        req.session = session;
        next();
    }
    else
        return res.status(400).send({ message: "No token provided" });
});
exports.authorize = authorize;
const refreshTokens = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authorizationHeader = req.get("Authorization");
    if (authorizationHeader) {
        const activeSession = yield session_model_1.default.findById(req.body.sid);
        if (!activeSession) {
            return res.status(404).send({ message: "Invalid session" });
        }
        const reqRefreshToken = authorizationHeader.replace("Bearer ", "");
        let payload;
        try {
            payload = jsonwebtoken_1.default.verify(reqRefreshToken, process.env.JWT_REFRESH_SECRET);
        }
        catch (err) {
            yield session_model_1.default.findByIdAndDelete(req.body.sid);
            return res.status(401).send({ message: "Unauthorized" });
        }
        const user = yield user_model_1.default.findById(payload.uid);
        const session = yield session_model_1.default.findById(payload.sid);
        if (!user) {
            return res.status(404).send({ message: "Invalid user" });
        }
        if (!session) {
            return res.status(404).send({ message: "Invalid session" });
        }
        yield session_model_1.default.findByIdAndDelete(payload.sid);
        const newSession = yield session_model_1.default.create({
            uid: user._id,
        });
        const newAccessToken = jsonwebtoken_1.default.sign({ uid: user._id, sid: newSession._id }, process.env.JWT_ACCESS_SECRET, {
            expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME,
        });
        const newRefreshToken = jsonwebtoken_1.default.sign({ uid: user._id, sid: newSession._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME });
        return res
            .status(200)
            .send({ newAccessToken, newRefreshToken, sid: newSession._id });
    }
    return res.status(400).send({ message: "No token provided" });
});
exports.refreshTokens = refreshTokens;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentSession = req.session;
    console.log(currentSession);
    yield session_model_1.default.deleteOne({ _id: currentSession._id });
    return res.status(204).end();
});
exports.logout = logout;
