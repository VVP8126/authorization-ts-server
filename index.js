const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const userRouter = require("./rooter/rooter.js");
const errorMiddleware = require("./middleware/error-middleware");

require("dotenv").config(); // Defined configuration for properties using:
                            // create file .env (with properties) in project root

const application = express();
application.use(express.json());
application.use(
    cors({
        credentials: true,
        origin: process.env.CLIENT_URL })
);
application.use(cookieParser());
application.use("/user", userRouter);
application.use(errorMiddleware); // custom middleware - should be the last in a chain of middleware-components

const PORT = process.env.PORT || 5000; // PORT=5000 if properties not available

const start = async () => {
    try {
        mongoose.connect(
            process.env.DB_URL,
            {   dbName: process.env.DB_NAME,
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
            function (error) {
                if(error) throw error;
                console.log(`Connection with MONGODB set up`);
            }
        );
        application.listen(PORT, () => console.log(`Server is listening on <PORT:${PORT}>`));
    } catch (error) {
        console.log(error);
    }
}

start();
