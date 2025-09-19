const axios = require('axios');
const BASE_URL = "http://shop.qatl.ru/";
const LIST_PRODUCTS_URI = 'api/products';
const ADD_PRODUCT_URI = 'api/addproduct';
const EDIT_PRODUCT_URI = 'api/editproduct';
const DELETE_PRODUCT_URI = 'api/deleteproduct';

class ProductApi {
    constructor(addedProductId, allProductsCount) {
        this.addedProductId = addedProductId;
        this.allProductsCount = allProductsCount;
    }

    async addProductRequest(product, status) {
        const addProductResponse = await axios.post(`${BASE_URL + ADD_PRODUCT_URI}`, product);
        expect(addProductResponse.data.status).toBe(status);
        if (status != undefined) {
            this.addedProductId = addProductResponse.data.id;
        }
    }
    
    async deleteProductRequest(productId, status) {
        const deleteProductResponse = await axios.get(`${BASE_URL + DELETE_PRODUCT_URI}?id=${productId}`);
        expect(deleteProductResponse.data.status).toBe(status);
    }
    
    async editProductRequest(product, status) {
        const editProductResponse = await axios.post(`${BASE_URL + EDIT_PRODUCT_URI}`, product);
        expect(editProductResponse.data.status).toBe(status);
    }
    
    async getAllProductRequest() {
        const getAllProductsResponse = await axios.get(`${BASE_URL + LIST_PRODUCTS_URI}`);
        expect(getAllProductsResponse.status).toBe(200);
        return getAllProductsResponse.data;
    }

    async getLastAddedProduct() {
        const allProductsResponse = await this.getAllProductRequest();
        this.allProductsCount = allProductsResponse.length;
        return allProductsResponse[this.allProductsCount - 1];
    }

    async getProductsCount() {
        return (await this.getAllProductRequest()).length;
    }
}

module.exports = ProductApi;