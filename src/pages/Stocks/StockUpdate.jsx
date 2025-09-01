import React, { useState, useRef, useEffect } from "react";
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

export default function StockUpdate({ visible, onHide, stock, onUpdated, products }) {
    const toast = useRef(null);

    const [formData, setFormData] = useState({
        productId: null,
        store: null,
        quantity: ""
    });

    // Stock geldiğinde formu doldur
    useEffect(() => {
        if (stock) {
            setFormData({
                productId: stock.productId,
                store: stock.store,
                quantity: stock.quantity
            });
        }
    }, [stock]);

    const handleSave = async () => {
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
            const dto = {
                id: stock.id,
                productId: parseInt(formData.productId),
                store: formData.store,
                quantity: parseFloat(formData.quantity)
            };

            const res = await StockService.update(dto);

            if (res.success) {
                toast.current.show({
                    severity: "success",
                    summary: "Başarılı",
                    detail: res.message,
                    life: 3000
                });
                onUpdated();
                onHide();
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "Hata",
                    detail: res.message,
                    life: 3000
                });
            }
        } catch (err) {
            console.error(err);
            toast.current.show({
                severity: "error",
                summary: "Hata",
                detail: "Stok güncellenirken hata oluştu.",
                life: 3000
            });
        }
    };

    return (
        <Dialog header="Stok Güncelle" visible={visible} style={{ width: "400px" }} onHide={onHide} modal>
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
                        disabled // Ürün değiştirilemez, sadece depo ve miktar
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
            </div>

            <div className="flex gap-2 mt-3 justify-end">
                <Button label="İptal" severity="secondary" onClick={onHide} />
                <Button label="Kaydet" severity="success" onClick={handleSave} />
            </div>
        </Dialog>
    );
}
