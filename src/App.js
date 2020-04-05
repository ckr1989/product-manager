import React from 'react';
import './App.css';
import { ProductsDataGrid } from './components/products-data-grid';
import { Header } from './components/app-header';

function App() {
  return (
    <>
      <Header />
      <div className="content">
        <ProductsDataGrid />
      </div>
    </>
  );
}

export default App;
