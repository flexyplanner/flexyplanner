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
const server_1 = __importDefault(require("../server/server"));
const user_model_1 = __importDefault(require("../REST-entities/user/user.model"));
const session_model_1 = __importDefault(require("../REST-entities/session/session.model"));
const enums_1 = require("../helpers/typescript-helpers/enums");
describe("Daily-rate router test suite", () => {
    let app;
    let response;
    let secondResponse;
    let accessToken;
    let createdUser;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        app = new server_1.default().startForTesting();
        const url = `mongodb://127.0.0.1/daily-rate`;
        yield mongoose_1.default.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        response = yield (0, supertest_1.default)(app).post("/auth/register").send({
            email: "test@email.com",
            password: "qwerty123",
            username: "Test",
        });
        createdUser = yield user_model_1.default.findById(response.body.id);
        secondResponse = yield (0, supertest_1.default)(app)
            .post("/auth/login")
            .send({ email: "test@email.com", password: "qwerty123" });
        accessToken = secondResponse.body.accessToken;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield user_model_1.default.deleteOne({ email: response.body.email });
        yield session_model_1.default.deleteOne({ _id: secondResponse.body.sid });
        yield mongoose_1.default.connection.close();
    }));
    describe("POST /daily-rate", () => {
        let response;
        const validReqBody = {
            weight: 90,
            height: 180,
            age: 30,
            desiredWeight: 80,
            bloodType: enums_1.BloodType.TWO,
        };
        const dailyRate = 10 * 90 + 6.25 * 180 - 5 * 30 - 161 - 10 * (90 - 80);
        const invalidReqBody = {
            weight: 90,
            height: 180,
            age: 30,
            desiredWeight: 80,
        };
        const secondInvalidReqBody = {
            weight: -10,
            height: 180,
            age: 30,
            desiredWeight: 80,
            bloodType: enums_1.BloodType.TWO,
        };
        context("With validReqBody", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app).post("/daily-rate").send(validReqBody);
            }));
            it("Should return a 200 status code", () => {
                expect(response.status).toBe(200);
            });
            it("Should return an expected result", () => {
                expect(response.body).toEqual({
                    dailyRate,
                    notAllowedProducts: response.body.notAllowedProducts,
                });
            });
            it("Should return a list of not allowed products", () => {
                expect(response.body.notAllowedProducts).toBeTruthy();
            });
            it("Should return a right list of not allowed products", () => {
                expect(response.body.notAllowedProducts.find((product) => product.groupBloodNotAllowed[validReqBody.bloodType] === true)).toBeFalsy();
            });
        });
        context("With invalidReqBody (no 'bloodType' provided)", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .post("/daily-rate")
                    .send(invalidReqBody);
            }));
            it("Should return a 400 status code", () => {
                expect(response.status).toBe(400);
            });
            it("Should say that 'bloodType' is required", () => {
                expect(response.body.message).toBe('"bloodType" is required');
            });
        });
        context("With secondInvalidReqBody ('weight' is less than 0)", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .post("/daily-rate")
                    .send(secondInvalidReqBody);
            }));
            it("Should return a 400 status code", () => {
                expect(response.status).toBe(400);
            });
            it("Should say that 'weight' must be greater than or equal to 20", () => {
                expect(response.body.message).toBe('"weight" must be greater than or equal to 20');
            });
        });
    });
    describe("POST /daily-rate/:userId", () => {
        let response;
        const validReqBody = {
            weight: 90,
            height: 180,
            age: 30,
            desiredWeight: 80,
            bloodType: enums_1.BloodType.TWO,
        };
        const dailyRate = 10 * 90 + 6.25 * 180 - 5 * 30 - 161 - 10 * (90 - 80);
        const invalidReqBody = {
            weight: 90,
            height: 180,
            age: 30,
            desiredWeight: 80,
        };
        const secondInvalidReqBody = {
            weight: -10,
            height: 180,
            age: 30,
            desiredWeight: 80,
            bloodType: enums_1.BloodType.TWO,
        };
        context("With validReqBody", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .post(`/daily-rate/${createdUser._id}`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(validReqBody);
            }));
            it("Should return a 201 status code", () => {
                expect(response.status).toBe(201);
            });
            it("Should return an expected result", () => {
                expect(response.body).toEqual({
                    dailyRate,
                    summaries: [],
                    id: createdUser._id.toString(),
                    notAllowedProducts: response.body.notAllowedProducts,
                });
            });
            it("Should return a list of not allowed products", () => {
                expect(response.body.notAllowedProducts).toBeTruthy();
            });
        });
        context("With invalidReqBody ('bloodType' not provided)", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .post(`/daily-rate/${createdUser._id}`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(invalidReqBody);
            }));
            it("Should return a 400 status code", () => {
                expect(response.status).toBe(400);
            });
            it("Should say that 'bloodType' is required", () => {
                expect(response.body.message).toBe('"bloodType" is required');
            });
        });
        context("With secondInvalidReqBody ('weight' is less than 0)", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .post(`/daily-rate/${createdUser._id}`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(secondInvalidReqBody);
            }));
            it("Should return a 400 status code", () => {
                expect(response.status).toBe(400);
            });
            it("Should say that 'weight' must be greater than or equal to 20", () => {
                expect(response.body.message).toBe('"weight" must be greater than or equal to 20');
            });
        });
        context("Without providing 'accessToken'", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .post(`/daily-rate/${createdUser._id}`)
                    .send(secondInvalidReqBody);
            }));
            it("Should return a 400 status code", () => {
                expect(response.status).toBe(400);
            });
            it("Should say that token wasn't provided", () => {
                expect(response.body.message).toBe("No token provided");
            });
        });
        context("Without invalid 'accessToken'", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .post(`/daily-rate/${createdUser._id}`)
                    .set("Authorization", `Bearer qwerty123`)
                    .send(secondInvalidReqBody);
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
