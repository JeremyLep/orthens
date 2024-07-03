import { toast } from 'react-toastify';

export const handleToastError = (
    { message, status }: { message: string; status: number },
    action: string = 'Action',
) => {
    toast.error(
        <>
            <b>
                Une erreur s'est produite lors de {action}
            </b>
            <br />
            {message}
            <br />
            <b>code: {status}</b>
        </>
    );
};
