import { AxiosError } from 'axios';

export const handleProviderError = (error: AxiosError): AxiosError => {
    if (error?.response) {
        let message = (error?.response.data as { error: string }).error;

        if (typeof message === 'undefined') {
            message = (error?.response.data  as { message: string }).message;
        }

        message =
            typeof message !== 'undefined'
                ? message.startsWith('<!DOCTYPE')
                    ? error.response.statusText
                    : message
                : error?.response.statusText;
        error = {
            message: message ?? 'Erreur',
            status: error?.response?.status ?? 500,
        } as AxiosError;
    } else if (error.request) {
        error = {
            message: error?.request.message,
            status: error?.request.status ?? 500,
        } as AxiosError;
    } else {
        error = {
            message: error?.message,
            status: error?.status ?? 500,
        } as AxiosError;
    }

    return error;
};
