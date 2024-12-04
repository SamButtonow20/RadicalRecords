const { getCartItems, addToCart, removeFromCart } = require('../models/cart-model'); // Import cart model functions

const cartController = (req, res) => {
    const userId = req.session.userId; // Assuming userId is stored in the session

    // Retrieve cart items using the getCartItems function from the model
    getCartItems(userId, (err, rows) => {
        if (err) {
            console.error('Error fetching cart items:', err.message);
            return res.status(500).send('Error loading cart');
        }

        if (!rows || rows.length === 0) {
            return res.render('cart', { cartItems: [], subtotal: 0, tax: 0, deliveryFee: 5.0, total: 5.0 });
        }

        // Calculate totals
        const cartItems = rows.map((row) => ({
            id: row.cartProductId,
            name: row.name,
            image: row.image,
            price: row.price,
            quantity: row.quantity,
        }));

        const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = subtotal * 0.0675;
        const deliveryFee = 5.0;
        const total = subtotal + tax + deliveryFee;

        // Render the cart page with the cart items and calculated totals
        res.render('cart', { cartItems, subtotal, tax, deliveryFee, total });
    });
};

// Example for handling adding a product to the cart
const addToCartController = (req, res) => {
    const userId = req.session.userId; // Assuming userId is stored in the session
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity || 1); // Default to 1 if no quantity is provided

    addToCart(userId, productId, quantity, (err) => {
        if (err) {
            console.error('Error adding product to cart:', err.message);
            return res.status(500).send('Error adding product to cart');
        }

        // Redirect to the cart page after adding the product
        res.redirect('/cart');
    });
};

// Example for removing a product from the cart
const removeFromCartController = (req, res) => {
    const cartProductId = req.params.cartProductId; // Get the cart product ID from the request parameters

    // Call the removeFromCart function to remove the item from the cart
    removeFromCart(cartProductId, (err) => {
        if (err) {
            console.error('Error removing product from cart:', err.message);
            return res.status(500).send('Error removing product from cart');
        }

        // Redirect to the cart page after removing the product
        res.redirect('/cart');
    });
};

module.exports = { cartController, addToCartController, removeFromCartController };
