import { handleProviderError } from 'lib/service/axios/handleProviderError';
import InternalAxiosInstance from 'lib/service/axios/internalAxiosInstance';
import { getEnv } from 'lib/service/environnement';

export default async function getFollowUpChild(childId: string, headers?: any): Promise<any> {
    const options = {
        headers,
    };
    const followUpChild = await InternalAxiosInstance.get(
        `${
            process.env.NEXT_PUBLIC_API_URL ?? getEnv('NEXT_PUBLIC_API_URL')
        }/follow-up/${childId}`,
        headers ? options : undefined
    )
        .then((response) => {
            return response.data?.data;
        })
        .catch((error) => {
            throw handleProviderError(error);
        });

    return followUpChild;
}
