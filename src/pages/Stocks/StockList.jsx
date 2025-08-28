import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import StockService from "../../services/StockService";
import StockCreate from "./StockCreate";
import StockUpdate from "./StockUpdate";

export default function StockList() {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createVisible, setCreateVisible] = useState(false);
    const [updateVisible, setUpdateVisible] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);

    useEffect(() => {
        loadStocks();
    }, []);

    const loadStocks = async () => {
        setLoading(true);
        try {
            const res = await StockService.getAll();
            setStocks(res.data || []);
        } catch (err) {
            console.error("Stoklar yüklenirken hata:", err);
        } finally {
            setLoading(false);
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
                onClick={() => {
                    setSelectedStock(rowData);
                    setUpdateVisible(true);
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
                rows={5}
                responsiveLayout="scroll"
                dataKey="id"
            >
                <Column field="productId" header="Ürün ID" />
                <Column field="store" header="Depo" />
                <Column field="quantity" header="Miktar" />
                <Column body={actionBodyTemplate} header="İşlemler" />
            </DataTable>

            <StockCreate
                visible={createVisible}
                onHide={() => setCreateVisible(false)}
                onCreated={loadStocks}
            />

            {selectedStock && (
                <StockUpdate
                    visible={updateVisible}
                    onHide={() => setUpdateVisible(false)}
                    stock={selectedStock}
                    onUpdated={() => {
                        loadStocks();
                        setUpdateVisible(false);
                    }}
                />
            )}
        </div>
    );
}
