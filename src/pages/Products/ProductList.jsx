import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import ProductService from "../../services/ProductService";
import ProductCreate from "./ProductCreate";
import ProductUpdate from "./ProductUpdate";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [createVisible, setCreateVisible] = useState(false);
    const [updateVisible, setUpdateVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const res = await ProductService.getAll();
            setProducts(res.data || []);
        } catch (err) {
            console.error("Ürünler yüklenirken hata:", err);
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        if (window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
            try {
                await ProductService.delete(id);
                loadProducts();
            } catch (err) {
                console.error("Ürün silinirken hata:", err);
            }
        }
    };

    const actionBodyTemplate = (rowData) => (
        <div className="flex gap-2">
            <Button
                label="Güncelle"
                icon="pi pi-pencil"
                className="p-button-warning"
                onClick={() => {
                    setSelectedProduct(rowData);
                    setUpdateVisible(true);
                }}
            />
            <Button
                label="Sil"
                icon="pi pi-trash"
                className="p-button-danger"
                onClick={() => deleteProduct(rowData.id)}
            />
        </div>
    );

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-3">
                <h1>Ürünler</h1>
                <Button
                    label="Yeni Ürün Ekle"
                    icon="pi pi-plus"
                    onClick={() => setCreateVisible(true)}
                />
            </div>

            <DataTable
                value={products}
                loading={loading}
                paginator
                rows={5}
                responsiveLayout="scroll"
                dataKey="id"
            >
                <Column field="name" header="Ürün İsmi" />
                <Column field="barcode" header="Barkod" />
                <Column field="unit" header="Birim" />
                <Column field="price" header="Fiyat" />
                <Column field="companyName" header="Şirket" />
                <Column body={actionBodyTemplate} header="İşlemler" />
            </DataTable>

            {/* Create Modal */}
            <ProductCreate
                visible={createVisible}
                onHide={() => setCreateVisible(false)}
                onCreated={loadProducts}
            />

            {/* Update Modal */}
            {selectedProduct && (
                <ProductUpdate
                    visible={updateVisible}
                    onHide={() => {
                        setUpdateVisible(false);
                        setSelectedProduct(null);
                    }}
                    product={selectedProduct}
                    onUpdated={() => {
                        loadProducts();
                        setUpdateVisible(false);
                        setSelectedProduct(null);
                    }}
                />
            )}
        </div>
    );
}
