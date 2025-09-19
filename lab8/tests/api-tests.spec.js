const fs = require('fs');
const Ajv = require('ajv');
const ProductApi = require('./product_api');

const testData = JSON.parse(fs.readFileSync('config/test-values.json', 'utf-8'));
const schema = JSON.parse(fs.readFileSync('config/schema.json', 'utf8'));

const productApi = new ProductApi();
const ajv = new Ajv();
const validate = ajv.compile(schema);

function CheckProduct(obj1, obj2) {
    const jsonString1 = JSON.stringify(obj1).slice(JSON.stringify(obj1).indexOf(',') + 1);
    const jsonString2 = JSON.stringify(obj2).slice(1);
    return jsonString1 == jsonString2;
}

function addingProductTestFailure(testName, productData, status) {
    test(testName, async () => {
        const allProductsCount = await productApi.getProductsCount();

        await productApi.addProductRequest(productData, status);

        const allProductsCountNew =  await productApi.getProductsCount();

        expect(allProductsCountNew).toBe(allProductsCount);
    }, 10000);
}

function addingProductTestSuccess(testName, productData) {
    test(testName, async () => {
        const allProductsCount = await productApi.getProductsCount();

        await productApi.addProductRequest(productData, 1);

        await productApi.deleteProductRequest(productApi.addedProductId, 1);

        const allProductsCountNew = await productApi.getProductsCount();
        expect(allProductsCountNew).toBe(allProductsCount);
    }, 10000);
}

function deleteProductTestFailure(testName, id) {
    test(testName, async () => {
        await productApi.deleteProductRequest(id, 0);
    });
}

