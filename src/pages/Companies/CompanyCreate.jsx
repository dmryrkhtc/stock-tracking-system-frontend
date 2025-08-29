import React, { useMemo, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import CompanyService from "../../services/CompanyService";

const initialForm = {
    name: "",
    telNo: "",
    email: "",
    taxNo: "",
    address: "",
};

const CompanyCreate = ({ visible, onHide, onCreated }) => {
    const [company, setCompany] = useState(initialForm);
    const [submitting, setSubmitting] = useState(false);
    const [errorText, setErrorText] = useState("");

    // basit zorunlu alan kontrolü (frontend)
    const invalid = useMemo(() => {
        return !company.name?.trim() || !company.taxNo?.trim();
    }, [company.name, company.taxNo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompany((prev) => ({ ...prev, [name]: value }));
    };

    const extractErrorMessage = (err) => {
        // backend farklı şekillerde dönebilir; hepsini dene
        return (
            err?.response?.data?.message ||
            err?.response?.data?.Message ||
            err?.response?.data?.result?.message ||
            err?.response?.data?.result?.Message ||
            err?.message ||
            "Şirket eklenirken bir hata oluştu."
        );
    };

    const handleSave = async () => {
        setSubmitting(true);
        setErrorText("");

        try {
            const res = await CompanyService.create(company);
            const created = res?.data ?? res; // service .data döndürmüyorsa yine de çalışsın

            // formu temizle + parent'a haber ver
            setCompany(initialForm);
            onCreated?.(created); // parent: listeyi yenile + toast
            onHide?.(); // dialog'u kapat
        } catch (error) {
            // ör: "Aynı vergi numarasına ait firma mevcut!" / "Aynı e-posta adresine ait firma mevcut!"
            const msg = extractErrorMessage(error);
            setErrorText(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const footer = (
        <div className="flex justify-end gap-2">
            <Button
                label="İptal"
                icon="pi pi-times"
                severity="secondary"
                onClick={onHide}
                disabled={submitting}
            />
            <Button
                label="Kaydet"
                icon="pi pi-check"
                severity="success"
                onClick={handleSave}
                loading={submitting}
                disabled={invalid || submitting}
            />
        </div>
    );

    return (
        <Dialog
            header="Yeni Şirket Ekle"
            visible={visible}
            style={{ width: "30rem" }}
            modal
            onHide={onHide}
            footer={footer}
        >
            <div className="p-fluid">
                <div className="field">
                    <label htmlFor="name">Ad <span className="p-error">*</span></label>
                    <InputText
                        id="name"
                        name="name"
                        value={company.name}
                        onChange={handleChange}
                        className={!company.name?.trim() && "p-invalid"}
                    />
                </div>

                <div className="field">
                    <label htmlFor="telNo">Telefon</label>
                    <InputText
                        id="telNo"
                        name="telNo"
                        value={company.telNo}
                        onChange={handleChange}
                    />
                </div>

                <div className="field">
                    <label htmlFor="email">E-posta</label>
                    <InputText
                        id="email"
                        name="email"
                        value={company.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="field">
                    <label htmlFor="taxNo">Vergi No <span className="p-error">*</span></label>
                    <InputText
                        id="taxNo"
                        name="taxNo"
                        value={company.taxNo}
                        onChange={handleChange}
                        className={!company.taxNo?.trim() && "p-invalid"}
                    />
                </div>

                <div className="field">
                    <label htmlFor="address">Adres</label>
                    <InputText
                        id="address"
                        name="address"
                        value={company.address}
                        onChange={handleChange}
                    />
                </div>

                {errorText && (
                    <small className="p-error" style={{ display: "block", marginTop: 8 }}>
                        {errorText}
                    </small>
                )}
            </div>
        </Dialog>
    );
};

export default CompanyCreate;
