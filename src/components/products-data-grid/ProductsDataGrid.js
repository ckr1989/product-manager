import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';

import { productService } from './productService';
import { columnConfig, onAddProduct, onUpdateProduct, onDeleteProduct, onDeleteMultipleProduct } from './productsDataGridHelpers';

export function ProductsDataGrid() {

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        productService.getProducts().then(products => {
            setRows(products);
            setLoading(false);
        });
    }, []);

    return (
        <MaterialTable
            isLoading={loading}
            title="Products"
            columns={columnConfig}
            data={rows}
            editable={{
                onRowAdd: newData => onAddProduct(newData, rows).then(setRows),
                onRowUpdate: (newData, oldData) => onUpdateProduct(newData, oldData, rows).then(setRows),
                onRowDelete: oldData => onDeleteProduct(oldData, rows).then(setRows),
            }}
            actions={[
                {
                    icon: 'cloud_download',
                    tooltip: 'Download dummy data',
                    isFreeAction: true,
                    onClick: (event) => {
                        setLoading(true);
                        const userResponse = window.confirm('This will load mock products and replace the existing set, Are you sure?');
                        if (userResponse) {
                            productService.loadMockProducts().then(products => {
                                setRows(products);
                                setLoading(false);
                            });
                        } else {
                            setLoading(false);
                        }
                    }
                },
                {
                    icon: 'delete_sweep',
                    tooltip: 'Delete all selected products',
                    onClick: (event, data) => {
                        setLoading(true);
                        const userResponse = window.confirm('Are you sure you want to delete '+data.length+' rows?');
                        if (userResponse) {
                            onDeleteMultipleProduct(data, rows).then((updateRows) => {
                                setRows(updateRows);
                                setLoading(false);
                            });
                        } else {
                            setLoading(false);
                        }
                    }
                }
            ]}
            options={{
                actionsColumnIndex: -1,
                search: false,
                filtering: true,
                selection: true,
                selectionProps: (rowData) => ({ color: 'primary' }),
                tableLayout: 'auto'
            }}
        />
    );
}
