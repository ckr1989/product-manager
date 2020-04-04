import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';

import { productService } from '../services/productService';
import { formatDate } from '../utils/dateUtils';
import { TextField } from '@material-ui/core';

function Table() {

    const [rows, setRows] = useState([]);

    useEffect(() => {
        productService.getProducts().then(setRows);
    }, []);

    return (
        <MaterialTable
            title="Products"
            columns={[
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
                    }
                },
                {
                    title: 'Price',
                    field: 'formatted_price',
                    type: 'currency',
                    cellStyle: {
                        width: 150,
                        minWidth: 150
                    },
                    headerStyle: {
                        width: 150,
                        minWidth: 150
                    },
                    editComponent: (props) => {
                        return <TextField type="number" defaultValue={props.value} onChange={(e) => props.onChange(e.target.value)} />
                    }
                },
                {
                    title: 'Offer Price',
                    field: 'formatted_offer_price',
                    type: 'currency',
                    cellStyle: {
                        width: 150,
                        minWidth: 150
                    },
                    headerStyle: {
                        width: 150,
                        minWidth: 150
                    }
                },
                {
                    title: 'Offer Start',
                    field: 'offer_start_at',
                    type: 'datetime',
                    render: rowData => formatDate(rowData.offer_start_at),
                    cellStyle: {
                        width: 150,
                        minWidth: 150,
                        textAlign: 'right'
                    },
                    headerStyle: {
                        width: 150,
                        minWidth: 150
                    }
                },
                {
                    title: 'Offer End',
                    field: 'offer_end_at',
                    type: 'datetime',
                    render: rowData => formatDate(rowData.offer_start_at),
                    cellStyle: {
                        width: 150,
                        minWidth: 150,
                        textAlign: 'right'
                    },
                    headerStyle: {
                        width: 150,
                        minWidth: 150
                    }
                },
                {
                    title: 'Active',
                    field: 'is_active',
                    type: 'boolean',
                    sorting: false,
                    render: rowData => rowData.is_active ? <span className="material-icons MuiIcon-root" style={{verticalAlign: 'middle'}} aria-hidden={true}>check_circle</span> : <span className="material-icons MuiIcon-root" style={{verticalAlign: 'middle'}} aria-hidden={true}>remove_circle</span>,
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
            ]}
            data={rows}
            editable={{
                onRowAdd: newData =>
                    new Promise((resolve, reject) => {
                    setTimeout(() => {
                        // const data = rows.slice();
                        // data.push(newData);
                        // setRows(data);
                        // console.log(rows);
                        // REJECT will stop the creation
                        reject();
                    }, 1000);
                }),
                onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                    setTimeout(() => {
                        const data = rows.slice();
                        const index = data.indexOf(oldData);
                        data[index] = newData;
                        setRows(data);
                        resolve()
                    }, 1000)
                }),
                onRowDelete: oldData =>
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            let data = rows.slice();
                            const index = data.indexOf(oldData);
                            data.splice(index, 1);
                            setRows(data);
                            resolve()
                        }, 1000)
                }),
            }}
            actions={[
                {
                    icon: 'delete_sweep',
                    tooltip: 'Deleted Selected',
                    onClick: (event, data) => {
                        console.log('selected rows', data);
                    }
                }
            ]}
            options={{
                actionsColumnIndex: -1,
                search: false,
                filtering: true,
                selection: true,
                tableLayout: 'auto'
            }}
        />
    );
}

export default Table;