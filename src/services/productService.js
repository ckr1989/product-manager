export const productService = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
};

function getProducts() {
    return fetch('/products', { method: 'GET' })
        .then(res => res.json().map(d => ({ ...d, formatted_price: +d.price.slice(0, -1), formatted_offer_price: +d.offer_price.slice(0, -1) })))
        .catch(error => {
            console.error('error');
        });
}

function createProduct(product) {
    return fetch('product', {
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
    return fetch('product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    }).then(res => res.json())
    .catch(error => {
        console.error('error');
    });
}

function deleteProduct(product) {
    return fetch('product', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    }).then(res => res.json())
    .catch(error => {
        console.error('error');
    });
}