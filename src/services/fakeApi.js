var products = localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];

export function configureFakeApi() {
    const realFetch = window.fetch;

    window.fetch = function(url, options) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (url.endsWith('/products') && options.method === 'GET') {
                    if (products.length === 0) {
                        realFetch('/mock-products.json').then(res => res.json()).then(res => {
                            console.log('fetched products', res);
                            products = res;
                            localStorage.setItem('products', JSON.stringify(products));
                            resolve({ json: () =>  products });
                        });
                    } else {
                        console.log('products', products);
                        console.log('fetched products', products);
                        resolve({ json: () =>  products });
                    }
                } else if(url.endsWith('/product') && options.method === 'PUT') {
                    const newProduct = JSON.parse(options.body);
                    console.log('new product', newProduct);
                    const date = new Date().toISOString().slice(0, -5)
                    newProduct.created_at = newProduct.updated_at = date;
                    newProduct.product_id = products.length === 0 ? 0 : products[products.length - 1].product_id + 1;
                    products.push(newProduct);
                    console.log('updated products', products);
                    localStorage.setItem('products', JSON.stringify(products));
                    resolve({ json: () => newProduct });
                } else if(url.endsWith('/product') && options.method === 'POST') {
                    const updatedProduct = JSON.parse(options.body);
                    console.log('updating ', updatedProduct);
                    const index = products.findIndex(p => p.product_id === updatedProduct.product_id);
                    const date = new Date().toISOString().slice(0, -5);
                    updatedProduct.updated_at = date;
                    products[index] = {...updatedProduct};
                    console.log('updated products', products);
                    localStorage.setItem('products', JSON.stringify(products));
                    resolve({ json: () => updatedProduct });
                } else if(url.endsWith('/product') && options.method === 'DELETE') {
                    const deletedProductList = JSON.parse(options.body);
                    console.log('deleting ', deletedProductList);
                    deletedProductList.forEach((dp) => {
                        const index = products.findIndex(p => p.product_id === dp.product_id);
                        if (index > -1) {
                            products.splice(index, 1);
                        }
                    });
                    console.log('updated products', products);
                    localStorage.setItem('products', JSON.stringify(products));
                    resolve({ json: () => ({ deleted: true }) });
                } else {
                    realFetch(url, options).then(response => resolve(response)).catch(error => reject(error));
                }
            }, 1500);
        });
    }
}