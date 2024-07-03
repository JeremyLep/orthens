import axios, {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';
import { signOut } from 'next-auth/react';
import qs from 'qs';
import { getEnv } from '../environnement';

export const InternalAxiosInstance = axios.create({
    baseURL: `${
        process.env.NEXT_PUBLIC_API_URL ?? getEnv('NEXT_PUBLIC_API_URL')
    }`,
});

InternalAxiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        config.paramsSerializer = {
            encode: (params) =>
                qs.stringify(params, { arrayFormat: 'brackets' }),
        };

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

InternalAxiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        console.error('Error internal catcher:', JSON.stringify(error));

        if (
            error.response?.status === 401 &&
            !error?.config?.url.includes('/sign-in') &&
            typeof window !== 'undefined'
        ) {
            signOut();
        }

        return Promise.reject(error);
    }
);

export default InternalAxiosInstance;
