import axios from 'axios';

const api = axios.create({
    baseURL: `https://www.thesportsdb.com/api/v1/json/${process.env.EXPO_PUBLIC_API_FUTEBOL_KEY}`,
    headers: {
        "Content-Type": 'application/json'
    }
});

export default api;