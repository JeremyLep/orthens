import { messageError } from 'lib/service/utils/customMessageError';
import { nonempty, object, string } from 'superstruct';

export const ResetPasswordInput = object({
    password: messageError(nonempty(string()), 'Votre nouveau mot de passe ne peut pas être vide.'),
    verifiedPassword: messageError(nonempty(string()), 'Votre confirmation de mot de passe ne peut pas être vide.'),
});
