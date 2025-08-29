import React, { useEffect, useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast"; // <-- eklendi
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
    const toast = useRef(null); // <-- toast referansı

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
            await ProductService.create({ ...formData, price: parseFloat(formData.price) });
            onCreated();
            onHide();
            toast.current?.show({
                severity: "success",
                summary: "Eklendi",
                detail: `${formData.name} başarıyla eklendi.`,
                life: 3000
            });
        } catch (err) {
            if (err.response && err.response.status === 400) {
                const backendMessage = err.response.data?.message || "";
                let userMessage = "İşlem sırasında bir hata oluştu.";

                // Barkod özel kontrolü
                if (backendMessage.toLowerCase().includes("barcode")) {
                    userMessage = "Aynı barkod no’ya sahip bir ürün olamaz!";
                }

                toast.current?.show({
                    severity: "warn",
                    summary: "Uyarı",
                    detail: userMessage,
                    life: 4000
                });
            } else {
                toast.current?.show({
                    severity: "error",
                    summary: "Hata",
                    detail: "Ürün eklenirken hata oluştu.",
                    life: 4000
                });
            }
        }

    };

    return (
        <Dialog header="Yeni Ürün Ekle" visible={visible} style={{ width: "500px" }} onHide={onHide}>
            <Toast ref={toast} /> {/* <-- toast burada */}
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
