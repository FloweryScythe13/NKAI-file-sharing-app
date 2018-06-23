import axios from 'axios';
import { store } from './FileStore';

const instance =  axios.create({
    baseURL: 'http://localhost:3000/',
    withCredentials: true
});
instance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (error.status === 401) {
        store.isNotAuth();
    }
    return Promise.reject(error);
});

export default instance;