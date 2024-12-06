const adminModel = require('../models/admin.model');
const shopModel = require('../models/shop.model');
const fs = require('fs');


function showCreateProductPage(req, res) {
    res.render('admin/createNewProduct');
}

function showAdminPage(req, res) {
    const products = shopModel.getAllProducts();
    res.render('admin/admin', {
        products
    });
}


function showBulkUploadPage(req, res) {
    res.render('admin/bulk-upload', {
        instructions: "Please upload a JSON file containing an array of products. Each product should include at least the 'name', 'artist', 'price', and 'category_id' fields."
    });
}

function handleBulkUpload(req, res) {
    const file = req.file;

    if (!file) {
        return res.status(400).send("No file uploaded. Please upload a JSON file.");
    }

    const filePath = file.path;

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send("Error reading the file.");
        }

        try {
            const products = JSON.parse(data);

            if (!Array.isArray(products) || products.length === 0) {
                throw new Error("Invalid file format. JSON should contain an array of products.");
            }

            const validProducts = products.filter(product =>
                product.name && product.price && product.artist && product.category_id
            );

            if (validProducts.length === 0) {
                throw new Error("No valid products found in the uploaded file.");
            }

            const result = adminModel.insertProducts(validProducts);

            if (result.success) {
                res.redirect('/admin/products');
            } else {
                res.status(500).send(`Error inserting products: ${result.message}`);
            }
        } catch (error) {
            res.status(400).send(`Invalid file format: ${error.message}`);
        } finally {
            fs.unlink(filePath, err => {
                if (err) console.error("Error deleting file:", err);
            });
        }
    });
}

function showEditProductPage(req, res) {
    const params = {
        id: req.params.id
    }

    const product = adminModel.getProductById(params.id);
    res.render('admin/edit-product', {
        product
    });
};

function deleteProduct(req, res) {
    const params = {
        id: parseInt(req.body.id)
    };

    adminModel.deleteProduct(params);
    res.redirect('/admin/products');
}


function updateProduct(req, res) {
    const params = {
        id: parseInt(req.body.id),
        name: req.body.name,
        description: req.body.description,
        artist: req.body.artist,
        category_id: req.body.category_id,
        image_url: req.body.image_url,
        price: parseFloat(req.body.price)
    };
    console.log(req.body);
    adminModel.editProductDetails(params);
    res.redirect('/admin/products');
}

function createNewProduct(req, res) {
    const params = {
        id: parseInt(req.body.id),
        name: req.body.name,
        artist: req.body.artist,
        description: req.body.description,
        category_id: req.body.category_id,
        image_url: req.body.image_url,
        price: parseFloat(req.body.price)
    };

    console.log("Params: ", params);
    console.log("Received Form Data:", req.body);


    const created = adminModel.addNewProduct(params);
    if (!created) {
        alert("Something went wrong. Please try again.");
    }
    res.redirect("/admin/products");
}


module.exports = {
    showCreateProductPage,
    showBulkUploadPage,
    handleBulkUpload,
    showAdminPage,
    showEditProductPage,
    deleteProduct,
    updateProduct,
    createNewProduct
};