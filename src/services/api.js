import axios from "axios"

const api = axios.create({
    baseURL: 'http://192.168.15.20:5080'
});

api.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
api.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
api.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
api.defaults.headers.get['Access-Control-Allow-Credentials'] = false;
api.defaults.headers.post['Access-Control-Allow-Credentials'] = false;
api.defaults.headers.get['Authorization'] = localStorage.getItem('tokenApi');
api.defaults.headers.post['Authorization'] = localStorage.getItem('tokenApi');

export default api;