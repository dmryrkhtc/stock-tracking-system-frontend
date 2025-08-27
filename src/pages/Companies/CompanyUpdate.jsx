import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import CompanyService from "../../services/CompanyService";

export default function CompanyUpdate() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState({
        id: 0,
        name: "",
        telNo: "",
        email: "",
        taxNo: "",
        address: ""
    });

    useEffect(() => {
        loadCompany();
    }, []);

    const loadCompany = async () => {
        try {
            const response = await CompanyService.getById(id);
            setCompany(response.data);
        } catch (error) {
            console.error("Şirket yüklenemedi:", error);
        }
    };

    const handleChange = (e) => {
        setCompany({ ...company, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await CompanyService.update(company);
            navigate("/companies"); // Güncelleme sonrası listeye dön
        } catch (error) {
            console.error("Güncelleme hatası:", error);
        }
    };

    return (
        <div className="p-4">
            <h2>Şirket Güncelle</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
                <span className="p-float-label">
                    <InputText
                        id="name"
                        name="name"
                        value={company.name}
                        onChange={handleChange}
                    />
                    <label htmlFor="name">Şirket Adı</label>
                </span>

                <span className="p-float-label">
                    <InputText
                        id="telNo"
                        name="telNo"
                        value={company.telNo}
                        onChange={handleChange}
                    />
                    <label htmlFor="telNo">Telefon</label>
                </span>

                <span className="p-float-label">
                    <InputText
                        id="email"
                        name="email"
                        value={company.email}
                        onChange={handleChange}
                    />
                    <label htmlFor="email">E-Posta</label>
                </span>

                <span className="p-float-label">
                    <InputText
                        id="taxNo"
                        name="taxNo"
                        value={company.taxNo}
                        onChange={handleChange}
                    />
                    <label htmlFor="taxNo">Vergi No</label>
                </span>

                <span className="p-float-label">
                    <InputText
                        id="address"
                        name="address"
                        value={company.address}
                        onChange={handleChange}
                    />
                    <label htmlFor="address">Adres</label>
                </span>

                <div className="flex gap-2">
                    <Button type="submit" label="Kaydet" className="p-button-success" />
                    <Button
                        type="button"
                        label="İptal"
                        className="p-button-secondary"
                        onClick={() => navigate("/companies")}
                    />
                </div>
            </form>
        </div>
    );
}
