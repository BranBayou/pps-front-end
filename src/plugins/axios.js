import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-api.com',
});

export default api;
