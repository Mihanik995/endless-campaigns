import axios from "axios";
import {store} from "../app/store";
import {type AuthState, logout, refresh} from "../app/features/auth/authSlice.ts";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || '/api',
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
})

axiosInstance.interceptors.request.use(request => {
    const auth = store.getState().auth as AuthState;

    const accessToken = auth.token
    if (accessToken) {
        request.headers['Authorization'] = accessToken;
    }
    return request;
}, error => {
    Promise.reject(error);
})

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const response = await axios.post(`/api/auth/refresh`, {}, {withCredentials: true});
                const {accessToken} = response.data;
                store.dispatch(refresh(response.data))
                axiosInstance.defaults.headers.common['Authorization'] = accessToken;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                store.dispatch(logout())
                window.location.href = '/auth/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    })

export default axiosInstance