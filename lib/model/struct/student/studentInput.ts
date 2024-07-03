import { messageError } from 'lib/service/utils/customMessageError';
import { array, nonempty, number, object, optional, size, string } from 'superstruct';

export const StudentInput = object({
    firstname: messageError(nonempty(string()), 'Le prénom ne peut pas être vide.'),
    lastname: messageError(nonempty(string()), 'Le nom ne peut pas être vide.'),
    birthYear: messageError(size(number(), 2005, 2028), 'L\'année de naissance doit être comprise entre 2005 et aujourd\'hui.'),
    institution: optional(string()),
    professionals: array(object({email: messageError(nonempty(string()), 'L\'email ne peut pas être vide.'), profession: messageError(nonempty(string()), 'La profession ne peut pas être vide.')})),
});
