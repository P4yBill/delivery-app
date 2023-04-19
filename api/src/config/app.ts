import express, { Express } from "express";
import setupRouter from "../api/route/router";
import morgan from "morgan";
import cors from "cors";

const app: Express = express();

// change this
// const allowedOrigins = ['http://localhost'];
const options: cors.CorsOptions = {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization', 'Content-Type']
};
app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

setupRouter(app);

export default app;