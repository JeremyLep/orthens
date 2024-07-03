import { toast } from 'react-toastify';

export const handleToastPromise = (
    promise: Promise<any>,
    action: string = 'Action',
) => {
    return toast
        .promise(promise, {
            pending: `${action} en cours`,
            success: `${action} réussi !`,
            error: {
                render({
                    data,
                }: { data: { message: string; status: number } } | any) {
                    return (
                        <>
                            <b>
                                Une erreur s'est produite lors de {action.toLowerCase()} 
                            </b>
                            <br />
                            {data.message}
                            <br />
                            <b>code: {data.status}</b>
                        </>
                    );
                },
            },
        })
        .catch(() => {});
};
