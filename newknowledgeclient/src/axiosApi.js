import axios from 'axios';
import { store } from './FileStore';

const instance =  axios.create({
    baseURL: 'https://newknowledge-file-explorer.azurewebsites.net/',
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