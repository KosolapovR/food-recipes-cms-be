require("dotenv").config();
require("./db_connection").connect();
import {authRouter} from './routes';
const express = require('express')
const app = express();
const expressSwagger = require('express-swagger-generator')(app);

const port = 8163;

let options = {
    swaggerDefinition: {
        info: {
            title: 'Swagger cms-be',
            version: '1.0.0',
        },
        host: `localhost:${port}`,
        basePath: '/',
        produces: [
            "application/json",
        ],
        schemes: ['http'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "",
            }
        }
    },
    basedir: __dirname, //app absolute path
    files: ['./routes/**/*.ts', './models/*.ts'] //Path to the API handle folder
};
expressSwagger(options)

const {infoLog} = require("./utils/logger");

app.use(express.json());
app.use('/auth', authRouter);
// app.use('/register', registerRouter);
// app.use('/product', productsRouter);
// app.use('/order', ordersRouter);
// app.use('/user', userRouter);

app.listen(port, () => {
    infoLog(`Server started on ${port} port`)
})
