const express = require('express');
const cartsRepo = require('../repositories/carts');
const productRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show');

const router = express.Router();
// Receive a POST request to add an item to a cart
router.post('/cart/products', async (req, res) => {
	// console.log(req.body); //{ productId: '62b582ba' }

	// Figure out the cart
	let cart;
	if (!req.session.cartId) {
		// We dont have cart, need to create one & make new session
		cart = await cartsRepo.create({ items: [] });
		req.session.cartId = cart.id;
	} else {
		// We have cart, lets get it from repository
		cart = await cartsRepo.getOne(req.session.cartId);
	}

	// console.log(cart); //{ items: [], id: 'aa3351b1' }

	// Add item to cart
	// Increment quantity for existing product
	const existingItem = cart.items.find((item) => item.id === req.body.productId);
	if (existingItem) {
		existingItem.quantity++;
	} else {
		// Or add new product
		cart.items.push({ id: req.body.productId, quantity: 1 });
	}

	await cartsRepo.update(req.session.cartId, { items: cart.items });

	res.send('Product added to cart!');
});

// Receive a GET request to show all items in cart
router.get('/cart', async (req, res) => {
	if (!req.session.cartId) {
		console.log('>>>> No Sesion! <<<<');
		res.redirect('/');
	}

	const cart = await cartsRepo.getOne(req.session.cartId);

	for (let item of cart.items) {
		const product = await productRepo.getOne(item.id);
		item.product = product; //buat properti baru, nama product
	}

	res.send(cartShowTemplate({ items: cart.items }));
});

// Receive a POST request to delete an item from cart

module.exports = router;
