const Model = require('../models/shop.model');
const userModel = require('../models/users.model')

function getIndex(req, res) {
    try {
        let user = null;
        if (req.user) {
            user = userModel.getUserByGoogleId(req.user.id);
        }

        res.render('index', {
            user
        });

    } catch (error) {
        console.log('Error getting index: ', error);
        res.status(500).send('Server Error');
    }
}

function getProducts(req, res) {
    let user = null;
    if (req.user) {
        user = userModel.getUserByGoogleId(req.user.id);
    }
    const products = Model.getAllProducts();

    res.render('products', {
        products,
        user
    });
}

async function getGenres(req, res) {

    let user = null;
    if (req.user) {
        user = userModel.getUserByGoogleId(req.user.id);
    }

    const categories = await Model.getAllGenres();

    const products = await Model.getAllProducts();

    categories.forEach(category => {
        category.products = products.filter(product => product.category_id === category.id);
    });

    res.render('categories', {
        categories,
        user
    });
}



function getCart(req, res) {
    const user = req.user;
    const cart = Model.getUserCart(req.user.id);
    const cartItems = Model.getCartItems(cart.id);

    res.render('cart', {
        cartItems,
        user
    })
}

function getProductDetails(req, res) {
    let user = null;
    if (req.user) {
        user = userModel.getUserByGoogleId(req.user.id);
    }
    const product = Model.getProductById(req.params.id);

    res.render('details', {
        product,
        user
    });
}

function addToCart(req, res) {
    const userId = req.user.id;
    let cart = Model.getUserCart(userId);

    // Added a check to ensure there is a cart for the user
    if (!cart || cart.length === 0) {
        Model.createCart(userId);
        cart = Model.getUserCart(userId);
    }


    Model.addProductToCart(cart.id, req.body.productId, req.body.quantity);

    res.redirect('/cart');
}

function updateCartItem(req, res) {
    const cartItemId = req.body.id;
    const quantity = req.body.quantity;

    Model.updateCartItemQuantity(cartItemId, quantity);
}

function removeCartItem(req, res) {
    const cartItemId = req.body.cartItemId;

    Model.removeProductFromCart(cartItemId);
    res.redirect('/cart');
}

function checkoutUsersCart(req, res) {
    const user = userModel.getUserByGoogleId(req.user.id);
    const userId = user.google_id;
    let cart = Model.getUserCart(userId);

    Model.checkoutCart(cart.id);


    res.render('checkout', {
        user
    });
}

module.exports = {
    // Redirections
    getIndex,
    getProducts,
    getGenres,
    getCart,
    getProductDetails,
    addToCart,
    removeCartItem,
    updateCartItem,
    checkoutUsersCart
};