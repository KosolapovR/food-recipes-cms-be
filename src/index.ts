require("dotenv").config();

import {
  authRouter,
  recipeRouter,
  registerRouter,
  uploadRouter,
} from "./routes";

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
  route: { url: "/api/swagger", docs: "/api/swagger.json" },
  basedir: __dirname, //app absolute path
  files: ["./routes/**/*.ts", "./models/*.ts"], //Path to the API handle folder
};
expressSwagger(options);

const { infoLog } = require("./utils/logger");

app.use(express.json());
app.use("/public", express.static("public"));
app.use("/auth", authRouter);
app.use("/recipe", recipeRouter);
app.use("/register", registerRouter);
app.use("/upload", uploadRouter);

app.listen(port, () => {
  infoLog(`Server started on ${port} port`);
});
