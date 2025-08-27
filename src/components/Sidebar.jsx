import React, { useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import "./Sidebar.css";
import { Link } from "react-router-dom";

function SidebarMenu() {
    const [visible, setVisible] = useState(false);

    return (
        <div className="sidebar-container">
            {/* Açma butonu */}
            <Button
                icon="pi pi-bars"
                className="p-button-text menu-toggle-btn"
                onClick={() => setVisible(true)}
            />

            {/* Sidebar */}
            <Sidebar
                visible={visible}
                onHide={() => setVisible(false)}
                position="left"
                className="custom-sidebar"
                modal={false}   // modal=false olunca üst üste binmez
                baseZIndex={0}  // navbar üstünde değil, kenarda
            >
                <div className="sidebar-header">
                    <h2>Menu</h2>
                </div>
                {/* Kullanıcı alanı */}
                <div className="sidebar-user">
                    <p> <strong>Hatice Demiryürek</strong></p>

                </div>
                <ul className="sidebar-links">
                    <li>
                        <Link to="/">
                            <i className="pi pi-home"></i> Anasayfa
                        </Link>
                    </li>
                    <li>
                        <Link to="/companies">
                            <i className="pi pi-building"></i> Şirketler
                        </Link>
                    </li>
                    <li>
                        <Link to="/products">
                            <i className="pi pi-box"></i> Ürünler
                        </Link>
                    </li>
                    <li>
                        <Link to="/stocks">
                            <i className="pi pi-database"></i> Stoklar
                        </Link>
                    </li>
                    <li>
                        <Link to="/movements">
                            <i className="pi pi-info-circle"></i> Stok Hareketleri
                        </Link>
                    </li>
                </ul>
            </Sidebar>
        </div>
    );
}

export default SidebarMenu;
