import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5278/api", // Backend API adresi
});

export default api;
