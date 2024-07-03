import { StudentInput } from 'lib/model/struct/student/studentInput';
import { handleProviderError } from 'lib/service/axios/handleProviderError';
import InternalAxiosInstance from 'lib/service/axios/internalAxiosInstance';
import { getEnv } from 'lib/service/environnement';
import { Infer } from 'superstruct';

export default async function newStudent(data: Infer<typeof StudentInput>, headers?: any): Promise<any> {
    const options = {
        headers,
    };
    const student = await InternalAxiosInstance.post(
        `${
            process.env.NEXT_PUBLIC_API_URL ?? getEnv('NEXT_PUBLIC_API_URL')
        }/students/new`,
        data,
        headers ? options : undefined
    )
        .then((response) => {
            return response.data?.data;
        })
        .catch((error) => {
            throw handleProviderError(error);
        });

    return student;
}
