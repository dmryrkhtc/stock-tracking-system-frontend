import React, { useEffect, useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";   // ✅ Toast import
import CompanyService from "../../services/CompanyService";

export default function CompanyUpdate({ visible, onHide, companyId, onUpdated }) {
    const [company, setCompany] = useState({
        id: "",
        name: "",
        telNo: "",
        email: "",
        address: "",
        taxNo: ""
    });

    const toast = useRef(null); // ✅ Toast için ref

    useEffect(() => {
        if (companyId) {
            CompanyService.getById(companyId).then((res) => setCompany(res.data));
        }
    }, [companyId]);

    const handleSubmit = async () => {
        try {
            await CompanyService.update(company);
            toast.current?.show({
                severity: "success",
                summary: "Başarılı",
                detail: "Şirket bilgileri güncellendi.",
                life: 3000,
            });
            onUpdated();
            onHide();
        } catch (err) {
            if (err.response && err.response.status === 400) {
                toast.current?.show({
                    severity: "warn",
                    summary: "Uyarı",
                    detail: err.response.data.message || "Geçersiz işlem.",
                    life: 4000,
                });
            } else {
                toast.current?.show({
                    severity: "error",
                    summary: "Hata",
                    detail: "İşlem sırasında bir hata oluştu.",
                    life: 4000,
                });
            }
        }

    };

    return (
        <>
            {/* ✅ Toast ekledik */}
            <Toast ref={toast} />

            <Dialog
                header="Şirket Güncelle"
                visible={visible}
                style={{ width: "30vw" }}
                modal
                onHide={onHide}
            >
                <div className="flex flex-col gap-3">
                    <InputText
                        value={company.name}
                        onChange={(e) => setCompany({ ...company, name: e.target.value })}
                        placeholder="Şirket Adı"
                    />
                    <InputText
                        value={company.telNo}
                        onChange={(e) => setCompany({ ...company, telNo: e.target.value })}
                        placeholder="Telefon"
                    />
                    <InputText
                        value={company.email}
                        onChange={(e) => setCompany({ ...company, email: e.target.value })}
                        placeholder="E-Posta"
                    />
                    <InputText
                        value={company.address}
                        onChange={(e) => setCompany({ ...company, address: e.target.value })}
                        placeholder="Adres"
                    />
                    <InputText
                        value={company.taxNo}
                        onChange={(e) => setCompany({ ...company, taxNo: e.target.value })}
                        placeholder="Vergi No"
                    />

                    <div className="flex justify-end gap-2 mt-3">
                        <Button label="İptal" severity="secondary" onClick={onHide} />
                        <Button label="Kaydet" onClick={handleSubmit} />
                    </div>
                </div>
            </Dialog>
        </>
    );
}
