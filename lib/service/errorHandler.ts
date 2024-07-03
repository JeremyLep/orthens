import { StructError } from 'superstruct';

export const handleValidationError = (e: StructError): string => {
    const { key, value, type } = e;
    let error: string;

    if (value === undefined) {
        error = `key [${key}] is required as a ${type}`;
    } else if (type === 'never') {
        error = `key [${key}] is unknown`;
    } else {
        error = `[${key}] is invalid, ${value} provided, expected type ${type}`;
    }

    return error;
};
