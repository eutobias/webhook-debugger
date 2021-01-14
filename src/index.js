const http = require('http')
const app = require('./app')

var httpServer = http.createServer(app)
httpServer.listen(8787)
