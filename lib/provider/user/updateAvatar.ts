import { handleProviderError } from 'lib/service/axios/handleProviderError';
import InternalAxiosInstance from 'lib/service/axios/internalAxiosInstance';
import { getEnv } from 'lib/service/environnement';

export default async function updateAvatar(avatarUrl: string): Promise<any> {
    const updateAvatar = await InternalAxiosInstance.post(
        `${
            process.env.NEXT_PUBLIC_API_URL ?? getEnv('NEXT_PUBLIC_API_URL')
        }/account/profile/avatar`,
        {
            avatar: avatarUrl,
        }
    )
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw handleProviderError(error);
        });

    return updateAvatar;
}
