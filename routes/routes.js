const express = require('express');
const router = express.Router();

// Controllers
const shopController = require('../controllers/shopController');
const adminController = require('../controllers/adminController');

const { upload } = require('../server');


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


// Admin Routes
router.get('/admin/product/create', adminController.showCreateProductPage);
router.get('/admin/product/showedit/:id', adminController.showEditProductPage);
router.post('/admin/product/create', adminController.createNewProduct);
router.post('/admin/product/delete', adminController.deleteProduct);
router.post('/admin/product/edit', adminController.updateProduct)
router.get('/admin/product/bulk-upload', adminController.showBulkUploadPage);
router.get('/admin/products', adminController.showAdminPage);
router.get('/admin/product/bulk-upload', adminController.showBulkUploadPage);
router.post('/admin/product/bulk-upload', upload.single('jsonFile'), adminController.handleBulkUpload);



function ensureAuth(req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        return res.redirect('/auth/login');
    }
    next();
}

module.exports = router;