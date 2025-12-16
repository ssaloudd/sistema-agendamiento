import axios from 'axios';

// Todas las peticiones irán al API Gateway (Puerto 4000)
const api = axios.create({
    baseURL: 'http://localhost:4000', 
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;