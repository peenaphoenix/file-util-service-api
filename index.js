
'use strict';

const Hapi = require('@hapi/hapi');
const modules = require('./modules');
const path = require('path');

global.uploadPath = path.resolve(__dirname)+"/uploads/";

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0'
    });

    server.route([{
        method: 'GET',
        path: '/',
        handler: (request, h) => {
    
            return 'Hello World!';
        }
    }].concat(modules.routes));

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();