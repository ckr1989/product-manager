import React from 'react';
import { TextField } from "@material-ui/core";
import { formatDate } from "../../utils/dateUtils";
import { productService } from './productService';

export const columnConfig = [
    {
        title: 'Name',
        field: 'product_name',
        cellStyle: {
            width: 200,
            minWidth: 200
        },
        headerStyle: {
            width: 200,
            minWidth: 200
        }
    },
    {
        title: 'Description',
        field: 'product_description',
        cellStyle: {
            width: 300,
            minWidth: 300
        },
        headerStyle: {
            width: 300,
            minWidth: 300
        },
        filterCellStyle: {
            minWidth: 300
        }
    },
    {
        title: 'Price',
        field: 'formatted_price',
        type: 'currency',
        cellStyle: {
            width: 100,
            minWidth: 100
        },
        headerStyle: {
            width: 100,
            minWidth: 100,
            textAlign: 'right'
        },
        editComponent: EditPriceComponent
    },
    {
        title: 'Offer Price',
        field: 'formatted_offer_price',
        type: 'currency',
        cellStyle: {
            width: 100,
            minWidth: 100
        },
        headerStyle: {
            width: 100,
            minWidth: 100,
            textAlign: 'right'
        },
        editComponent: EditPriceComponent
    },
    {
        title: 'Offer Start',
        field: 'offer_start_at',
        type: 'datetime',
        render: rowData => formatDate(rowData.offer_start_at),
        cellStyle: {
            width: 100,
            minWidth: 100,
            textAlign: 'right'
        },
        headerStyle: {
            width: 100,
            minWidth: 100,
            textAlign: 'right'
        }
    },
    {
        title: 'Offer End',
        field: 'offer_end_at',
        type: 'datetime',
        render: rowData => formatDate(rowData.offer_end_at),
        cellStyle: {
            width: 100,
            minWidth: 100,
            textAlign: 'right'
        },
        headerStyle: {
            width: 100,
            minWidth: 100,
            textAlign: 'right'
        }
    },
    {
        title: 'Active',
        field: 'is_active',
        type: 'boolean',
        sorting: false,
        render: activeColumnRenderer,
        cellStyle: {
            width: 80,
            minWidth: 80,
            textAlign: 'center',
            verticalAlign: 'center'
        },
        headerStyle: {
            width: 80,
            minWidth: 80,
            textAlign: 'center',
            padding: '1em 0em'
        },
        filterCellStyle: {
            textAlign: 'center'
        }
    }
];

function EditPriceComponent(props) {
    return <TextField type="number" defaultValue={props.value} placeholder="Price" inputProps={{style: { textAlign: 'right', fontSize: '13px' }}} onChange={(e) => props.onChange(e.target.value)} />
}

function activeColumnRenderer(rowData) {
    return rowData.is_active ? <span className="material-icons MuiIcon-root" style={{verticalAlign: 'middle'}} aria-hidden={true}>check_circle</span> : <span className="material-icons MuiIcon-root" style={{verticalAlign: 'middle'}} aria-hidden={true}>remove_circle</span>;
}

export function onAddProduct(newData, rows) {
    return new Promise((resolve, reject) => {
        const validation = productService.validateProduct(newData, rows);
        console.log('validation message: ', validation);
        if (validation === 'success') {
            productService.createProduct(productService.formatProduct(newData)).then((product) => {
                const data = rows.slice();
                data.push(product);
                resolve(data);
            });
        } else {
            reject();
            alert(validation);
        }
    });
}

export function onUpdateProduct(newData, oldData, rows) {
    return new Promise((resolve, reject) => {
        const validation = productService.validateProduct(newData, rows);
        console.log('validation message: ', validation);
        if (validation === 'success') {
            productService.updateProduct(productService.formatProduct(newData)).then((product) => {
                const data = rows.slice();
                const index = data.indexOf(oldData);
                data[index] = product;
                resolve(data);
            });
        } else {
            reject();
            alert(validation);
        }
    });
}

export function onDeleteProduct(oldData, rows) {
    return new Promise((resolve, reject) => {
        productService.deleteProducts([oldData]).then((response) => {
            if (response.deleted === true) {
                let data = rows.slice();
                const index = data.indexOf(oldData);
                data.splice(index, 1);
                resolve(data);
            } else {
                reject();
            }
        });
    });
}

export function onDeleteMultipleProduct(toBeDeleted, rows) {
    if (Array.isArray(toBeDeleted) && toBeDeleted.length > 0) {
        return new Promise((resolve, reject) => {
            productService.deleteProducts(toBeDeleted).then((response) => {
                if (response.deleted === true) {
                    let data = rows.slice();
                    toBeDeleted.forEach((dp) => {
                        const index = data.findIndex(p => p.product_id === dp.product_id);
                        if (index > -1) {
                            data.splice(index, 1);
                        }
                    });
                    resolve(data);
                } else {
                    reject();
                }
            });
        });
    }
    return new Promise((resolve, reject) => reject());
}