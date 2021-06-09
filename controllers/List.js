const productsHelper = require('~/scripts/helpers/productsHelper')
const server = require('express')()

server.get('/list', function (req, res) {
    log.info('Controller Home is called')
    const product = productsHelper.getProductTile('NG002092-LAC');
    res.render('list', {
        title: 'I\'m  Backend!',
        product: JSON.stringify(product, null, 2)
    })
});

module.exports = server
