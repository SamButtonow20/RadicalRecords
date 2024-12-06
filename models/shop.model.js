const db = require('../database/db');

// Product Model
function getAllProducts() {
    const sql = `
    SELECT *
    FROM products;`;

    return db.all(sql);
}

function getProductById(productId) {
    const sql = `
    SELECT * 
    FROM products
    WHERE id = ?;`;

    return db.get(sql, productId);
}

function addProduct(name, artist, price, description, image_url) {
    const params = [
        name,
        artist,
        price,
        description,
        image_url,
    ];
    const sql = `
    INSERT INTO products(name, artist, price, description, image_url)
    VALUES (?, ?, ?, ?, ?);
    `;

    return db.run(sql, params);
}

function updateProduct(id, name, artist, price, description, image_url) {
    const params = [id,
        name,
        artist,
        price,
        description,
        image_url,
    ];

    const sql = `
    UPDATE products
    SET name = ?, artist = ?, price = ?, description = ?, image_url = ?
    WHERE id = ?;
    `;

    return db.run(sql, params);
}

function deleteProduct(id) {
    const sql = `
    DELETE FROM products
    WHERE id = ?;
    `;

    return db.run(sql, [id]);
}

// Cart Model
function getUserCart(userId) {
    const params = [
        userId
    ];

    const sql = `
    SELECT *
    FROM carts
    WHERE user_id = ? AND status = 'new';
    `;

    try {
        const results = db.get(sql, userId);
        if (!results) {
            console.log("No cart found for this user");
            return [];
        }
        return results;
    } catch (error) {
        console.log("Error fetching cart:", error);
        return [];
    }
}

function createCart(userId) {
    const params = [
        userId,
        'new'
    ];

    const sql = `
    INSERT INTO carts (user_id, status)
    VALUES(?, ?);
    `;

    return db.run(sql, params);
}

function addProductToCart(cartId, productId, quantity) {
    const params = [
        cartId,
        productId,
        quantity
    ];

    const sql = `
    INSERT INTO cart_products (cart_id, product_id, quantity)
    VALUES (?, ?, ?)
    ON CONFLICT(cart_id, product_id)
    DO UPDATE SET quantity = quantity + excluded.quantity;
    `;

    try {
        db.run(sql, params);
        console.log("Product added to cart successfully.");
    } catch (error) {
        console.error("Error adding product to cart:", error);
        throw new Error("Error adding product to cart");
    }
}

function getCartItems(cartId) {
    const sql = `
    SELECT cp.id AS cartItemId, p.name, p.price, cp.quantity, p.image_url
    FROM cart_products cp
    INNER JOIN products p ON cp.product_id = p.id
    WHERE cp.cart_id = ?;
    `;

    return db.all(sql, cartId);
}

function updateCartItemQuantity(cartItemId, quantity) {
    const params = [
        quantity,
        cartItemId
    ];

    const sql = `
    UPDATE cart_products 
    SET quantity = ? 
    WHERE id = ?;`;

    try {
        db.run(sql, params);
    } catch (error) {
        console.error("Error updating product quantity:", error);
        throw new Error("Error updating product quantity");
    }
}

function removeProductFromCart(cartItemId) {
    const sql = `
    DELETE FROM cart_products
    WHERE id = ?;
    `;

    try {
        db.run(sql, [cartItemId]);
    } catch (error) {
        console.error("Error removing product:", error);
        throw new Error("Error removing product");
    }
}

// Genres Model
function getAllGenres() {
    const sql = `
    SELECT *
    FROM categories;
    `;

    return db.all(sql);
}

function checkoutCart(cartId) {
    const sql = `
    UPDATE carts
    SET status = 'purchased'
    WHERE id = ?;
    `;

    return db.run(sql, cartId);
}

module.exports = {
    // Product funcs
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    // Cart Funcs
    getUserCart,
    createCart,
    addProductToCart,
    getCartItems,
    updateCartItemQuantity,
    removeProductFromCart,
    // Categories funcs
    getAllGenres,
    // Checkout funcs
    checkoutCart
};