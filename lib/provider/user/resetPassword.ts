import { ResetPasswordInput } from 'lib/model/struct/account/resetPasswordInput';
import { handleProviderError } from 'lib/service/axios/handleProviderError';
import InternalAxiosInstance from 'lib/service/axios/internalAxiosInstance';
import { getEnv } from 'lib/service/environnement';
import { Infer } from 'superstruct';

export default async function resetPassword(
    data: Infer<typeof ResetPasswordInput>,
    userId: string
): Promise<any> {
    const resetPassword = await InternalAxiosInstance.post(
        `${
            process.env.NEXT_PUBLIC_API_URL ?? getEnv('NEXT_PUBLIC_API_URL')
        }/account/password/reset`,
        {
            data: data,
            userId: userId
        }
    )
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw handleProviderError(error);
        });

    return resetPassword;
}
