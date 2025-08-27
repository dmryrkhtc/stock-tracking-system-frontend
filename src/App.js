
import './App.css';

import React from "react";
import SidebarMenu from './components/Sidebar';
import Navbar from './components/Navbar';
import CompanyList from './pages/Companies/CompanyList';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CompanyUpdate from './pages/Companies/CompanyUpdate';



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
      
   </Routes>
   </div>
   </div>
   </Router>
  );
}

export default App;
