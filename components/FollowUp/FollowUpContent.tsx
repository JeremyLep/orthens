import { FollowUpInput } from "lib/model/struct/followUp/followUpInput";
import uploadDocuments from "lib/provider/document/uploadDocument";
import deleteFollowUpMessage from "lib/provider/follow-up/deleteFollowUpMessage";
import newFollowUpMessage from "lib/provider/follow-up/newFollowUpMessage";
import { handleToastPromise } from "lib/service/axios/handleToastPromise";
import { useState } from "react";
import { Infer } from "superstruct";
import { CreateFollowUpForm } from "./CreateFollowUpForm";
import { useForm } from "react-hook-form";
import { superstructResolver } from "@hookform/resolvers/superstruct";
import moment from "moment";
import { FollowUpMessage } from "./FollowUpMessage";
import useSWR from "swr";
import { fetcher } from "lib/service/utils/fetcher";

export const FollowUpContent = ({student, user}) => {
    const [openCreationForm, setOpenCreationForm] = useState(false);
    const [files, setFiles] = useState([]);

    const { data: followUpMessages = [], mutate } = useSWR(
        [`/api/follow-up/${student.id}`],
        ([url]) =>
            fetcher(url).then((response) => {
                return response.data;
            }),
        { refreshInterval: 30000 }
    );

    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
    } = useForm<Infer<typeof FollowUpInput>>({
        resolver: superstructResolver(FollowUpInput),
        reValidateMode: 'onChange',
        defaultValues: {
            relationId: student?.relations?.[0]?.id,
            date: moment().format('YYYY-MM-DD'),
            time: moment().format('HH:mm'),
            message: '',
        },
    });

    const onSubmit = (entries: Infer<typeof FollowUpInput>) => {
        handleToastPromise(
            newFollowUpMessage(entries),
            'creation du evenement de suivi'
        ).then((message) => {
            if (typeof message !== 'undefined') {
                if (files.length < 1) {
                    mutate([message, ...followUpMessages])
                    setOpenCreationForm(false);
                    setFiles([]);
                } else {
                    handleToastPromise(
                        uploadDocuments(files, 'follow-up', message.id),
                        'ajout des pièces jointes'
                    ).then((data) => {
                        if (data) {
                            mutate([data, ...followUpMessages])
                        }
                        setOpenCreationForm(false);
                        setFiles([]);
                    });
                }
            }
        });
    }


    const suppressFollowUp = (id) => {
        handleToastPromise(
            deleteFollowUpMessage(id),
            'suppression du evenement de suivi'
        ).then(() => {
            mutate(followUpMessages.filter((message) => message.id !== id));
        });
    }

    return (
        <div className="col-span-12 md:col-span-12 xl:col-span-12 xxl:col-span-12 mt-3">
            <div className="intro-x flex items-center h-10">
                <h2 className="text-lg font-medium truncate w-full">
                    Activités récentes
                    <button onClick={() => setOpenCreationForm(true)} className="text-sm button text-white bg-theme-1 shadow-md ml-auto float-right">Nouvel évènement</button>
                </h2>
            </div>
            {openCreationForm && (
                <CreateFollowUpForm
                    register={register}
                    control={control}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    setOpenCreationForm={setOpenCreationForm}
                    files={files}
                    setFiles={setFiles}
                />
                
            )}
            {/* <div className="intro-x text-gray-500 text-xs text-center my-4">Novembre</div> */}
            <div className="report-timeline mt-5 relative">
                {followUpMessages.map((followUp) => {
                    return (
                        <div key={followUp.id}>
                            <FollowUpMessage
                                followUp={followUp}
                                user={user}
                                suppressFollowUp={suppressFollowUp}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    );
};