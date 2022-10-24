// api/axiosBackup.js
import axios from 'axios';
import queryString from 'query-string';
// Set up default config for http requests here

// Please have a look at here `https://github.com/axios/axios#request-config` for the full list of configs

const axiosBackup = axios.create({
    baseURL: process.env.API_BACKUP,
    headers: {
        'content-type': 'application/json',
    },
    paramsSerializer: params => queryString.stringify(params),
});
axiosBackup.interceptors.request.use(async (config) => {
    // Handle token here ...
    return config;
})
axiosBackup.interceptors.response.use((response) => {
    if (response && response.data) {
        return response.data;
    }
    return response;
}, (error) => {
    // Handle errors
    throw error;
});
export default axiosBackup;