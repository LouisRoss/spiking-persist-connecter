const express = require('express');
const createProxyMiddleware = require('http-proxy-middleware');
const favicon = require('serve-favicon');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
const net = require('net');
const fs = require('fs');

const cors = require("cors"); // enforce CORS, will be set to frontend URL when deployed

let rawdata = fs.readFileSync('/configuration/configuration.json');
let configuration = JSON.parse(rawdata);
console.log(configuration);


const cors_conf = {
  origin: ["http://0.0.0.0:5000"], // ! temporary
  methods: ["POST", "GET"],
};

const app = express();
//app.use(cors(cors_conf));
//app.options('/:connection', cors());
app.use(cors());

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

const targetUrl = configuration.services.modelPersist.host + ':' + configuration.services.modelPersist.port;
const proxyMiddleware = createProxyMiddleware({
  target: targetUrl,
  changeOrigin: true,
});

app.use(proxyMiddleware);

var server = http.createServer(app);

const PORT = 5000;

app.use(bodyParser.json());

app.use(express.static('public'));

server.listen(PORT, () => console.log(`Server running on port http://backend:${PORT}, proxying to ${targetUrl}`));

