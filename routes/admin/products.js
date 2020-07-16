const express = require('express');
const multer = require('multer');

const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const { requireTitle, requirePrice } = require('./validators');
const { handleErrors } = require('./middlewares');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', (req, res) => {});

// New product request (show New product html)
router.get('/admin/products/new', (req, res) => {
	res.send(productsNewTemplate({}));
});

// New product POST request
router.post(
	'/admin/products/new',
	upload.single('image'),
	[ requireTitle, requirePrice ],
	handleErrors(productsNewTemplate),
	async (req, res) => {
		// const image = req.file.buffer.toString('base64'); //debug tanpa image dlu
		const { title, price } = req.body;
		await productsRepo.create({ title: title, price: price }); //debug tanpa image dlu
		// await productsRepo.create({ title: title, price: price, image: image }); //save ke products.json

		res.send('Submitted');
	}
);

module.exports = router;
