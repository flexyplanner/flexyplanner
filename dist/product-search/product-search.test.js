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
const enums_1 = require("./../helpers/typescript-helpers/enums");
const server_1 = __importDefault(require("../server/server"));
const user_model_1 = __importDefault(require("../REST-entities/user/user.model"));
const session_model_1 = __importDefault(require("../REST-entities/session/session.model"));
describe("Product router test suite", () => {
    let app;
    let response;
    let secondResponse;
    let accessToken;
    let createdUser;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        app = new server_1.default().startForTesting();
        const url = `mongodb://127.0.0.1/product`;
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
        secondResponse = yield (0, supertest_1.default)(app)
            .post("/auth/login")
            .send({ email: "test@email.com", password: "qwerty123" });
        accessToken = secondResponse.body.accessToken;
        createdUser = yield user_model_1.default.findById(response.body.id);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield user_model_1.default.deleteOne({ email: response.body.email });
        yield session_model_1.default.deleteOne({ _id: response.body.sid });
        yield mongoose_1.default.connection.close();
    }));
    describe("GET /product?search={search}", () => {
        let response;
        context("Valid request", () => {
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
                    .get(encodeURI("/product?search=омлет"))
                    .set("Authorization", `Bearer ${accessToken}`);
            }));
            it("Should return a 200 status code", () => {
                expect(response.status).toBe(200);
            });
            it("Should return an expected result", () => {
                expect(response.body).toEqual([
                    {
                        _id: "5d51694802b2373622ff5530",
                        categories: ["яйца"],
                        weight: 100,
                        title: {
                            ru: "Омлет с сыром",
                            ua: "Омлет із сиром",
                        },
                        calories: 342,
                        groupBloodNotAllowed: [null, true, false, false, false],
                        __v: 0,
                    },
                    {
                        _id: "5d51694802b2373622ff552f",
                        categories: ["яйца"],
                        weight: 100,
                        title: {
                            ru: "Омлет из яичного порошка",
                            ua: "Омлет з яєчного порошку",
                        },
                        calories: 200,
                        groupBloodNotAllowed: [null, true, false, false, false],
                        __v: 0,
                    },
                    {
                        _id: "5d51694802b2373622ff552e",
                        categories: ["яйца"],
                        weight: 100,
                        title: {
                            ru: "Омлет из взбитых сливок",
                            ua: "Омлет зі збитих вершків",
                        },
                        calories: 257,
                        groupBloodNotAllowed: [null, true, false, false, false],
                        __v: 0,
                    },
                    {
                        _id: "5d51694802b2373622ff552d",
                        categories: ["яйца"],
                        weight: 100,
                        title: {
                            ru: "Омлет",
                            ua: "Ямлет",
                        },
                        calories: 184,
                        groupBloodNotAllowed: [null, true, false, false, false],
                        __v: 0,
                    },
                ]);
            });
        });
        context("Invalid request (no results for 'search' query)", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .get(`/product?search=${encodeURIComponent("qwerty123")}`)
                    .set("Authorization", `Bearer ${accessToken}`);
            }));
            it("Should return a 400 status code", () => {
                expect(response.status).toBe(400);
            });
            it("Should return an expected result", () => {
                expect(response.body.message).toBe("No allowed products found for this query");
            });
        });
        context("Without providing 'accessToken'", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app).get(`/product?search=${encodeURIComponent("омлет")}`);
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
                    .get(`/product?search=${encodeURIComponent("омлет")}`)
                    .set("Authorization", `Bearer qwerty123`);
            }));
            it("Should return a 401 status code", () => {
                expect(response.status).toBe(401);
            });
            it("Should return an unauthorized status", () => {
                expect(response.body.message).toBe("Unauthorized");
            });
        });
        context("Without providing 'search' query", () => {
            beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
                response = yield (0, supertest_1.default)(app)
                    .get(`/product`)
                    .set("Authorization", `Bearer ${accessToken}`);
            }));
            it("Should return a 400 status code", () => {
                expect(response.status).toBe(400);
            });
            it("Should return an unauthorized status", () => {
                expect(response.body.message).toBe('"search" is required');
            });
        });
    });
});
