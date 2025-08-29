import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import StockMovementService from "../../services/StockMovementService";
import StockMovementUpdate from "./StockMovementUpdate";
import StockMovementCreate from "./StockMovementCreate";

export default function StockMovementList() {
    const [movements, setMovements] = useState([]);
    const [selectedMovement, setSelectedMovement] = useState(null);
    const [showUpdate, setShowUpdate] = useState(false);
    const [showCreate, setShowCreate] = useState(false);

    const fetchMovements = () => {
        StockMovementService.getAll().then((res) => setMovements(res.data));
    };

    useEffect(() => {
        fetchMovements();
    }, []);

    const deleteStockMovement = async (id) => {
        if (window.confirm("Bu hareketi silmek istediğinize emin misiniz?")) {
            try {
                await StockMovementService.delete(id);
                fetchMovements();
            } catch (err) {
                console.error("Silme hatası", err);
            }
        }
    };

    return (
        <div>
            <Button label="Yeni Hareket" icon="pi pi-plus" onClick={() => setShowCreate(true)} />

            {showCreate && (
                <StockMovementCreate
                    onCreated={() => {
                        setShowCreate(false);
                        fetchMovements();
                    }}
                />
            )}

            {showUpdate && selectedMovement && (
                <StockMovementUpdate
                    movement={selectedMovement}
                    onUpdated={() => {
                        setShowUpdate(false);
                        fetchMovements();
                    }}
                />
            )}

            <DataTable value={movements} paginator rows={10}>
                <Column field="productName" header="Ürün" />
                <Column field="store" header="Depo" />
                <Column field="type" header="Tip" />
                <Column field="quantity" header="Miktar" />
                <Column
                    field="date"
                    header="Tarih"
                    body={(row) => new Date(row.date).toLocaleDateString()}
                />
                <Column
                    body={(row) => (
                        <>
                            <Button
                                label="Düzenle"
                                icon="pi pi-pencil"
                                className="p-button-text p-button-sm"
                                onClick={() => {
                                    setSelectedMovement(row);
                                    setShowUpdate(true);
                                }}
                            />
                            <Button
                                label="Sil"
                                icon="pi pi-trash"
                                className="p-button-text p-button-sm p-button-danger"
                                onClick={() => deleteStockMovement(row.id)}
                            />
                        </>
                    )}
                />
            </DataTable>
        </div>
    );
}
