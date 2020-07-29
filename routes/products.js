const express = require('express');
const productsIndexTemplate = require('../views/products/index');
const productsRepo = require('../repositories/products');

const router = express.Router();

//product request (show product html)
router.get('/', async (req, res) => {
	const products = await productsRepo.getAll();
	res.send(productsIndexTemplate({ products: products }));
});

module.exports = router;
