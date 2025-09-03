import React, { useState, useRef } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import StockService from "../../services/StockService";

// Sabit depo seçenekleri
const STORE_OPTIONS = [
    { label: "Market", value: "Market" },
    { label: "Depo", value: "Depo" },

];
const UNIT_OPTIONS = [
    { label: "Adet", value: 2 },
    { label: "Kilogram", value: 0 },
    { label: "Litre", value: 1 }
];

export default function StockCreate({ visible, onHide, onCreated, products }) {
    const toast = useRef(null);

    const [formData, setFormData] = useState({
        productId: null,
        store: null,
        quantity: ""
    });

    const handleSave = async () => {
        // Boş veya hatalı alan kontrolü
        if (!formData.productId || !formData.store || !formData.quantity || parseFloat(formData.quantity) <= 0) {
            toast.current.show({
                severity: "warn",
                summary: "Uyarı",
                detail: "Lütfen tüm alanları doldurun ve miktar 0'dan büyük olmalı!",
                life: 3000
            });
            return;
        }

        try {
            // Backend uyumlu DTO
            const dto = {
                productId: parseInt(formData.productId),
                store: formData.store,            // string: "Market", "Depo"
                quantity: parseFloat(formData.quantity),
                unit: formData.unit
            };

            const res = await StockService.create(dto);
            console.log("RES : ", res);
            if (res.data.success) {
                toast.current.show({
                    severity: "success",
                    summary: "Başarılı",
                    detail: res.message,
                    life: 3000
                });
                onCreated();
                onHide();
                setFormData({ productId: null, store: null, quantity: "" });
            } else {
                console.log("Else : ", res.data);
                toast.current.show({
                    severity: "error",
                    summary: "Hata",
                    detail: res.data.message,
                    life: 3000
                });
            }
        } catch (err) {
            console.error(err);
            toast.current.show({
                severity: "error",
                summary: "Hata",
                detail: "Stok eklenirken hata oluştu.",
                life: 3000
            });
        }
    };

    return (
        <Dialog header="Yeni Stok Ekle" visible={visible} style={{ width: "400px" }} onHide={onHide} modal>
            <Toast ref={toast} />
            <div className="p-fluid">
                <div className="field">
                    <label>Ürün</label>
                    <Dropdown
                        value={formData.productId}
                        options={products || []}
                        optionLabel="name"
                        optionValue="id"
                        onChange={(e) => setFormData({ ...formData, productId: e.value })}
                        placeholder="Ürün seçiniz"
                    />
                </div>

                <div className="field">
                    <label>Miktar</label>
                    <input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className="p-inputtext p-component"
                        min={1}
                    />
                </div>
                <div className="field">
                    <label>Birim</label>
                    <Dropdown
                        value={formData.unit}
                        options={UNIT_OPTIONS}
                        optionLabel="label"
                        optionValue="value"
                        onChange={(e) => setFormData({ ...formData, unit: e.value })}
                        placeholder="Birim seçiniz"
                    />
                </div>


                <div className="field">
                    <label>Depo</label>
                    <Dropdown
                        value={formData.store}
                        options={STORE_OPTIONS}
                        optionLabel="label"
                        optionValue="value"
                        onChange={(e) => setFormData({ ...formData, store: e.value })}
                        placeholder="Depo seçiniz"
                    />
                </div>

            </div>

            <div className="flex gap-2 mt-3 justify-end">
                <Button label="Kaydet" severity="success" onClick={handleSave} /><Button label="İptal" severity="secondary" onClick={onHide} />

            </div>
        </Dialog>
    );
}
