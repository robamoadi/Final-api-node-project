const express = require('express')
const body_parser = require('body-parser')
const config = require('config')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser');
const users_router = require('./routers/users_router')
const questions_router = require('./routers/questions_router')
const poll_router = require('./routers/poll_router')
const page_router = require('./routers/page_router')
const logger = require('./logger/my_logger')

const app = express()

app.use(body_parser.json())

app.use(cors())
app.use(cookieParser());
//helps the form information to get to the server
app.use(express.urlencoded({ extended: true }));

//to stop the client from gitting to specific page
app.get('*', (request, response, next) => {
    console.log(request.url);
    if (request.url == "/questions.html") {
        if (!request.cookies.auth) {
            response.status(200).redirect('./login.html')
            return
        }
    }
    if (request.url == "/signup.html") {
        if (request.cookies.auth) {
            response.status(200).redirect('./questions.html')
            return
        }
    }
    if (request.url == "/login.html") {
        if (request.cookies.auth) {
            response.status(200).redirect('./questions.html')
            return
        }
    }
    if (request.url == "/logout.html") {
        response.clearCookie('auth')
    }
    next()
})


app.use(express.static(path.join('.', '/static')))

const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Library API",
            version: "1.0.0",
            description: "My REST API employee",
        },
        servers: [
            {
                url: "/",
            },
        ],
    },
    apis: ["./routers/*.js"],
};

const specs = swaggerJsdoc(options);

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

app.use('/api/users', users_router)
app.use('/api/questions', questions_router)
app.use('/api/poll', poll_router)
app.use('', page_router)

app.listen(config.server.port, () => {
    logger.info(`====== express server is running on port ${config.server.port} =======`);
})