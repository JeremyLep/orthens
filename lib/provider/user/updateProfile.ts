import { UpdateProfileInput } from 'lib/model/struct/account/updateProfileInput';
import { handleProviderError } from 'lib/service/axios/handleProviderError';
import InternalAxiosInstance from 'lib/service/axios/internalAxiosInstance';
import { getEnv } from 'lib/service/environnement';
import { Infer } from 'superstruct';

export default async function updateProfile(data: Infer<typeof UpdateProfileInput>): Promise<any> {
    const updateProfile = await InternalAxiosInstance.post(
        `${
            process.env.NEXT_PUBLIC_API_URL ?? getEnv('NEXT_PUBLIC_API_URL')
        }/account/profile/update`,
        data,
    )
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw handleProviderError(error);
        });

    return updateProfile;
}
