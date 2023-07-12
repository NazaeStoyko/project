const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String
    },
    productDiagonal: {
        type: String
    },
    productMatrix: {
        type: String
    },
    productFormat: {
        type: String
    },
    productInterf: {
    type: String
    },
    productImage: {
        type:String
    },
    cloudinaryPublicId: {
        type:String
    }
});

const ProductModel = mongoose.model('ProductModel', productSchema, "monitorProducts");
module.exports = ProductModel;