import React, { useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import "./Sidebar.css";

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
                <ul className="sidebar-links">
                    <li><i className="pi pi-home"></i> Anasayfa</li>
                    <li><i className="pi pi-box"></i> Ürünler</li>
                    <li><i className="pi pi-database"></i> Stoklar</li>
                    <li><i className="pi pi-info-circle"></i> Stok Hareketleri</li>
                </ul>
            </Sidebar>
        </div>
    );
}

export default SidebarMenu;
