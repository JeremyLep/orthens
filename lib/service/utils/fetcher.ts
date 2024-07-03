import axios from 'axios';
import { handleProviderError } from 'lib/service/axios/handleProviderError';

export const fetcher = async (url: string): Promise<any> => {
    const axiosInstance = axios.create();

    return axiosInstance
        .get(url)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            throw handleProviderError(error);
        });
};
