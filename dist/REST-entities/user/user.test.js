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
const enums_1 = require("../../helpers/typescript-helpers/enums");
const server_1 = __importDefault(require("../../server/server"));
const user_model_1 = __importDefault(require("./user.model"));
const session_model_1 = __importDefault(require("../session/session.model"));
const day_model_1 = __importDefault(require("../day/day.model"));
const summary_model_1 = __importDefault(require("../summary/summary.model"));
describe("User router test suite", () => {
    let app;
    let response;
    let createdDay;
    let accessToken;
    let createdUser;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        app = new server_1.default().startForTesting();
        const url = `mongodb://127.0.0.1/user`;
        yield mongoose_1.default.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        yield (0, supertest_1.default)(app).post("/auth/register").send({
            email: "test@email.com",
            password: "qwerty123",
            username: "Test",
        });
        createdUser = yield user_model_1.default.findOne({ email: "test@email.com" });
        response = yield (0, supertest_1.default)(app)
            .post("/auth/login")
            .send({ email: "test@email.com", password: "qwerty123" });
        accessToken = response.body.accessToken;
        yield (0, supertest_1.default)(app)
            .post(`/daily-rate/${createdUser._id}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
            weight: 90,
            height: 180,
            age: 30,
            desiredWeight: 80,
            bloodType: enums_1.BloodType.TWO,
        });
        createdDay = yield (0, supertest_1.default)(app)
            .post("/day")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
            date: "2020-12-31",
            productId: "5d51694802b2373622ff552c",
            weight: 200,
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield user_model_1.default.deleteOne({ email: createdUser.email });
        yield session_model_1.default.deleteOne({ _id: response.body.sid });
        yield day_model_1.default.deleteOne({ _id: createdDay.body.newDay.id });
        yield summary_model_1.default.deleteOne({ userId: createdUser._id });
        yield mongoose_1.default.connection.close();
    }));
    describe("GET /user", () => {
        let response;
        context("Valid request", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .get("/user")
                    .set("Authorization", `Bearer ${accessToken}`);
                createdUser = yield user_model_1.default.findOne({
                    email: "test@email.com",
                }).lean();
            }));
            it("Should return a 200 status code", () => {
                expect(response.status).toBe(200);
            });
            it("Should return an expected result", () => {
                expect(response.body).toEqual({
                    username: "Test",
                    email: "test@email.com",
                    id: createdUser._id.toString(),
                    userData: {
                        weight: 90,
                        height: 180,
                        age: 30,
                        desiredWeight: 80,
                        bloodType: enums_1.BloodType.TWO,
                        dailyRate: 1614,
                        notAllowedProducts: createdUser.userData
                            .notAllowedProducts,
                    },
                    days: [
                        {
                            date: "2020-12-31",
                            eatenProducts: [
                                {
                                    title: "Меланж яичный",
                                    weight: 200,
                                    kcal: 314,
                                    id: createdDay.body.eatenProduct.id,
                                },
                            ],
                            _id: createdDay.body.newDay.id,
                            __v: 0,
                            daySummary: {
                                date: "2020-12-31",
                                kcalLeft: 1300,
                                kcalConsumed: 314,
                                dailyRate: 1614,
                                percentsOfDailyRate: 19.454770755886,
                                _id: createdDay.body.newSummary.id,
                                userId: createdUser._id.toString(),
                                __v: 0,
                            },
                        },
                    ],
                });
            });
        });
        context("Without providing 'accessToken'", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app).get("/user");
            }));
            it("Should return a 400 status code", () => {
                expect(response.status).toBe(400);
            });
            it("Should say that token wasn't provided", () => {
                expect(response.body.message).toBe("No token provided");
            });
        });
        context("Without providing 'accessToken'", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .get("/user")
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
