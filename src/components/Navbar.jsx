import React from "react";
import "./Navbar.css";
import logo from "../pictures/logo.png";

function Navbar() {
    return (
        <div className="navbar">
            <div className="navbar-left">
                <img src={logo} alt="Logo" className="navbar-logo" />
                <span className="navbar-title">Stok takip sistemleri</span>
            </div>
        </div>
    );
}

export default Navbar;
