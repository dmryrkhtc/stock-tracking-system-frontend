import axios from "axios";

const API_URL="http://localhost:5278/api/Product";

const ProductService={

getAll:()=>axios.get(`${API_URL}/ReadProductSummary`),

getById:(id)=>axios.get(`${API_URL}/ReadProductById/${id}`),

create:(data)=>axios.post(`${API_URL}/CreateProduct`,data),

update:(data)=>axios.put(`${API_URL}/UpdateProduct`,data),

delete:(id)=>axios.delete(`${API_URL}/DeleteProduct/${id}`)

};
export default ProductService;