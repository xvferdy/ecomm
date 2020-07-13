const Repository = require('./repository');

class ProductRepository extends Repository {}

module.exports = new ProductRepository('pruducts.json');
