import { handleProviderError } from 'lib/service/axios/handleProviderError';
import InternalAxiosInstance from 'lib/service/axios/internalAxiosInstance';
import { getEnv } from 'lib/service/environnement';

export default async function getRelationList(headers?: any): Promise<any> {
    const options = {
        headers,
    };
    const relations = await InternalAxiosInstance.get(
        `${
            process.env.NEXT_PUBLIC_API_URL ?? getEnv('NEXT_PUBLIC_API_URL')
        }/relation/list`,
        headers ? options : undefined
    )
        .then((response) => {
            return response.data?.data;
        })
        .catch((error) => {
            throw handleProviderError(error);
        });

    return relations;
}
