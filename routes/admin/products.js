const express = require('express');
const multer = require('multer');

const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');
const productEditTemplate = require('../../views/admin/products/edit');
const { requireTitle, requirePrice, requireImage } = require('./validators');
const { handleErrors, requireAuth } = require('./middlewares');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// products listing (show products html)
router.get('/admin/products', requireAuth, async (req, res) => {
	const products = await productsRepo.getAll();

	res.send(productsIndexTemplate({ products: products }));
});

// New product request (show New product html)
router.get('/admin/products/new', requireAuth, (req, res) => {
	res.send(productsNewTemplate({}));
});

// New product POST request
router.post(
	'/admin/products/new',
	requireAuth,
	upload.single('image'),
	// [ requireTitle, requirePrice, requireImage ],
	[ requireTitle, requirePrice ],
	handleErrors(productsNewTemplate),
	async (req, res) => {
		// const image = req.file.buffer.toString('base64'); //debug tanpa image dlu

		const { title, price } = req.body;
		await productsRepo.create({ title: title, price: price }); //debug tanpa image dlu

		// fashion way
		// const newProduct = req.body;
		// await productsRepo.create(newProduct);

		// await productsRepo.create({ title: title, price: price, image: image }); //save ke products.json

		res.redirect('/admin/products/');
	}
);

// Edit product request (show Edit product html)
router.get('/admin/products/:id/edit', requireAuth, async (req, res) => {
	// console.log(req.params.id);
	const product = await productsRepo.getOne(req.params.id);

	if (!product) {
		res.send('Product not found');
	}
	res.send(productEditTemplate({ product: product }));
});

// Edit product POST request
router.post(
	'/admin/products/:id/edit',
	requireAuth,
	upload.single('image'),
	[ requireTitle, requirePrice ],
	handleErrors(productEditTemplate, async (req) => {
		const product = await productsRepo.getOne(req.params.id);
		// console.log(product); //{ title: 'inca fire', price: 77, id: '7b414205', image: '' }
		return { product: product };
	}),
	async (req, res) => {
		const change = req.body;
		if (req.file) {
			change.image = req.file.buffer.toString('base64');
		}

		// // kalau tidak pakai variabel change
		// const { title, price } = req.body;
		// await productsRepo.update(req.params.id, { title: title, price: price });

		try {
			await productsRepo.update(req.params.id, change);
		} catch (err) {
			return res.send('Could not find item');
		}

		res.redirect('/admin/products/');
	}
);

module.exports = router;
