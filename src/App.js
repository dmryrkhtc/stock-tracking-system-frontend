
import './App.css';

import React from "react";
import SidebarMenu from './components/Sidebar';
import Navbar from './components/Navbar';
import CompanyList from './pages/Companies/CompanyList';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CompanyUpdate from './pages/Companies/CompanyUpdate';
import ProductList from './pages/Products/ProductList';
import ProductUpdate from './pages/Products/ProductUpdate';
import StockList from './pages/Stocks/StockList';
import StockUpdate from './pages/Stocks/StockUpdate';
import StockMovementList from './pages/StockMovements/StockMovementList';
import StockMovementUpdate from './pages/StockMovements/StockMovementUpdate';



function App() {
  return (
   <Router>
    <Navbar/>
    <div  className='flex'>
    <SidebarMenu /> 
   
    <div className='flex-1 p-4'>
      <Routes>
       
      <Route path="/companies" element={<CompanyList />} />
      <Route path="/companies/update/:id" element={<CompanyUpdate />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/products/update/:id" element={<ProductUpdate />} />
      <Route path="/stocks" element={<StockList />} />
      <Route path="/stocks/update/:id" element={<StockUpdate />} />
      <Route path="/movements" element={<StockMovementList />} />
      <Route path="/movements/update/:id" element={<StockMovementUpdate />} />
   </Routes>
   </div>
   </div>
   </Router>
  );
}

export default App;
