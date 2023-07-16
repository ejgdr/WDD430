import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connectToDatabase } from "./database";
import { wizardRouter } from "./wizard.routes";

dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
    console.error("No uri environment variable has been defined in config.env");
    process.exit(1);
}

connectToDatabase(uri)
    .then(() => {
        const app = express();
        app.use(cors());

        const port = process.env.PORT || '3000';
        app.set('port', port);

        app.use("/wizards", wizardRouter);

        app.listen(port, function() {
            console.log('API running on localhost: ' + port)
        });
    }).catch(error => console.error(error));