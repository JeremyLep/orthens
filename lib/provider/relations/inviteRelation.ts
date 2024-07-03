import { RelationInvitationInput } from 'lib/model/struct/invitation/relationInvitationInput';
import { handleProviderError } from 'lib/service/axios/handleProviderError';
import InternalAxiosInstance from 'lib/service/axios/internalAxiosInstance';
import { getEnv } from 'lib/service/environnement';
import { Infer } from 'superstruct';

export default async function inviteRelation(data: Infer<typeof RelationInvitationInput>, headers?: any): Promise<any> {
    const options = {
        headers,
    };
    const student = await InternalAxiosInstance.post(
        `${
            process.env.NEXT_PUBLIC_API_URL ?? getEnv('NEXT_PUBLIC_API_URL')
        }/relation/invite`,
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
