import * as passport from "passport";
import { Request, Response, NextFunction, json } from "express";
import { Router } from "express";
import { relative } from "path";
import KafkaManager from "../kafkaSoftware/kafkaservices/kafkaManager";
import { TestProducer } from "../kafkaSoftware/producer";
import Payload from "../payload";
import { TestConsumer } from "../kafkaSoftware/consumer";
import * as cors from "cors";




export class UserController {

    private controllerRouterObject: Router;
    private KafkaManager: KafkaManager;
    private consumer: any;
    /**
     *
     */
    constructor() {
        this.initControllerRoutes();
        this.KafkaManager = new KafkaManager();
        this.KafkaManager.setProducer(new TestProducer());
        this.KafkaManager.setConsumer(new TestConsumer());
        this.consumer = this.KafkaManager.createConsumerObject("userCrudResponce", "id-2", "g2");
    }

    public initControllerRoutes() {
        this.controllerRouterObject = Router();
        this.controllerRouterObject.use(function (req: Request, res: Response, next: any) {
            res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
            res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
            next();
        });
        this.controllerRouterObject.post("/register", cors(), async (req: Request, res: Response, next: any) => {

            const payload = req.body;
            const kafkaPayload = Payload.getPayload(payload.functionName, payload.args);
            await this.KafkaManager.publishMessage("userCrud", kafkaPayload);
            await this.KafkaManager.startConsumer(this.consumer);
            const operationStatus = this.KafkaManager.getMessage();
            console.log(operationStatus.successStatus);
            res.send(operationStatus);
        });
        this.controllerRouterObject.post("/read", passport.authenticate("jwt", { session: false }),
            async (req: Request, res: Response, next: any) => {
                console.log("********************************************************************************************");
                console.log("read route activated ");
                const readPayload = req.body;
                console.log("read route re.body is : ");
                console.log(readPayload.args);
                const kafkaPayload = Payload.getPayload(readPayload.functionName, readPayload.args);
                await this.KafkaManager.publishMessage("userCrud", kafkaPayload);
                await this.KafkaManager.startConsumer(this.consumer);
                const operationStatus = this.KafkaManager.getMessage();
                console.log("read route finished ");
                console.log("********************************************************************************************");

                res.send(operationStatus.successStatus);

            });
        this.controllerRouterObject.post("/update", passport.authenticate("jwt", { session: false }),
            async (req: Request, res: Response, next: any) => {

                const payload = req.body;
                const kafkaPayload = Payload.getPayload(payload.functionName, payload.args);
                await this.KafkaManager.publishMessage("userCrud", kafkaPayload);
                await this.KafkaManager.startConsumer(this.consumer);
                const operationStatus = this.KafkaManager.getMessage();
                console.log(operationStatus.successStatus);
                res.send(operationStatus.successStatus);

            });
        this.controllerRouterObject.post("/delete", passport.authenticate("jwt", { session: false }),
            async (req: Request, res: Response, next: any) => {

                const payload = req.body;
                const kafkaPayload = Payload.getPayload(payload.functionName, payload.args);
                await this.KafkaManager.publishMessage("userCrud", kafkaPayload);
                await this.KafkaManager.startConsumer(this.consumer);
                const operationStatus = this.KafkaManager.getMessage();
                console.log(operationStatus.successStatus);
                res.send(operationStatus.successStatus);

            });
    }
    public getUserControllerRouterObject() {

        return this.controllerRouterObject;
    }

}