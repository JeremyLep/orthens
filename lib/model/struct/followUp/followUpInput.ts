import { messageError } from 'lib/service/utils/customMessageError';
import { nonempty, object, string } from 'superstruct';

export const FollowUpInput = object({
    message: messageError(nonempty(string()), 'Votre message ne peut pas être vide.'),
    date: messageError(string(), 'La date est obligatoire.'),
    time: messageError(string(), 'L\'heure est obligatoire.'),
    relationId: messageError(string(), 'La relation est obligatoire.'),
});
