import axios, {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';
import qs from 'qs';
import { getEnv } from '../environnement';

export const ExternalAxiosInstance = axios.create({
    baseURL: `${
        process.env.NEXT_PUBLIC_API_URL ?? getEnv('NEXT_PUBLIC_API_URL')
    }`,
});

ExternalAxiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        config.paramsSerializer = {
            encode: (params) =>
                qs.stringify(params, { arrayFormat: 'brackets' }),
        };

        config.headers['Content-Type'] = 'application/json';
        config.headers['Connection'] = 'keep-alive';
        config.headers['x-origin'] =
            process.env.NEXT_PUBLIC_API_URL ?? getEnv('NEXT_PUBLIC_API_URL')!;

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

ExternalAxiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        console.error('Error external catcher:', JSON.stringify(error));

        return Promise.reject(error);
    }
);

export default ExternalAxiosInstance;
