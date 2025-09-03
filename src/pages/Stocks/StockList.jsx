import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import StockService from "../../services/StockService";
import ProductService from "../../services/ProductService";
import StockCreate from "./StockCreate";
import StockUpdate from "./StockUpdate";
import { STORE_OPTIONS } from "../../constants/enums";

export default function StockList() {
    const [stocks, setStocks] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createVisible, setCreateVisible] = useState(false);
    const [updateVisible, setUpdateVisible] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);
    const UNIT_MAP = {
        Piece: "Adet",
        Kg: "Kilogram",
        Liter: "Litre"
    };
    useEffect(() => {
        loadStocks();
        loadProducts();
    }, []);
    //idye göre sıralandı buyukten kucuge
    const loadStocks = async () => {
        setLoading(true);
        try {
            const res = await StockService.getAll();
            const sortedStocks = (res.data || []).sort((a, b) => b.id - a.id);
            setStocks(sortedStocks);
        } catch (err) {
            console.error("Stoklar yüklenirken hata:", err);
        } finally {
            setLoading(false);
        }
    };


    const loadProducts = async () => {
        try {
            const res = await ProductService.getAll();
            setProducts(res.data || []);
        } catch (err) {
            console.error("Ürünler yüklenirken hata:", err);
            setProducts([]);
        }
    };

    const deleteStock = async (id) => {
        if (window.confirm("Bu stoku silmek istediğinize emin misiniz?")) {
            try {
                await StockService.delete(id);
                loadStocks();
            } catch (err) {
                console.error("Stok silinirken hata:", err);
            }
        }
    };

    const actionBodyTemplate = (rowData) => (
        <div className="flex gap-2">
            <Button
                label="Güncelle"
                icon="pi pi-pencil"
                className="p-button-warning"
                onClick={async () => {
                    try {
                        const res = await StockService.getById(rowData.id);
                        if (res.data) {
                            setSelectedStock(res.data); // ✅ DTO’yu direkt gönder
                            setUpdateVisible(true);
                        } else {
                            alert("Stok bulunamadı");
                        }
                    } catch (err) {
                        console.error("Stok yüklenirken hata:", err);
                    }
                }}
            />

            <Button
                label="Sil"
                icon="pi pi-trash"
                className="p-button-danger"
                onClick={() => deleteStock(rowData.id)}
            />
        </div>
    );

    const storeBodyTemplate = (rowData) => {
        const store = STORE_OPTIONS.find(s => s.value === rowData.store);
        return store ? store.label : rowData.store;
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-3">
                <h1>Stoklar</h1>
                <Button
                    label="Yeni Stok Ekle"
                    icon="pi pi-plus"
                    onClick={() => setCreateVisible(true)}
                />
            </div>

            <DataTable
                value={stocks}
                loading={loading}
                paginator
                rows={10}
                responsiveLayout="scroll"
                dataKey="id"
            >
                <Column field="productName" header="Ürün Adı" />
                <Column field="quantity" header="Miktar" />
                <Column field="unit" header="Birim" body={(rowData) => UNIT_MAP[rowData.unit] || rowData.unit} />
                <Column field="store" header="Depo" body={storeBodyTemplate} />

                <Column body={actionBodyTemplate} header="İşlemler" />
            </DataTable>

            <StockCreate
                visible={createVisible}
                onHide={() => setCreateVisible(false)}
                onCreated={loadStocks}
                products={products || []}
            />

            {selectedStock && (
                <StockUpdate
                    visible={updateVisible}
                    onHide={() => setUpdateVisible(false)}
                    stock={selectedStock}
                    onUpdated={loadStocks}
                    products={products || []}
                />
            )}
        </div>
    );
}