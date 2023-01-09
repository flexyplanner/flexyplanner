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
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
require("dotenv").config({ path: path_1.default.join(__dirname, "../../.env") });
const auth_router_1 = __importDefault(require("../auth/auth.router"));
const daily_rate_router_1 = __importDefault(require("../daily-rate/daily-rate.router"));
const product_search_router_1 = __importDefault(require("../product-search/product-search.router"));
const day_router_1 = __importDefault(require("../REST-entities/day/day.router"));
const user_router_1 = __importDefault(require("../REST-entities/user/user.router"));
const promo_router_1 = __importDefault(require("../promo/promo.router"));
const swaggerDocument = require("../../swagger.json");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.initMiddlewares();
            yield this.initDbConnection();
            this.initRoutes();
            this.initErrorHandling();
            this.initListening();
        });
    }
    startForTesting() {
        this.initMiddlewares();
        this.initRoutes();
        this.initErrorHandling();
        return this.app;
    }
    initMiddlewares() {
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)({ origin: process.env.ALLOWED_ORIGIN }));
    }
    initDbConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mongoose_1.default.connect(process.env.MONGODB_URL, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false,
                    useCreateIndex: true,
                });
                console.log("Database connection is successful");
            }
            catch (error) {
                console.log("Database connection failed", error);
                process.exit(1);
            }
        });
    }
    initRoutes() {
        this.app.use("/auth", auth_router_1.default);
        this.app.use("/daily-rate", daily_rate_router_1.default);
        this.app.use("/markup", product_search_router_1.default);
        this.app.use("/day", day_router_1.default);
        this.app.use("/promo", promo_router_1.default);
        this.app.use("/user", user_router_1.default);
        this.app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
    }
    initErrorHandling() {
        this.app.use((err, req, res, next) => {
            let status = 500;
            if (err.response) {
                status = err.response.status;
            }
            return res.status(status).send(err.message);
        });
    }
    initListening() {
        this.app.listen(process.env.PORT || 3000, () => console.log("Started listening on port", process.env.PORT));
    }
}
exports.default = Server;
