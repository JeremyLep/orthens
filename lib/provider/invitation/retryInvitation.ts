import { handleProviderError } from 'lib/service/axios/handleProviderError';
import InternalAxiosInstance from 'lib/service/axios/internalAxiosInstance';
import { getEnv } from 'lib/service/environnement';

export default async function retryInvitation(invitationId: string): Promise<any> {
    const invitation = await InternalAxiosInstance.get(
        `${
            process.env.NEXT_PUBLIC_API_URL ?? getEnv('NEXT_PUBLIC_API_URL')
        }/invitation/retry/${invitationId}`,
    )
        .then((response) => {
            return response.data?.data;
        })
        .catch((error) => {
            throw handleProviderError(error);
        });

    return invitation;
}
