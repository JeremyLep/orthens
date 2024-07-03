import { messageError } from 'lib/service/utils/customMessageError';
import { nonempty, object, string } from 'superstruct';

export const UpdatePasswordInput = object({
    oldPassword: messageError(nonempty(string()), 'Votre ancien mot de passe ne peut pas être vide.'),
    password: messageError(nonempty(string()), 'Votre nouveau mot de passe ne peut pas être vide.'),
    verifiedPassword: messageError(nonempty(string()), 'Votre confirmation de mot de passe ne peut pas être vide.'),
});
