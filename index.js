// npm i -s cors express cluster superagent os
const request = require('superagent');
const express = require('express');
const cluster = require('cluster');
const os = require('os');
const port = 80;

if (cluster.isMaster) {
    var cpuCount = os.cpus().length;
    var threadCount = cpuCount;
    threadCount = 1;

    for (var i = 0; i < threadCount; i += 1) {
        cluster.fork();
    }

    cluster.on('exit', function (worker) {
        console.log('Worker %d died', worker.id);
        cluster.fork();
    });

} else {
    const app = express();

    app.use(function (req, res, next) {
        if (req.method === 'OPTIONS') {
            var headers = {};
            headers["Access-Control-Allow-Origin"] = "*";
            headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
            headers["Access-Control-Allow-Credentials"] = true;
            headers["Access-Control-Max-Age"] = '86400'; // 24 hours
            headers["Access-Control-Allow-Headers"] = "Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With,X-HTTP-Method-Override";
            res.writeHead(204, headers);
            res.end();
        } else {
            next();
        }
    });

    app.use(require('cors')());

    app.get('/pipe', (req, res) => {
        let { url } = req.query;
        request.get(url).pipe(res);
    });

    app.get('/', (req, res) => {
        res.send('nothing to see here.');
    });

    app.listen(port, function () {
        console.log(`App listening on port ${ port }!`);
    });
}
