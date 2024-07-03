import { handleProviderError } from 'lib/service/axios/handleProviderError';
import InternalAxiosInstance from 'lib/service/axios/internalAxiosInstance';
import { getEnv } from 'lib/service/environnement';

export default async function getChildDocuments(childId: string, headers?: any): Promise<any> {
    const options = {
        headers,
    };
    const documents = await InternalAxiosInstance.get(
        `${
            process.env.NEXT_PUBLIC_API_URL ?? getEnv('NEXT_PUBLIC_API_URL')
        }/document/child/${childId}`,
        headers ? options : undefined
    )
        .then((response) => {
            return response.data?.data;
        })
        .catch((error) => {
            throw handleProviderError(error);
        });

    return documents;
}
