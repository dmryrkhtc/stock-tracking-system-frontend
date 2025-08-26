
import './App.css';

import React from "react";
import SidebarMenu from './components/Sidebar';
import Navbar from './components/Navbar';


function App() {
  return (
   <div>
    <Navbar/>
    
    <SidebarMenu />
      <div style={{ marginLeft: "240px", padding: "20px" }}>
       
        <h1>Dashboard content burada olacak... sonrasında eklemeler olacak</h1>
      </div>
 
   
   </div>
  );
}

export default App;
