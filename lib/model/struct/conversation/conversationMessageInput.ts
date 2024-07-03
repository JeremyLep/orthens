import { messageError } from 'lib/service/utils/customMessageError';
import { nonempty, object, string } from 'superstruct';

export const ConversationMessageInput = object({
    message: messageError(nonempty(string()), 'Votre message ne peut pas être vide.'),
});
