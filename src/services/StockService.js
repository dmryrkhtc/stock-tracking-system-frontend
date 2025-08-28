import axios from "axios";

//backendte swagger kisminda calisan port
const API_URL="http://localhost:5278/api/Stock";


const StockService={

    
    getAll:()=> axios.get(`${API_URL}/ReadStockInf`),

   
    getById:(id)=>axios.get(`${API_URL}/ReadStockById/${id}`),

   
    create:(data)=>axios.post(`${API_URL}/CreateStock`, data),

   
    update:(data)=>axios.put(`${API_URL}/UpdateStock`,data),

   
    delete:(id)=>axios.delete(`${API_URL}/DeleteStock/${id}`)

};
export default StockService;