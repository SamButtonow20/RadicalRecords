const db = require('../database/db');

function editProductDetails(params) {
    const paramsArray = [
        params.name,
        params.artist,
        params.price,
        params.category_id,
        params.description,
        params.image_url,
        params.id
    ];

    const sql = `
    UPDATE products
    SET name = ?, artist = ?, price = ?, category_id = ?, description = ?, image_url = ?
    WHERE id = ?;
    `;

    return db.runQuery(sql, paramsArray);
}

function deleteProduct(params) {
    const sql = `
    DELETE FROM products
    WHERE id = ?;
    `;

    return db.runQuery(sql, [params.id]);
}


function addNewProduct(params) {
    const sql = `
    INSERT INTO products
        (id, 
        name, 
        artist,
        description, 
        category_id,
        image_url,
        price)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    const Params = [
        params.id,
        params.name,
        params.artist,
        params.description,
        params.category_id,
        params.image_url,
        params.price
    ];

    return db.runQuery(sql, Params);
}

function getProductById(productId) {
    const sql = `
    SELECT * 
    FROM products
    WHERE id = ?;`;

    return db.get(sql, productId);
}

function insertProducts(products) {
    const query = `
        INSERT INTO products (name, description, image_url, price, category_id, is_featured, artist)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        db.exec('BEGIN TRANSACTION');

        products.forEach((product, index) => {
            console.log(`Inserting product ${index + 1}:`, product);

            const {
                name,
                description,
                image_url,
                price,
                category_id,
                is_featured,
                artist
            } = product;

            if (!name || !price || !artist || !category_id) {
                console.log(`Product ${index + 1} has missing fields.`);
                throw new Error('Missing required product information');
            }

            db.runQuery(query,
                name,
                description || null,
                image_url || null,
                price,
                category_id,
                is_featured || 0,
                artist || null
            );
        });

        db.exec('COMMIT');
        return {
            success: true,
            message: 'Products inserted successfully.'
        };
    } catch (error) {
        db.exec('ROLLBACK');
        console.error('Error inserting products:', error.message);
        return {
            success: false,
            message: error.message
        };
    }
}

module.exports = {
    editProductDetails,
    addNewProduct,
    deleteProduct,
    getProductById,
    insertProducts
};