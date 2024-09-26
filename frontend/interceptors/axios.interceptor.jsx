import axios from "axios";
import { toast } from "sonner";

const baseUrl = "http://localhost:4321/api/";

export const customAxios = axios.create({
    baseURL: baseUrl,
    withCredentials: true
});

export const AxiosInterceptor = async() => {
    customAxios.interceptors.response.use(
        (response) => {
            return response;
        },
        async function (error) {
            const originalRequest = error.config;
                if (error.response.status === 403 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    await generateRefreshToken();
                    location.reload()
                    return customAxios(originalRequest);
                } catch (error) {
                    toast.error('No se pudo generar un nuevo token, inicia sesión nuevamente');
                    localStorage.clear();
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                }
            }
            return Promise.reject(error);
        }
    );
}


export const generateRefreshToken = async () => {
    try {
        const response = await customAxios.get('generate-token', {
            withCredentials: true
        });
        const { token } = response.data;
        localStorage.setItem('token', token);
        setTimeout(()=>{location.reload()},200)
    } catch (error) {
        toast.error('No se pudo generar un nuevo token')
        throw new Error('No se pudo generar un nuevo token');
    }
};

