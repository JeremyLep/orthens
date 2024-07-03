import { FollowUpInput } from 'lib/model/struct/followUp/followUpInput';
import { handleProviderError } from 'lib/service/axios/handleProviderError';
import InternalAxiosInstance from 'lib/service/axios/internalAxiosInstance';
import { getEnv } from 'lib/service/environnement';
import { Infer } from 'superstruct';

export default async function newFollowUpMessage(data: Infer<typeof FollowUpInput>, headers?: any): Promise<any> {
    const options = {
        headers,
    };
    const followUpMessage = await InternalAxiosInstance.post(
        `${
            process.env.NEXT_PUBLIC_API_URL ?? getEnv('NEXT_PUBLIC_API_URL')
        }/follow-up/new`,
        data,
        headers ? options : undefined
    )
        .then((response) => {
            return response.data?.data;
        })
        .catch((error) => {
            throw handleProviderError(error);
        });

    return followUpMessage;
}
