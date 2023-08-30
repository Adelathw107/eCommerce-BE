const swaggerUi = require('swagger-ui-express');
const swaggerDocumentJson = require('../../docs/swagger.json');

const optionsOpenApi = require('./config.openapi');
const swaggerJsdoc = require("swagger-jsdoc");
const specs = swaggerJsdoc(optionsOpenApi);

const openApi = (app) => {
    app.use(
        "/api-docs-schema",
        swaggerUi.serve,
        swaggerUi.setup(specs)
    );
    routeDefault(app);
};

const optionsSwagger = {
    swaggerOptions: {
        urls: [
            {
                url: "/api-docs/swagger.json",
                name: 'Json'
            }
        ]

    },
};

const configSwagger = (app) => {
    app.get("/api-docs/swagger.json", (req, res) => res.json(swaggerDocumentJson));
    app.use('/api-docs-crud', swaggerUi.serveFiles(null, optionsSwagger), swaggerUi.setup(null, optionsSwagger));
    routeDefault(app);
};


const routeDefault = (app) => {
    // setting router default
    app.use((req, res, next) => {
        if (req.url === '/') {
            res.redirect('/api-docs-crud');
            return;
        }
        next();
    });
};

module.exports = {
    configSwagger,
    openApi
};