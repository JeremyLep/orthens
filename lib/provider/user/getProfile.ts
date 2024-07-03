import { handleProviderError } from 'lib/service/axios/handleProviderError';
import InternalAxiosInstance from 'lib/service/axios/internalAxiosInstance';
import { getEnv } from 'lib/service/environnement';

export default async function getProfile(headers?: any): Promise<any> {
    const options = {
        headers: {
            ...headers,
            'Cache-Control': 'no-cache',
        },
    };
    const profile = await InternalAxiosInstance.get(
        `${
            process.env.NEXT_PUBLIC_API_URL ?? getEnv('NEXT_PUBLIC_API_URL')
        }/account/profile`,
        headers ? options : undefined
    )
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            throw handleProviderError(error);
        });

    return profile;
}
