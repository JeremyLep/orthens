import { messageError } from 'lib/service/utils/customMessageError';
import { boolean, is, nonempty, nullable, object, string } from 'superstruct';

export const UpdateProfileInput = object({
    name: messageError(nonempty(string()), 'Votre nom ne peut pas être vide.'),
    profession: messageError(nonempty(string()), 'Votre profession ne peut pas être vide.'),
    institution: nullable(string()),
    phone: nullable(string()),
    address: nullable(string()),
    city: nullable(string()),
    postcode: nullable(string()),
    isPhonePublic: boolean(),
    isAddressPublic: boolean(),
});
