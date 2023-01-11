import cors from "cors";
import path from "path";
import express, {Application, Request, Response, NextFunction} from "express";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
require("dotenv").config({path: path.join(__dirname, "../../.env")});
import authRouter from "../auth/auth.router";
import dailyRateRouter from "../daily-rate/daily-rate.router";
import productRouter from "../product-search/product-search.router";
import dayRouter from "../REST-entities/day/day.router";
import userRouter from "../REST-entities/user/user.router";
import promoRouter from "../promo/promo.router"
import {exec} from "child_process";

const swaggerDocument = require("../../swagger.json");

export default class Server {
    app: Application;
    ip: any|string|undefined = "789";
    constructor() {
        this.app = express();
    }

    async start() {
      await this.watchDog();
        this.initMiddlewares();
        await this.initDbConnection();
        this.initRoutes();
        this.initErrorHandling();
        this.initListening();
        this.tt();
    }

    startForTesting() {
        this.initMiddlewares();
        this.initRoutes();
        this.initErrorHandling();
        return this.app;
    }

     private async watchDog(){
        const { exec } = require("child_process");
        const ttt=this;
          function run(cmd:any) {
            const command = exec(cmd);
            let result = 'ddddd';
            command.stdout.on('data', function(data:any) {
                result = data.toString();
            });
            command.on('close', function() {
                // console.log("result: ",result);
                ttt.ip=result;
                return;
            });
        }

       return run("wget -qO- ipecho.net/plain");

    }
    private ping(){
        const { exec } = require("child_process");
        const ttt=this;
        function run(cmd:any) {
            const command = exec(cmd);
            command.stdout.on('data', function(data:any) {
                // result = data.toString();
            });
            command.on('close', function() {
                // console.log("result: ",result);
                return;
            });
        }

        return run(`ping ${this.ip} -c 1`);
    }
    private tt(){
        setInterval(()=>
            this.ping()
        , 1600000);
    }
    private initMiddlewares() {
        this.app.use(express.json());
        this.app.use(cors());
    }

    private async initDbConnection() {
        try {
            await mongoose.connect(process.env.MONGODB_URL as string, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true,
            });
            console.log("Database connection is successful");
        } catch (error) {
            console.log("Database connection failed", error);
            process.exit(1);
        }
    }

    private initRoutes() {
        this.app.use("/auth", authRouter);
        this.app.use("/daily-rate", dailyRateRouter);
        this.app.use("/markup", productRouter);
        this.app.use("/day", dayRouter);
        this.app.use("/promo", promoRouter);
        this.app.use("/user", userRouter);
        this.app.use(
            "/api-docs",
            swaggerUi.serve,
            swaggerUi.setup(swaggerDocument)
        );
    }

    private initErrorHandling() {
        this.app.use(
            (err: any, req: Request, res: Response, next: NextFunction): Response => {
                let status = 500;
                if (err.response) {
                    status = err.response.status;
                }
                return res.status(status).send(err.message);
            }
        );
    }

    private initListening() {
        this.app.listen(process.env.PORT || 3000, () =>
            console.log("Started listening on port", process.env.PORT)
        );
    }
}
