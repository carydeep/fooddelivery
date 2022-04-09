// api/axiosClient.js
import axios, { AxiosRequestConfig, Method } from 'axios';
import queryString from 'query-string';
// Set up default config for http requests here

// Please have a look at here `https://github.com/axios/axios#request-config` for the full list of configs

const axiosUser = axios.create({
    baseURL: process.env.AUTH0_ISSUER_BASE_URL,
    headers: {
        'content-type': 'application/json',
    },
    paramsSerializer: params => queryString.stringify(params),
});
axiosUser.interceptors.request.use(async (config: AxiosRequestConfig) => {
    // Handle token here ...
    const method: Method = `POST`;
    const options = {
        method: method,
        url: `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
        headers: { 'content-type': `application/json` },
        data: {
            grant_type: 'client_credentials',
            client_id: `${process.env.AUTH0_CLIENT_ID}`,
            client_secret: `${process.env.AUTH0_CLIENT_SECRET}`,
            audience: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/`
        }
    };
    await axios.request(options).then(response => {
        if (config.headers) {
            config.headers.Authorization = `${response.data.token_type} ${response.data.access_token}`;
        }
        return config;
    }).catch(function (error) {
        return Promise.reject(error)
    });
    return config
})

axiosUser.interceptors.response.use((response) => {
    // if (response && response.data) {
    //     return response.data;
    // }
    return response
}, (error) => {
    // Handle errors
    throw error;
});
export default axiosUser;