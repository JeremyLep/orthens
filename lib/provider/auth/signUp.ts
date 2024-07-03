import { handleProviderError } from 'lib/service/axios/handleProviderError';
import InternalAxiosInstance from 'lib/service/axios/internalAxiosInstance';
import { getEnv } from 'lib/service/environnement';

export default async function signUp(credentials): Promise<any> {
    const isSignedUp = await InternalAxiosInstance.post(
        `${
            process.env.NEXT_PUBLIC_API_URL ?? getEnv('NEXT_PUBLIC_API_URL')
        }/auth/sign-up`,
        credentials
    )
        .then((response) => {
            return response.data?.data;
        })
        .catch((error) => {
            throw handleProviderError(error);
        });

    return isSignedUp;
}
