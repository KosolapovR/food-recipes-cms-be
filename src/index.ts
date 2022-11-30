import dotenv from "dotenv";
dotenv.config();

import createPino from "pino-http";
const pino = createPino({ transport: { target: "pino-pretty" } });

//@ts-ignore
import swaggerGenerator from "express-swagger-generator";

import {
  authRouter,
  recipeRouter,
  registerRouter,
  uploadRouter,
  commentRouter,
  userRouter,
  healthcheckRouter,
} from "./routes";

import express from "express";
import cors from "cors";

const app = express();
const expressSwagger = swaggerGenerator(app);

const port = process.env.NODE_DOCKER_PORT || 8080;

const options = {
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

app.use(pino);
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use("/public", express.static("public"));
app.use("/auth", authRouter);
app.use("/comment", commentRouter);
app.use("/healthcheck", healthcheckRouter);
app.use("/recipe", recipeRouter);
app.use("/register", registerRouter);
app.use("/upload", uploadRouter);
app.use("/user", userRouter);

app.listen(port, () => {
  pino.logger.info(`Server started on ${port} port`);
});
