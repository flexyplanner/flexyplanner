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
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const server_1 = __importDefault(require("../server/server"));
const user_model_1 = __importDefault(require("../REST-entities/user/user.model"));
const session_model_1 = __importDefault(require("../REST-entities/session/session.model"));
describe("Auth router test suite", () => {
    let app;
    let accessToken;
    let refreshToken;
    let sid;
    let createdUser;
    let createdSession;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        app = new server_1.default().startForTesting();
        const url = `mongodb://127.0.0.1/auth`;
        yield mongoose_1.default.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield user_model_1.default.deleteOne({ email: "test@email.com" });
        yield mongoose_1.default.connection.close();
    }));
    describe("POST /auth/register", () => {
        let response;
        const validReqBody = {
            username: "Test",
            email: "test@email.com",
            password: "qwerty123",
        };
        const invalidReqBody = {
            email: "test@email.com",
            password: "qwerty123",
        };
        it("Init endpoint testing", () => {
            expect(true).toBe(true);
        });
        context("With validReqBody", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .post("/auth/register")
                    .send(validReqBody);
                createdUser = yield user_model_1.default.findById(response.body.id).lean();
            }));
            it("Should return a 201 status code", () => {
                expect(response.status).toBe(201);
            });
            it("Should return an expected result", () => {
                expect(response.body).toEqual({
                    email: validReqBody.email,
                    username: validReqBody.username,
                    id: createdUser._id.toString(),
                });
            });
            it("Should create a new user", () => {
                expect(createdUser).toBeTruthy();
            });
        });
        context("With same email", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .post("/auth/register")
                    .send(validReqBody);
            }));
            it("Should return a 409 status code", () => {
                expect(response.status).toBe(409);
            });
            it("Should say if email is already in use", () => {
                expect(response.body.message).toBe(`User with ${createdUser.email} email already exists`);
            });
        });
        context("With invalidReqBody (no 'username' provided)", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .post("/auth/register")
                    .send(invalidReqBody);
            }));
            it("Should return a 400 status code", () => {
                expect(response.status).toBe(400);
            });
            it("Should say that 'username' is required", () => {
                expect(response.body.message).toBe('"username" is required');
            });
        });
    });
    describe("POST /auth/login", () => {
        let response;
        const validReqBody = {
            email: "test@email.com",
            password: "qwerty123",
        };
        const invalidReqBody = {
            email: "test@email.com",
        };
        const secondInvalidReqBody = {
            email: "test@email.com",
            password: "qwerty12",
        };
        const thirdInvalidReqBody = {
            email: "tes@email.com",
            password: "qwerty123",
        };
        it("Init endpoint testing", () => {
            expect(true).toBe(true);
        });
        context("With validReqBody", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app).post("/auth/login").send(validReqBody);
                createdSession = yield session_model_1.default.findById(response.body.sid);
                accessToken = response.body.accessToken;
                refreshToken = response.body.refreshToken;
                sid = createdSession._id.toString();
            }));
            it("Should return a 200 status code", () => {
                expect(response.status).toBe(200);
            });
            it("Should return an expected result", () => {
                expect(response.body).toEqual({
                    accessToken,
                    refreshToken,
                    sid,
                    todaySummary: {},
                    user: {
                        email: validReqBody.email,
                        username: "Test",
                        userData: createdUser.userData,
                        id: createdUser._id.toString(),
                    },
                });
            });
            it("Should create valid 'accessToken'", () => {
                expect(jsonwebtoken_1.default.verify(response.body.accessToken, process.env.JWT_ACCESS_SECRET)).toBeTruthy();
            });
            it("Should create valid 'refreshToken'", () => {
                expect(jsonwebtoken_1.default.verify(response.body.refreshToken, process.env.JWT_REFRESH_SECRET)).toBeTruthy();
            });
            it("Should create a new session", () => {
                expect(createdSession).toBeTruthy();
            });
        });
        context("With invalidReqBody (no 'password' provided)", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .post("/auth/login")
                    .send(invalidReqBody);
            }));
            it("Should return a 400 status code", () => {
                expect(response.status).toBe(400);
            });
            it("Should say that 'password' is required", () => {
                expect(response.body.message).toBe('"password" is required');
            });
        });
        context("With secondInvalidReqBody (wrong password)", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .post("/auth/login")
                    .send(secondInvalidReqBody);
            }));
            it("Should return a 403 status code", () => {
                expect(response.status).toBe(403);
            });
            it("Should say that password is wrong", () => {
                expect(response.body.message).toBe("Password is wrong");
            });
        });
        context("With thirdInvalidReqBody (wrong password)", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .post("/auth/login")
                    .send(thirdInvalidReqBody);
            }));
            it("Should return a 403 status code", () => {
                expect(response.status).toBe(403);
            });
            it("Should say that email doesn't exist", () => {
                expect(response.body.message).toBe(`User with ${thirdInvalidReqBody.email} email doesn't exist`);
            });
        });
    });
    describe("POST /auth/refresh", () => {
        let response;
        let newSession;
        const validReqBody = {
            sid,
        };
        const invalidReqBody = {
            sid: {},
        };
        const secondInvalidReqBody = {
            sid: "qwerty123",
        };
        it("Init endpoint testing", () => {
            expect(true).toBe(true);
        });
        context("With invalidReqBody (invalid 'sid' type)", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .post("/auth/refresh")
                    .set("Authorization", `Bearer ${refreshToken}`)
                    .send(invalidReqBody);
            }));
            it("Should return a 400 status code", () => {
                expect(response.status).toBe(400);
            });
            it("Should say that 'sid' is required", () => {
                expect(response.body.message).toBe('"sid" must be a string');
            });
        });
        context("Without providing 'refreshToken'", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                validReqBody.sid = sid;
                response = yield (0, supertest_1.default)(app)
                    .post("/auth/refresh")
                    .send(validReqBody);
            }));
            it("Should return a 400 status code", () => {
                expect(response.status).toBe(400);
            });
            it("Should say that token wasn't provided", () => {
                expect(response.body.message).toBe("No token provided");
            });
        });
        context("With invalid refreshToken", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                validReqBody.sid = sid;
                response = yield (0, supertest_1.default)(app)
                    .post("/auth/refresh")
                    .set("Authorization", `Bearer qwerty123`)
                    .send(validReqBody);
                createdSession = yield session_model_1.default.findById(sid);
            }));
            afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .post("/auth/login")
                    .send({ email: "test@email.com", password: "qwerty123" });
                refreshToken = response.body.refreshToken;
                sid = response.body.sid;
            }));
            it("Should return a 401 status code", () => {
                expect(response.status).toBe(401);
            });
            it("Should an unauthorized status", () => {
                expect(response.body.message).toBe("Unauthorized");
            });
            it("Should delete session", () => {
                expect(createdSession).toBeFalsy();
            });
        });
        context("With secondInvalidReqBody (invalid 'sid')", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .post("/auth/refresh")
                    .set("Authorization", `Bearer ${refreshToken}`)
                    .send(secondInvalidReqBody);
            }));
            it("Should return a 400 status code", () => {
                expect(response.status).toBe(400);
            });
            it("Should say that 'sid' is invalid", () => {
                expect(response.body.message).toBe("Invalid 'sid'. Must be MongoDB ObjectId");
            });
        });
        context("With validReqBody", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                validReqBody.sid = sid;
                response = yield (0, supertest_1.default)(app)
                    .post("/auth/refresh")
                    .set("Authorization", `Bearer ${refreshToken}`)
                    .send(validReqBody);
                newSession = yield session_model_1.default.findById(response.body.sid);
                accessToken = response.body.newAccessToken;
            }));
            it("Should return a 200 status code", () => {
                expect(response.status).toBe(200);
            });
            it("Should return an expected result", () => {
                expect(response.body).toEqual({
                    newAccessToken: response.body.newAccessToken,
                    newRefreshToken: response.body.newRefreshToken,
                    sid: newSession._id.toString(),
                });
            });
            it("Should create valid 'accessToken'", () => {
                expect(jsonwebtoken_1.default.verify(response.body.newAccessToken, process.env.JWT_ACCESS_SECRET)).toBeTruthy();
            });
            it("Should create valid 'refreshToken'", () => {
                expect(jsonwebtoken_1.default.verify(response.body.newRefreshToken, process.env.JWT_REFRESH_SECRET)).toBeTruthy();
            });
            it("Should delete old session from DB", () => {
                expect(createdSession).toBeFalsy();
            });
            it("Should create new session in DB", () => {
                expect(newSession).toBeTruthy();
            });
        });
    });
    describe("POST /auth/logout", () => {
        let response;
        it("Init endpoint testing", () => {
            expect(true).toBe(true);
        });
        context("Valid request", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .post("/auth/logout")
                    .set("Authorization", `Bearer ${accessToken}`);
            }));
            it("Should return a 204 status code", () => {
                expect(response.status).toBe(204);
            });
        });
        context("Without providing 'accessToken'", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app).post("/auth/logout");
            }));
            it("Should return a 400 status code", () => {
                expect(response.status).toBe(400);
            });
            it("Should say that token wasn't provided", () => {
                expect(response.body.message).toBe("No token provided");
            });
        });
        context("With invalid 'accessToken'", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .post("/auth/logout")
                    .set("Authorization", `Bearer qwerty123`);
            }));
            it("Should return a 401 status code", () => {
                expect(response.status).toBe(401);
            });
            it("Should return an unauthorized status", () => {
                expect(response.body.message).toBe("Unauthorized");
            });
        });
    });
});
