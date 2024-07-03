import { messageError } from 'lib/service/utils/customMessageError';
import { boolean, nonempty, nullable, object, string } from 'superstruct';

export const CreateAccountInput = object({
    email: messageError(nonempty(string()), 'Votre email ne peut pas être vide.'),
    password: messageError(nonempty(string()), 'Votre mot de passe ne peut pas être vide.'),
    confirmPassword: messageError(nonempty(string()), 'Votre confirmation de mot de passe ne peut pas être vide.'),
    name: messageError(nonempty(string()), 'Votre nom ne peut pas être vide.'),
    profession: messageError(nonempty(string()), 'Votre profession ne peut pas être vide.'),
    institution: nullable(string()),
    acceptCgu: messageError(boolean(), 'Vous devez accepter les CGU pour continuer.'),
});
