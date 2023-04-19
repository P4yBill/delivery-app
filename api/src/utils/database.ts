import { connect, connection } from "mongoose";
import { ENV } from "../config/env";

export async function connectToMongodb() {
    try {
        await connect(`mongodb://${ENV.dbHost}:${ENV.dbPort}/${ENV.dbName}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    } catch (error) {
        console.error(error);
    }
}

connection.on("connected", () => {
    console.log("Mongodb connected to:", connection.db.databaseName);
});

connection.on("error", (error) => {
    console.error("error", error);
});

connection.on("disconnected", () => {
    console.log("Mongodb disconnected");
});