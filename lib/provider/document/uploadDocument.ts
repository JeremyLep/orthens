import { handleProviderError } from 'lib/service/axios/handleProviderError';
import InternalAxiosInstance from 'lib/service/axios/internalAxiosInstance';
import { getEnv } from 'lib/service/environnement';

export default async function uploadDocuments(files: File[], type: string, id?: string): Promise<any> {
    const formData = new FormData();

    let fileCount = 0;

    files.forEach((file) => {
        formData.append(`file${fileCount}`, file);
        fileCount++;
    });

    const documents = await InternalAxiosInstance.post(
        `${
            process.env.NEXT_PUBLIC_API_URL ?? getEnv('NEXT_PUBLIC_API_URL')
        }/document/upload?type=${type}&id=${id}`,
        formData,
    )
        .then((response) => {
            return response.data?.data;
        })
        .catch((error) => {
            throw handleProviderError(error);
        });

    return documents;
}
