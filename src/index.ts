require("dotenv").config();
const con = require("./db_connection").getConnection();
import {
  authRouter,
  recipeRouter,
  registerRouter,
  uploadRouter,
} from "./routes";
import { Connection } from "mysql2/promise";

const express = require("express");
const app = express();
const expressSwagger = require("express-swagger-generator")(app);

const port = 8163;

let options = {
  swaggerDefinition: {
    info: {
      title: "Swagger cms-be",
      version: "1.0.0",
    },
    host: `localhost:${port}`,
    basePath: "/",
    produces: ["application/json"],
    schemes: ["http"],
    securityDefinitions: {
      JWT: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
        description: "",
      },
    },
  },
  basedir: __dirname, //app absolute path
  files: ["./routes/**/*.ts", "./models/*.ts"], //Path to the API handle folder
};
expressSwagger(options);

const { infoLog } = require("./utils/logger");

con.then((con: Connection) => app.set("db", con));
app.use(express.json());
app.use("/public", express.static("public"));
app.use("/auth", authRouter);
app.use("/recipe", recipeRouter);
app.use("/register", registerRouter);
app.use("/upload", uploadRouter);

app.listen(port, () => {
  infoLog(`Server started on ${port} port`);
});
