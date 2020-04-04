import React from 'react';
import './App.css';
import Table from './components/Table';

function App() {
  return (
    <>
      <header className="header">
        Product Management
      </header>
      <div className="content">
        <Table />
      </div>
    </>
  );
}

export default App;
