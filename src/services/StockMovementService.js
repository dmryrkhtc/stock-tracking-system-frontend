import axios from "axios";

//backendte swagger kisminda calisan port
const API_URL="http://localhost:5278/api/StockMovement";


const StockMovementService={

    
    getAll:()=> axios.get(`${API_URL}/ReadStockMovement`),

   
    getById:(id)=>axios.get(`${API_URL}/ReadStockMovementById/${id}`),

   
    create:(data)=>axios.post(`${API_URL}/CreateStockMovement`, data),

   
    update:(data)=>axios.put(`${API_URL}/UpdateStockMovement`,data),

   
    delete:(id)=>axios.delete(`${API_URL}/DeleteStockMovement/${id}`)

};
export default StockMovementService;