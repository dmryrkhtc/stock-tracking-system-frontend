import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import ProductService from "../../services/ProductService";
import CompanyService from "../../services/CompanyService";
import { UNIT_OPTIONS } from "../../constants/enums";

export default function ProductCreate({ visible, onHide, onCreated }) {
    const [formData, setFormData] = useState({
        name: "",
        companyId: null,
        unit: null,
        price: 0,
        barcode: ""
    });
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        const loadCompanies = async () => {
            try {
                const res = await CompanyService.getAll();
                setCompanies(res.data || []);
            } catch (err) {
                console.error("Şirketler yüklenemedi:", err);
            }
        };
        loadCompanies();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            await ProductService.create({
                ...formData,
                price: parseFloat(formData.price)
            });
            onCreated(); // ürün listesi güncellensin
            onHide(); // modal kapan
        } catch (err) {
            console.error("Ürün eklenirken hata:", err);
        }
    };

    return (
        <Dialog header="Yeni Ürün Ekle" visible={visible} style={{ width: '500px' }} onHide={onHide}>
            <div className="p-fluid">
                <div className="field">
                    <label>Ürün İsmi</label>
                    <InputText name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="field">
                    <label>Şirket</label>
                    <Dropdown
                        value={formData.companyId}
                        options={companies.map(c => ({ label: c.name, value: c.id }))}
                        onChange={(e) => setFormData({ ...formData, companyId: e.value })}
                        placeholder="Şirket seçiniz"
                    />
                </div>
                <div className="field">
                    <label>Birim</label>
                    <Dropdown
                        value={formData.unit}
                        options={UNIT_OPTIONS}
                        onChange={(e) => setFormData({ ...formData, unit: e.value })}
                        placeholder="Birim seçiniz"
                    />
                </div>
                <div className="field">
                    <label>Fiyat</label>
                    <InputText name="price" value={formData.price} onChange={handleChange} />
                </div>
                <div className="field">
                    <label>Barkod</label>
                    <InputText name="barcode" value={formData.barcode} onChange={handleChange} />
                </div>

                <div className="flex gap-2 mt-3">
                    <Button label="İptal" severity="secondary" onClick={onHide} />
                    <Button label="Kaydet" severity="success" onClick={handleSave} />
                </div>
            </div>
        </Dialog>
    );
}
