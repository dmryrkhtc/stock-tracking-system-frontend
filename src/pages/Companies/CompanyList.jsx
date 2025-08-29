import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import CompanyService from "../../services/CompanyService";
import CompanyCreate from "./CompanyCreate";
import CompanyUpdate from "./CompanyUpdate"; // ✅ sadece bu olsun

export default function CompanyList() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    const [createVisible, setCreateVisible] = useState(false);
    const [updateVisible, setUpdateVisible] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState(null);

    const toast = useRef(null);

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            const res = await CompanyService.getAll();
            setCompanies(res.data || []);
        } catch (err) {
            console.error("Şirketler yüklenirken hata:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const deleteCompany = async (id) => {
        if (window.confirm("Bu şirketi silmek istediğinize emin misiniz?")) {
            try {
                await CompanyService.delete(id);
                await fetchCompanies();
                toast.current?.show({
                    severity: "success",
                    summary: "Silindi",
                    detail: "Şirket başarıyla silindi.",
                    life: 3000,
                });
            } catch (err) {
                console.error("Silme hatası:", err);
                toast.current?.show({
                    severity: "error",
                    summary: "Hata",
                    detail: "Şirket silinirken bir hata oluştu.",
                    life: 4000,
                });
            }
        }
    };

    const actionBodyTemplate = (rowData) => (
        <div className="flex gap-2">
            <Button
                label="Güncelle"
                icon="pi pi-pencil"
                severity="warning"
                onClick={() => {
                    setSelectedCompanyId(rowData.id); // ✅ sadece id gönder
                    setUpdateVisible(true);
                }}
            />
            <Button
                label="Sil"
                icon="pi pi-trash"
                severity="danger"
                onClick={() => deleteCompany(rowData.id)}
            />
        </div>
    );

    return (
        <div className="p-4">
            <Toast ref={toast} />

            <div className="flex justify-between items-center mb-3">
                <h1>Şirketler</h1>
                <Button
                    label="Yeni Şirket Ekle"
                    icon="pi pi-plus"
                    onClick={() => setCreateVisible(true)}
                />
            </div>

            <DataTable
                value={companies}
                loading={loading}
                paginator
                rows={10}
                responsiveLayout="scroll"
                dataKey="id"
            >
                <Column field="name" header="Şirket İsmi" />
                <Column field="telNo" header="Telefon" />
                <Column field="email" header="E-Posta" />
                <Column field="address" header="Adres" />
                <Column field="taxNo" header="Vergi No" />
                <Column body={actionBodyTemplate} header="İşlemler" />
            </DataTable>

            {/* Create Dialog */}
            <CompanyCreate
                visible={createVisible}
                onHide={() => setCreateVisible(false)}
                onCreated={(created) => {
                    setCreateVisible(false);
                    fetchCompanies();
                    toast.current?.show({
                        severity: "success",
                        summary: "Eklendi",
                        detail: `${created?.name || "Şirket"} başarıyla eklendi.`,
                        life: 3000,
                    });
                }}
            />

            {/* Update Dialog */}
            <CompanyUpdate
                visible={updateVisible}
                onHide={() => setUpdateVisible(false)}
                companyId={selectedCompanyId}
                onUpdated={() => {
                    setUpdateVisible(false);
                    fetchCompanies();
                    toast.current?.show({
                        severity: "success",
                        summary: "Güncellendi",
                        detail: "Şirket bilgileri başarıyla güncellendi.",
                        life: 3000,
                    });
                }}
            />
        </div>
    );
}
