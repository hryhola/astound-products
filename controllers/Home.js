const server = require('express')()

server.get('/', function (req, res) {
    log.info('Controller Home is called')
    res.render('home')
});

module.exports = server
