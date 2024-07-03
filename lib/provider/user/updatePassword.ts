import { handleProviderError } from 'lib/service/axios/handleProviderError';
import InternalAxiosInstance from 'lib/service/axios/internalAxiosInstance';
import { getEnv } from 'lib/service/environnement';

export default async function updatePassword(
    password: string,
    verifiedPassword: string,
    oldPassword: string
): Promise<any> {
    const updatePassword = await InternalAxiosInstance.post(
        `${
            process.env.NEXT_PUBLIC_API_URL ?? getEnv('NEXT_PUBLIC_API_URL')
        }/account/password/update`,
        {
            oldPassword: oldPassword,
            password: password,
            verifiedPassword: verifiedPassword,
        }
    )
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw handleProviderError(error);
        });

    return updatePassword;
}
