const productsHelper = require('~/scripts/helpers/productsHelper')
const server = require('express')()

server.get('/', function (req, res) {
    log.info('Controller Home is called')
    const product = productsHelper.getProductTile('NG002092-LAC');
    res.render('home', {
        title: 'I\'m  Backend!',
        product: product
    })
});

module.exports = server
