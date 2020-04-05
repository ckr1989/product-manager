export const productService = {
    loadMockProducts,
    getProducts,
    createProduct,
    updateProduct,
    deleteProducts,
    formatProduct,
    validateProduct
};

function loadMockProducts() {
    return fetch('/mock-products.json').then(res => res.json())
        .then(mockProducts => {
            localStorage.setItem('products', JSON.stringify(mockProducts));
            console.log('mokc products', mockProducts);
            return mockProducts.map(d => {
                return { ...d, formatted_price: +d.price.slice(0, -1), formatted_offer_price: +d.offer_price.slice(0, -1) }
            });
        });
}

function getProducts() {
    return fetch('/products', { method: 'GET' })
        .then(res => res.json().map(d => {
            return { ...d, formatted_price: +d.price.slice(0, -1), formatted_offer_price: +d.offer_price.slice(0, -1) }
        }))
        .catch(error => {
            console.error('error');
        });
}

function createProduct(product) {
    return fetch('/product', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    })
    .then(res => res.json())
    .catch(error => {
        console.error('error');
    });
}

function updateProduct(product) {
    return fetch('/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    }).then(res => res.json())
    .catch(error => {
        console.error('error');
    });
}

function deleteProducts(product) {
    return fetch('/product', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    }).then(res => res.json())
    .catch(error => {
        console.error('error');
    });
}

function formatProduct(product) {
    if (product) {
        if (product.is_active !== true) {
            product.is_active = false;
        }
        if (product.formatted_price) {
            product.price = product.formatted_price + '$';
        }
        if (product.formatted_offer_price) {
            product.offer_price = product.formatted_offer_price + '$';
        }
        if (product.offer_start_at) {
            product.offer_start_at = new Date(product.offer_start_at).toISOString().slice(0, -5);
        }
        if (product.offer_end_at) {
            product.offer_end_at = new Date(product.offer_end_at).toISOString().slice(0, -5);
        }
    }
    return product;
}

function validateProduct(product, allProducts) {
    console.log('validating product', product);
    if (Object.keys(product).length > 0) {
        if (!product.product_name) {
            return 'Product Name is empty';
        } else if (allProducts.findIndex(p => p.product_id !== product.product_id && p.product_name === product.product_name) > -1) {
            return 'A product with the name ' + product.product_name + ' already exists';
        } else if (!product.product_description) {
            return 'Product description is empty';
        } else if (!+product.formatted_price) {
            return 'Enter a valid price for the Product';
        } else if (!+product.formatted_offer_price) {
            return 'Enter a valid offer price for the Product';
        } else if (!product.offer_start_at) {
            return 'Enter a valid offer start date for the Product';
        } else if (!product.offer_end_at) {
            return 'Enter a valid offer end date for the Product';
        } else if (product.offer_start_at && product.offer_end_at && new Date(product.offer_start_at).getTime() > new Date(product.offer_end_at).getTime()) {
            return 'The offer end date is earlier than offer start date';
        }
        return 'success';
    }
    return 'Enter all required values to add the Product';
}