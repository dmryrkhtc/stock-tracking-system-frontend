import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import StockService from "../../services/StockService";
import { STORE_OPTIONS } from "../../constants/enums";
import { Dialog } from "primereact/dialog";

export default function StockCreate({ visible, onHide, onCreated = () => { } }) {
    const [formData, setFormData] = useState({
        productId: "",
        store: null,
        quantity: 0,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            if (!formData.productId || formData.store === null || !formData.quantity) {
                alert("Lütfen tüm alanları doldurun!");
                return;
            }
            await StockService.create(formData);
            onCreated(); // parent component’i bilgilendir
            onHide();
        } catch (err) {
            console.error("Stok eklenirken hata:", err);
        }
    };

    return (
        <Dialog header="Yeni Stok Ekle" visible={visible} style={{ width: '400px' }} onHide={onHide} modal>
            <div className="p-fluid">
                <div className="field">
                    <label htmlFor="productId">Ürün ID</label>
                    <InputText
                        id="productId"
                        name="productId"
                        value={formData.productId}
                        onChange={handleChange}
                    />
                </div>

                <div className="field">
                    <label htmlFor="store">Depo</label>
                    <Dropdown
                        value={formData.store}
                        options={STORE_OPTIONS}
                        onChange={(e) => setFormData({ ...formData, store: e.value })}
                        placeholder="Depo seçiniz"
                    />
                </div>

                <div className="field">
                    <label htmlFor="quantity">Miktar</label>
                    <InputText
                        id="quantity"
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
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
