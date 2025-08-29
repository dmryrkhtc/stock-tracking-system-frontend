import React, { useState, useEffect } from "react";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import StockMovementService from "../../services/StockMovementService";
import ProductService from "../../services/ProductService";
import { STORE_OPTIONS, MOVEMENT_TYPE_OPTIONS } from "../../constants/enums";

export default function StockMovementUpdate({ movement, onUpdated }) {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ ...movement });

    useEffect(() => {
        ProductService.getAll().then((res) => setProducts(res.data));
    }, []);

    useEffect(() => {
        setForm({ ...movement });
    }, [movement]);

    const handleSubmit = async () => {
        if (!form.productId || form.type === null || !form.quantity || !form.date || form.store === null) {
            alert("Lütfen tüm alanları doldurun!");
            return;
        }
        try {
            const payload = {
                ...form,
                date: form.date.toISOString(),
            };
            await StockMovementService.update(payload);
            onUpdated();
        } catch (err) {
            console.error("Güncelleme hatası", err);
        }
    };

    if (!form) return null;

    return (
        <div className="flex flex-col gap-3">
            <Dropdown
                value={form.productId}
                options={products.map((p) => ({ label: p.name, value: p.id }))}
                onChange={(e) => setForm({ ...form, productId: e.value })}
                placeholder="Ürün Seç"
            />
            <Dropdown
                value={form.store}
                options={STORE_OPTIONS}
                onChange={(e) => setForm({ ...form, store: e.value })}
                placeholder="Depo Seç"
            />
            <Dropdown
                value={form.type}
                options={MOVEMENT_TYPE_OPTIONS}
                onChange={(e) => setForm({ ...form, type: e.value })}
                placeholder="Hareket Tipi"
            />
            <InputNumber
                value={form.quantity}
                onValueChange={(e) => setForm({ ...form, quantity: e.value })}
                placeholder="Miktar"
            />
            <Calendar
                value={new Date(form.date)}
                onChange={(e) => setForm({ ...form, date: e.value })}
                dateFormat="yy-mm-dd"
                placeholder="Tarih"
            />
            <Button label="Güncelle" icon="pi pi-check" onClick={handleSubmit} />
        </div>
    );
}
