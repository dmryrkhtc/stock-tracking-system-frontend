import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import CompanyService from "../../services/CompanyService";


const CompanyCreate = ({ visible, onHide, onCreated }) => {
    const [company, setCompany] = useState({
        name: "",
        telNo: "",
        email: "",
        taxNo: "",
        address: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompany({ ...company, [name]: value });
    };

    const handleSave = async () => {
        try {
            await CompanyService.create(company);
            onCreated(); // listeyi yenile
            onHide(); // dialogu kapat
        } catch (error) {
            //backendten gelen mesaji yakala
            //taxno ve vergino kontrol
            if (error.response && error.response.data?.message) {
                alert(error.response.data.message);
            } else {
                console.error("Şirket eklenirken hata:", error);
            }
        }
    };

    return (
        <Dialog
            header="Yeni Şirket Ekle"
            visible={visible}
            style={{ width: "30vw" }}
            modal
            onHide={onHide}
        >
            <div className="p-fluid">
                <div className="field">
                    <label htmlFor="name">Ad</label>
                    <InputText id="name" name="name" value={company.name} onChange={handleChange} />
                </div>
                <div className="field">
                    <label htmlFor="telNo">Telefon</label>
                    <InputText id="telNo" name="telNo" value={company.telNo} onChange={handleChange} />
                </div>
                <div className="field">
                    <label htmlFor="email">E-posta</label>
                    <InputText id="email" name="email" value={company.email} onChange={handleChange} />
                </div>
                <div className="field">
                    <label htmlFor="taxNo">Vergi No</label>
                    <InputText id="taxNo" name="taxNo" value={company.taxNo} onChange={handleChange} />
                </div>
                <div className="field">
                    <label htmlFor="address">Adres</label>
                    <InputText id="address" name="address" value={company.address} onChange={handleChange} />
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-3">
                <Button label="İptal" icon="pi pi-times" severity="secondary" onClick={onHide} />
                <Button label="Kaydet" icon="pi pi-check" severity="success" onClick={handleSave} />
            </div>
        </Dialog>
    );
};

export default CompanyCreate;
