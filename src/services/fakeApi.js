import data from '../data/products';

var products = [];

export function configureFakeApi() {
    const realFetch = window.fetch;

    window.fetch = function(url, options) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (url.endsWith('/products') && options.method === 'GET') {
                    if (products.length === 0) {
                        products = data.map(d => d);
                    }
                    console.log(products);
                    resolve({ json: () =>  products });
                } else if(url.endsWith('/product') && options.method === 'PUT') {
                    const newProduct = JSON.parse(options.body);
                    const date = new this.Date().toISOString().slice(0, -5)
                    newProduct.created_at = newProduct.updated_at = date;
                    newProduct.product_id = products[products.length - 1].product_id + 1;
                    products.push(newProduct);
                    resolve({ json: () => newProduct });
                } else if(url.endsWith('/product') && options.method === 'POST') {
                    const updatedProduct = JSON.parse(options.body);
                    const index = products.findIndex(p => p.product_id === updatedProduct.product_id);
                    const date = new this.Date().toISOString().slice(0, -5);
                    updatedProduct.updated_at = date;
                    products[index] = {...updatedProduct};
                    resolve({ json: () => updatedProduct });
                } else if(url.endsWith('/product') && options.method === 'DELETE') {
                    const deletedProductList = JSON.parse(options.body);
                    deletedProductList.forEach((dp) => {
                        const index = products.findIndex(p => p.product_id === dp.product_id);
                        if (index > -1) {
                            products.splice(index, 1);
                        }
                    });
                    resolve({ json: () => ({ deleted: true }) });
                } else {
                    realFetch(url, options).then(response => resolve(response)).catch(error => reject(error));
                }
            }, 1000);
        });
    }
}