describe("Test", () => {
    test('Adding correct product and deleting it', async () => {
        const productData = testData.correctProduct;
        await productApi.addProductRequest(productData, 1);

        const addedProduct = await productApi.getLastAddedProduct();
        expect(validate(addedProduct)).toBe(true);
        expect(CheckProduct(addedProduct, productData)).toBe(true);

        await productApi.deleteProductRequest(productApi.addedProductId, 1);

        const allProductsCountNew =  await productApi.getProductsCount();
        expect(allProductsCountNew + 1).toBe(productApi.allProductsCount);
    }, 10000);

    test('Adding correct product with a valid 15-character category and deleting it', async () => {
        const productData = testData.productWithValid15Category;
        await productApi.addProductRequest(productData, 1);

        const addedProduct = await productApi.getLastAddedProduct();
        expect(validate(addedProduct)).toBe(true);

        await productApi.deleteProductRequest(productApi.addedProductId, 1);

        const allProductsCountNew =  await productApi.getProductsCount();
        expect(allProductsCountNew).toBe(productApi.allProductsCount);
    }, 10000);

    test('Adding correct product with same alias and deleting it', async () => {
        
        const productData = testData.correctProduct;

        await productApi.addProductRequest(productData, 1);
        const addedProductId1 = productApi.addedProductId;
        const addedProduct1 = await productApi.getLastAddedProduct();
        expect(validate(addedProduct1)).toBe(true);

        await productApi.addProductRequest(productData, 1);
        const addedProductId2 = productApi.addedProductId;
        const addedProduct2 = await productApi.getLastAddedProduct();
        expect(validate(addedProduct2)).toBe(true);

        expect(addedProduct1.alias).toBe(productData.alias);
        expect(addedProduct2.alias).toBe(productData.alias + '-0');

        await productApi.deleteProductRequest(addedProductId1, 1);
        await productApi.deleteProductRequest(addedProductId2, 1);
    }, 10000);

    test('Edit existing product', async () => {
        const productData = testData.correctProduct;
        await productApi.addProductRequest(productData, 1);

        const addedProduct = await productApi.getLastAddedProduct();
        expect(validate(addedProduct)).toBe(true);
        expect(CheckProduct(addedProduct, productData)).toBe(true);

        let editedProductData = testData.correctProductEdited;
        editedProductData.id = productApi.addedProductId;
        await productApi.editProductRequest(editedProductData, 1);
        delete editedProductData.id;

        const editedProduct = await productApi.getLastAddedProduct();
        expect(validate(editedProduct)).toBe(true);
        expect(CheckProduct(editedProduct, editedProductData)).toBe(true);

        await productApi.deleteProductRequest(productApi.addedProductId, 1);
        const allProductsCountNew =  await productApi.getProductsCount();
        expect(allProductsCountNew + 1).toBe(productApi.allProductsCount);
    }, 10000);

    test('Edit existing product with alias already is used', async () => {
        const productDataEdited = testData.correctProductEdited;
        await productApi.addProductRequest(productDataEdited, 1);
        const addedEditedProductId = productApi.addedProductId;

        const addedEditedProduct1 = await productApi.getLastAddedProduct();
        expect(validate(addedEditedProduct1)).toBe(true);
        expect(CheckProduct(addedEditedProduct1, productDataEdited)).toBe(true);
    
        const productData = testData.correctProduct;
        await productApi.addProductRequest(productData, 1);

        const addedProduct = await productApi.getLastAddedProduct();
        expect(validate(addedProduct)).toBe(true);
        expect(CheckProduct(addedProduct, productData)).toBe(true);

        let editedProductData = testData.correctProductEdited;
        editedProductData.id = productApi.addedProductId;
        await productApi.editProductRequest(editedProductData, 1);

        editedProductData.alias += `-${editedProductData.id}`;
        delete editedProductData.id;

        const editedProduct = await productApi.getLastAddedProduct();
        expect(validate(editedProduct)).toBe(true);
        expect(CheckProduct(editedProduct, editedProductData)).toBe(true);

        await productApi.deleteProductRequest(addedEditedProductId, 1);
        await productApi.deleteProductRequest(productApi.addedProductId, 1);

        const allProductsCountNew = await productApi.getProductsCount();
        expect(allProductsCountNew + 2).toBe(productApi.allProductsCount);
    }, 15000);

    test('Edit only price of existing product', async () => {
        const productData = testData.correctProduct;
        await productApi.addProductRequest(productData, 1);

        const addedProduct = await productApi.getLastAddedProduct();
        expect(validate(addedProduct)).toBe(true);
        expect(CheckProduct(addedProduct, productData)).toBe(true);

        let editedProductData = testData.editPriceProduct;
        editedProductData.id = productApi.addedProductId;
        await productApi.editProductRequest(editedProductData, undefined);

        const editedProduct = await productApi.getLastAddedProduct();
        expect(CheckProduct(editedProduct, productData)).toBe(true);

        await productApi.deleteProductRequest(productApi.addedProductId, 1);

        const allProductsCountNew = await productApi.getProductsCount();
        expect(allProductsCountNew + 1).toBe(productApi.allProductsCount);
    }, 15000);

    addingProductTestFailure('Adding incorrect product with invalid price', testData.productWithStringPrice, undefined);
    addingProductTestFailure('Adding incorrect product with negative price', testData.productWithNegativePrice, undefined);
    addingProductTestFailure('Adding incorrect product with null category', testData.productWithNullCategory, undefined);
    addingProductTestFailure('Adding incorrect product with missing props', testData.productWithMissingProps, undefined);
    addingProductTestFailure('Adding empty product', testData.emptyProduct, undefined);
    addingProductTestFailure('Adding null product', testData.nullProduct, 0);

    addingProductTestSuccess('Adding incorrect product with invalid 0 category', testData.productWithInvalid0Category);
    addingProductTestSuccess('Adding incorrect product with invalid 16 category', testData.productWithInvalid16Category);
    addingProductTestSuccess('Adding incorrect product with null status', testData.productWithNullStatus);
    addingProductTestSuccess('Adding incorrect product with invalid status', testData.productWithInvalidStatus);
    addingProductTestSuccess('Adding incorrect product with null hit', testData.productWithNullHit);
    addingProductTestSuccess('Adding incorrect product with invalid hit', testData.productWithInvalidHit);
    addingProductTestSuccess('Adding incorrect product with invalid id', testData.productWithInvalidId);

    deleteProductTestFailure('Deleting non-existing product', 1000000);
    deleteProductTestFailure('Deleting product with invalid id', "id");
});
