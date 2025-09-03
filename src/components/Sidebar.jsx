import React, { useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function SidebarMenu() {
    const [visible, setVisible] = useState(false);

    const handleLinkClick = () => {
        setVisible(false);
    };

    return (
        <div>
            {/* Toggle butonu */}

            <Button
                icon="pi pi-bars"
                className="menu-toggle-btn p-button-text p-button-plain"
                onClick={() => setVisible(!visible)} // toggle eklendi
            />


            <Sidebar
                visible={visible}
                onHide={() => setVisible(false)}
                position="left"  // soldan açılıyor
                className="custom-sidebar"
                modal={true}      // overlay gibi açılıyor
                baseZIndex={1000}
            >
                <div className="sidebar-header">
                    Menu
                </div>

                <div className="sidebar-user">
                    <p><strong>Hatice Demiryürek</strong></p>
                </div>

                <ul className="sidebar-links">
                    <li>
                        <Link to="/" onClick={handleLinkClick}>
                            <i className="pi pi-home"></i> Anasayfa
                        </Link>
                    </li>
                    <li>
                        <Link to="/companies" onClick={handleLinkClick}>
                            <i className="pi pi-building"></i> Şirketler
                        </Link>
                    </li>
                    <li>
                        <Link to="/products" onClick={handleLinkClick}>
                            <i className="pi pi-box"></i> Ürünler
                        </Link>
                    </li>
                    <li>
                        <Link to="/stocks" onClick={handleLinkClick}>
                            <i className="pi pi-database"></i> Stoklar
                        </Link>
                    </li>
                    <li>
                        <Link to="/movements" onClick={handleLinkClick}>
                            <i className="pi pi-info-circle"></i> Stok Hareketleri
                        </Link>
                    </li>
                </ul>
            </Sidebar>
        </div>
    );
}

export default SidebarMenu;
