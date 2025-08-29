import axios from "axios";

//backendte swagger kisminda calisan port
const API_URL="http://localhost:5278/api/Company";


const CompanyService={

    //tum sirketleri getirdik
    getAll:()=> axios.get(`${API_URL}/GetCompanySummary`),

    //id gore sirket getirdik
    getById:(id)=>axios.get(`${API_URL}/GetCompanyById/${id}`),

    //yeni sirketler olusturduk
    create: async (data) => {
        const res = await axios.post(`${API_URL}/CreateCompany`, data);
        return res.data; // <-- böyle olursa component'te direkt created alırsın
      },

    //sirket guncelle
    update:(data)=>axios.put(`${API_URL}/UpdateCompany`,data),

    //sirket sil
    delete:(id)=>axios.delete(`${API_URL}/DeleteCompany/${id}`)

};
export default CompanyService;