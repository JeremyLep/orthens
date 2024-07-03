import { ConversationMessageInput } from 'lib/model/struct/conversation/conversationMessageInput';
import { handleProviderError } from 'lib/service/axios/handleProviderError';
import InternalAxiosInstance from 'lib/service/axios/internalAxiosInstance';
import { getEnv } from 'lib/service/environnement';
import { Infer } from 'superstruct';

export default async function sendMessage(conversationId: string, data: Infer<typeof ConversationMessageInput>, headers?: any): Promise<any> {
    const options = {
        headers,
    };
    const messageSent = await InternalAxiosInstance.post(
        `${
            process.env.NEXT_PUBLIC_API_URL ?? getEnv('NEXT_PUBLIC_API_URL')
        }/conversation/${conversationId}/send`,
        data,
        headers ? options : undefined
    )
        .then((response) => {
            return response.data?.data;
        })
        .catch((error) => {
            throw handleProviderError(error);
        });

    return messageSent;
}
