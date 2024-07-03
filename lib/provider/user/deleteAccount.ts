import { handleProviderError } from 'lib/service/axios/handleProviderError';
import InternalAxiosInstance from 'lib/service/axios/internalAxiosInstance';
import { getEnv } from 'lib/service/environnement';

export default async function deleteAccount(): Promise<any> {
    const deleteAccount = await InternalAxiosInstance.delete(
        `${
            process.env.NEXT_PUBLIC_API_URL ?? getEnv('NEXT_PUBLIC_API_URL')
        }/account/profile/delete`,
    )
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw handleProviderError(error);
        });

    return deleteAccount;
}
