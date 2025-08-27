import React, { useEffect, useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import CompanyService from "../../services/CompanyService";
import CompanyCreate from "./CompanyCreate";
import CompanyUpdate from "./CompanyUpdate"; // Update modal component

export default function CompanyList() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createVisible, setCreateVisible] = useState(false);
    const [updateVisible, setUpdateVisible] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [expandedRows, setExpandedRows] = useState(null);
    const [rowDetails, setRowDetails] = useState({}); // detay cache

    useEffect(() => {
        loadCompanies();
    }, []);

    const loadCompanies = async () => {
        setLoading(true);
        try {
            const response = await CompanyService.getAll();
            setCompanies(response.data || []);
        } catch (error) {
            console.error("Şirketler yüklenirken hata:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteCompany = async (id) => {
        if (window.confirm("Bu şirketi silmek istediğinize emin misiniz?")) {
            try {
                await CompanyService.delete(id);
                loadCompanies();
            } catch (error) {
                console.error("Şirket silinirken hata:", error);
            }
        }
    };

    const actionBodyTemplate = (rowData) => (
        <div className="flex gap-2">
            <Button
                label="Güncelle"
                icon="pi pi-pencil"
                className="p-button-warning"
                onClick={() => {
                    setSelectedCompany(rowData);
                    setUpdateVisible(true);
                }}
            />
            <Button
                label="Sil"
                icon="pi pi-trash"
                className="p-button-danger"
                onClick={() => deleteCompany(rowData.id)}
            />
        </div>
    );

    const rowExpansionTemplate = (rowData) => {
        const details = rowDetails[rowData.id];

        if (!details) return <p>Yükleniyor...</p>;

        return (
            <div className="p-3">
                <h5>{details.name} Detayları</h5>
                <p><strong>Vergi No:</strong> {details.taxNo}</p>
                <p><strong>Adres:</strong> {details.address}</p>
                <p><strong>Telefon:</strong> {details.telNo}</p>
                <p><strong>Email:</strong> {details.email}</p>
            </div>
        );
    };

    const onRowToggle = async (e) => {
        // PrimeReact >= v9: e.data bir obje {id: rowData, ...}
        setExpandedRows(e.data);

        for (let id in e.data) {
            if (!rowDetails[id]) {
                try {
                    const res = await CompanyService.getById(id);
                    setRowDetails(prev => ({ ...prev, [id]: res.data }));
                } catch (err) {
                    console.error("Detay yüklenirken hata:", err);
                }
            }
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-3">
                <h2>Şirketler</h2>
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
                rows={5}
                responsiveLayout="scroll"
                dataKey="id"
                expandedRows={expandedRows}
                onRowToggle={onRowToggle}
                rowExpansionTemplate={rowExpansionTemplate}
            >
                <Column expander style={{ width: "3em" }} />
                <Column field="name" header="Şirket İsmi" />
                <Column field="telNo" header="Telefon" />
                <Column field="email" header="E-Posta" />
                <Column body={actionBodyTemplate} header="İşlemler" />
            </DataTable>

            {/* Create Modal */}
            <CompanyCreate
                visible={createVisible}
                onHide={() => setCreateVisible(false)}
                onCreated={loadCompanies}
            />

            {/* Update Modal */}
            {selectedCompany && (
                <CompanyUpdate
                    visible={updateVisible}
                    onHide={() => setUpdateVisible(false)}
                    company={selectedCompany}
                    onUpdated={() => {
                        loadCompanies();
                        setUpdateVisible(false);
                    }}
                />
            )}
        </div>
    );
}
