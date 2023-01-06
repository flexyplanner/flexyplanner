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
const server_1 = __importDefault(require("../../server/server"));
const user_model_1 = __importDefault(require("../user/user.model"));
const session_model_1 = __importDefault(require("../session/session.model"));
const summary_model_1 = __importDefault(require("../summary/summary.model"));
const day_model_1 = __importDefault(require("./day.model"));
const enums_1 = require("../../helpers/typescript-helpers/enums");
describe("Day router test suite", () => {
    let app;
    let response;
    let secondResponse;
    let accessToken;
    let secondAccessToken;
    let createdUser;
    let secondCreatedUser;
    let dayId;
    let secondDayId;
    let eatenProductId;
    let dayData;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        app = new server_1.default().startForTesting();
        const url = `mongodb://127.0.0.1/day`;
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
        yield (0, supertest_1.default)(app).post("/auth/register").send({
            email: "testt@email.com",
            password: "qwerty123",
            username: "Test",
        });
        createdUser = yield user_model_1.default.findOne({ email: "test@email.com" });
        secondCreatedUser = yield user_model_1.default.findOne({ email: "testt@email.com" });
        response = yield (0, supertest_1.default)(app)
            .post("/auth/login")
            .send({ email: "test@email.com", password: "qwerty123" });
        secondResponse = yield (0, supertest_1.default)(app)
            .post("/auth/login")
            .send({ email: "testt@email.com", password: "qwerty123" });
        accessToken = response.body.accessToken;
        secondAccessToken = secondResponse.body.accessToken;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield summary_model_1.default.deleteOne({ userId: createdUser._id });
        yield user_model_1.default.deleteOne({ email: response.body.user.email });
        yield user_model_1.default.deleteOne({ email: secondResponse.body.user.email });
        yield session_model_1.default.deleteOne({ _id: response.body.sid });
        yield session_model_1.default.deleteOne({ _id: secondResponse.body.sid });
        yield mongoose_1.default.connection.close();
    }));
    describe("POST /day", () => {
        let response;
        let newSummary;
        let daySummary;
        let day;
        const validReqBody = {
            date: "2020-12-31",
            productId: "5d51694802b2373622ff552c",
            weight: 200,
        };
        const invalidReqBody = {
            date: "2020-12-31",
            productId: "5d51694802b2373622ff552c",
        };
        const secondInvalidReqBody = {
            date: "2020-12-31",
            productId: "qwerty123",
            weight: 200,
        };
        const thirdInvalidReqBody = {
            date: "2020-13-31",
            productId: "5d51694802b2373622ff552c",
            weight: 200,
        };
        context("Before counting dailyRate", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .post("/day")
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(validReqBody);
            }));
            it("Should return a 403 status code", () => {
                expect(response.status).toBe(403);
            });
            it("Should say that dailyRate wasn't counted", () => {
                expect(response.body.message).toBe("Please, count your daily rate first");
            });
        });
        context("With validReqBody", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
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
                response = yield (0, supertest_1.default)(app)
                    .post("/day")
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(validReqBody);
                newSummary = yield summary_model_1.default.findById(response.body.newSummary.id);
                dayId = response.body.newDay.id.toString();
                day = yield day_model_1.default.findById(dayId);
                eatenProductId = response.body.eatenProduct.id;
                createdUser = yield user_model_1.default.findById(createdUser._id);
            }));
            it("Should return a 201 status code", () => {
                expect(response.status).toBe(201);
            });
            it("Should return an expected result", () => {
                expect(response.body).toEqual({
                    eatenProduct: {
                        title: "Меланж яичный",
                        weight: validReqBody.weight,
                        kcal: 314,
                        id: response.body.eatenProduct.id,
                    },
                    newDay: {
                        eatenProducts: [
                            {
                                title: "Меланж яичный",
                                weight: validReqBody.weight,
                                kcal: 314,
                                id: response.body.eatenProduct.id,
                            },
                        ],
                        id: response.body.newDay.id.toString(),
                        date: validReqBody.date,
                        daySummary: response.body.newDay.daySummary,
                    },
                    newSummary: {
                        date: validReqBody.date,
                        kcalLeft: 1300,
                        kcalConsumed: 314,
                        dailyRate: 1614,
                        percentsOfDailyRate: 19.454770755886,
                        id: newSummary._id.toString(),
                        userId: createdUser._id.toString(),
                    },
                });
            });
            it("Should create new summary in DB", () => {
                expect(newSummary).toBeTruthy();
            });
            it("Should create an id for eatenProduct", () => {
                expect(response.body.eatenProduct.id).toBeTruthy();
            });
            it("Should add a new day in DB", () => {
                expect(day).toBeTruthy();
            });
            it("Should add a new day to user in DB", () => {
                expect(createdUser.days[0].toString()).toBe(dayId.toString());
            });
        });
        context("With validReqBody (same day)", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .post("/day")
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(validReqBody);
                daySummary = yield summary_model_1.default.findById(response.body.daySummary.id);
                secondDayId = response.body.day.id;
                day = yield day_model_1.default.findById(secondDayId);
                dayData = response.body.day;
                dayData.daySummary = response.body.daySummary;
            }));
            it("Should return a 201 status code", () => {
                expect(response.status).toBe(201);
            });
            it("Should return an expected result", () => {
                expect(response.body).toEqual({
                    eatenProduct: {
                        title: "Меланж яичный",
                        weight: validReqBody.weight,
                        kcal: 314,
                        id: response.body.eatenProduct.id,
                    },
                    day: {
                        eatenProducts: [
                            {
                                title: "Меланж яичный",
                                weight: validReqBody.weight,
                                kcal: 314,
                                id: eatenProductId,
                            },
                            {
                                title: "Меланж яичный",
                                weight: validReqBody.weight,
                                kcal: 314,
                                id: response.body.eatenProduct.id,
                            },
                        ],
                        id: response.body.day.id.toString(),
                        date: validReqBody.date,
                        daySummary: response.body.day.daySummary,
                    },
                    daySummary: {
                        date: validReqBody.date,
                        kcalLeft: 986,
                        kcalConsumed: 628,
                        dailyRate: 1614,
                        percentsOfDailyRate: 38.909541511772,
                        id: daySummary._id.toString(),
                        userId: createdUser._id.toString(),
                    },
                });
            });
            it("Should update existing day summary in DB", () => {
                expect(daySummary.toObject()).toEqual({
                    date: validReqBody.date,
                    kcalLeft: 986,
                    kcalConsumed: 628,
                    dailyRate: 1614,
                    percentsOfDailyRate: 38.909541511772,
                    _id: daySummary._id,
                    userId: createdUser._id,
                    __v: 0,
                });
            });
            it("Should update existing day DB", () => {
                expect(day.eatenProducts.length).toBe(2);
            });
            it("Should create an id for 'eatenProduct'", () => {
                expect(response.body.eatenProduct.id).toBeTruthy();
            });
        });
        context("Without providing 'accessToken'", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app).post("/day").send(validReqBody);
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
                    .post("/day")
                    .send(validReqBody)
                    .set("Authorization", `Bearer qwerty123`);
            }));
            it("Should return a 401 status code", () => {
                expect(response.status).toBe(401);
            });
            it("Should return an unauthorized status", () => {
                expect(response.body.message).toBe("Unauthorized");
            });
        });
        context("With invalidReqBody (no 'weight' provided)", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .post("/day")
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(invalidReqBody);
            }));
            it("Should return a 400 status code", () => {
                expect(response.status).toBe(400);
            });
            it("Should say that 'weight' wasn't provided", () => {
                expect(response.body.message).toBe('"weight" is required');
            });
        });
        context("With secondInvalidReqBody (invalid 'productId')", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .post("/day")
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(secondInvalidReqBody);
            }));
            it("Should return a 400 status code", () => {
                expect(response.status).toBe(400);
            });
            it("Should say that 'productId' is invalid", () => {
                expect(response.body.message).toBe("Invalid 'productId'. Must be MongoDB ObjectId");
            });
        });
        context("With thirdInvalidReqBody (invalid 'date' format)", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .post("/day")
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(thirdInvalidReqBody);
            }));
            it("Should return a 400 status code", () => {
                expect(response.status).toBe(400);
            });
            it("Should say that 'date' is invalid", () => {
                expect(response.body.message).toBe("Invalid 'date'. Use YYYY-MM-DD string format");
            });
        });
    });
    describe("POST /day/info", () => {
        let response;
        const validReqBody = {
            date: "2020-12-31",
        };
        const secondValidReqBody = {
            date: "2020-01-01",
        };
        const invalidReqBody = {
            date: "2020-13-31",
        };
        context("With validReqBody", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .post(`/day/info`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(validReqBody);
            }));
            it("Should return a 200 status code", () => {
                expect(response.status).toBe(200);
            });
            it("Should return an expected result", () => {
                expect(response.body).toEqual(Object.assign({}, dayData));
            });
        });
        context("Without providing 'accessToken'", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app).post(`/day/info`).send(validReqBody);
            }));
            it("Should return a 400 status code", () => {
                expect(response.status).toBe(400);
            });
            it("Should say that token wasn't provided", () => {
                expect(response.body.message).toBe("No token provided");
            });
        });
        context("With secondValidReqBody", () => {
            const dailyRate = 10 * 90 + 6.25 * 180 - 5 * 30 - 161 - 10 * (90 - 80);
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .post(`/day/info`)
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(secondValidReqBody);
            }));
            it("Should return a 200 status code", () => {
                expect(response.status).toBe(200);
            });
            it("Should return an expected result", () => {
                expect(response.body).toEqual({
                    kcalLeft: dailyRate,
                    kcalConsumed: 0,
                    dailyRate: dailyRate,
                    percentsOfDailyRate: 0,
                });
            });
        });
        context("Without providing 'accessToken'", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app).post(`/day/info`).send(validReqBody);
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
                    .post(`/day/info`)
                    .set("Authorization", `Bearer qwerty123`)
                    .send(validReqBody);
            }));
            it("Should return a 401 status code", () => {
                expect(response.status).toBe(401);
            });
            it("Should return an unauthorized status", () => {
                expect(response.body.message).toBe("Unauthorized");
            });
        });
        context("With invalidReqBody ('date' is invalid )", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .post("/day/info")
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(invalidReqBody);
            }));
            it("Should return a 400 status code", () => {
                expect(response.status).toBe(400);
            });
            it("Should say that date is invalid", () => {
                expect(response.body.message).toBe("Invalid 'date'. Use YYYY-MM-DD string format");
            });
        });
    });
    describe("DELETE /day", () => {
        let response;
        let newDaySummary;
        let newDay;
        const validReqBody = {
            dayId,
            eatenProductId,
        };
        const invalidReqBody = {
            dayId,
        };
        const secondInvalidReqBody = {
            dayId: "qwerty123",
            eatenProductId,
        };
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield day_model_1.default.deleteOne({ _id: dayId });
        }));
        context("With another account", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                validReqBody.dayId = dayId;
                validReqBody.eatenProductId = eatenProductId;
                yield (0, supertest_1.default)(app)
                    .post(`/daily-rate/${secondCreatedUser._id}`)
                    .set("Authorization", `Bearer ${secondAccessToken}`)
                    .send({
                    weight: 90,
                    height: 180,
                    age: 30,
                    desiredWeight: 85,
                    bloodType: enums_1.BloodType.ONE,
                });
                response = yield (0, supertest_1.default)(app)
                    .delete("/day")
                    .set("Authorization", `Bearer ${secondAccessToken}`)
                    .send(validReqBody);
            }));
            it("Should return a 404 status code", () => {
                expect(response.status).toBe(404);
            });
            it("Should return a 404 status code", () => {
                expect(response.body.message).toBe("Day not found");
            });
        });
        context("With validReqBody", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                validReqBody.dayId = dayId;
                validReqBody.eatenProductId = eatenProductId;
                invalidReqBody.dayId = dayId;
                response = yield (0, supertest_1.default)(app)
                    .delete("/day")
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(validReqBody);
                newDaySummary = yield summary_model_1.default.findById(response.body.newDaySummary.id);
                newDay = yield day_model_1.default.findById(validReqBody.dayId);
            }));
            afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
                yield day_model_1.default.deleteOne({ _id: secondDayId });
            }));
            it("Should return a 201 status code", () => {
                expect(response.status).toBe(201);
            });
            it("Should return an expected result", () => {
                expect(response.body).toEqual({
                    newDaySummary: {
                        date: "2020-12-31",
                        kcalLeft: 1300,
                        kcalConsumed: 314,
                        dailyRate: 1614,
                        percentsOfDailyRate: 19.454770755886,
                        id: newDaySummary._id.toString(),
                        userId: createdUser._id.toString(),
                    },
                });
            });
            it("Should delete a product from DB", () => {
                expect(newDay.eatenProducts.find((product) => product.id === validReqBody.eatenProductId)).toBeFalsy();
            });
        });
        context("Without providing 'accessToken'", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app).delete("/day").send(validReqBody);
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
                    .delete("/day")
                    .set("Authorization", `Bearer qwerty123`)
                    .send(validReqBody);
            }));
            it("Should return a 401 status code", () => {
                expect(response.status).toBe(401);
            });
            it("Should return an unauthorized status", () => {
                expect(response.body.message).toBe("Unauthorized");
            });
        });
        context("With invalidReqBody (no 'eatenProductId' provided)", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .delete("/day")
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(invalidReqBody);
            }));
            it("Should return a 400 status code", () => {
                expect(response.status).toBe(400);
            });
            it("Should say that 'eatenProductId' is required", () => {
                expect(response.body.message).toBe('"eatenProductId" is required');
            });
        });
        context("With secondInvalidReqBody (invalid dayId)", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .delete("/day")
                    .set("Authorization", `Bearer ${accessToken}`)
                    .send(secondInvalidReqBody);
            }));
            it("Should return a 400 status code", () => {
                expect(response.status).toBe(400);
            });
            it("Should say that 'dayId' is invalid", () => {
                expect(response.body.message).toBe("Invalid 'dayId'. Must be MongoDB ObjectId");
            });
        });
    });
});
