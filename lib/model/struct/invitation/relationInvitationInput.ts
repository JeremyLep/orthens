import { messageError } from 'lib/service/utils/customMessageError';
import { array, nonempty, object, optional, string, size } from 'superstruct';

export const RelationInvitationInput = object({
    relationId: messageError(string(), 'La relation est obligatoire.'),
    invitations: messageError(size(array(object({
        email: messageError(nonempty(string()), 'L\'email est obligatoire.'),
        profession: optional(string()),
    })), 1, Infinity), 'Il faut au moins une invitation avec des adresses emails valides.'),
});
