const express = require('express');
const router = express.Router();

// Controller
const shopController = require('../controllers/shopController');

// Shop Routes
router.get('/index', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/genres', shopController.getGenres);
router.get('/cart', ensureAuth, shopController.getCart);
router.get('/details/:id', shopController.getProductDetails);
router.post('/cart/add', ensureAuth, shopController.addToCart);
router.post('/cart/remove', shopController.removeCartItem);
router.post('/cart/update', shopController.updateCartItem);
router.post('/cart/checkout', shopController.checkoutUsersCart);

function ensureAuth(req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        return res.redirect('/auth/login');
    }
    next();
}

module.exports = router;