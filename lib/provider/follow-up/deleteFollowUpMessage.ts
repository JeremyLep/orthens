import { handleProviderError } from 'lib/service/axios/handleProviderError';
import InternalAxiosInstance from 'lib/service/axios/internalAxiosInstance';
import { getEnv } from 'lib/service/environnement';

export default async function deleteFollowUpMessage(id: string): Promise<any> {
    const followUpMessage = await InternalAxiosInstance.delete(
        `${
            process.env.NEXT_PUBLIC_API_URL ?? getEnv('NEXT_PUBLIC_API_URL')
        }/follow-up/delete/${id}`,
    )
        .then((response) => {
            return response.data?.data;
        })
        .catch((error) => {
            throw handleProviderError(error);
        });

    return followUpMessage;
}
