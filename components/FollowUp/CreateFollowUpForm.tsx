import { DocumentImage } from "components/Documents/DocumentImage";
import TextEditor from "components/Utils/TextEditor";
import DOMPurify from "isomorphic-dompurify";
import { Controller } from "react-hook-form";
import Dropzone from "react-dropzone";
import draftToHtml from "draftjs-to-html";

export const CreateFollowUpForm = ({
    register,
    control,
    handleSubmit,
    onSubmit,
    setOpenCreationForm,
    files,
    setFiles
}) => {
    const onDrop = (newFiles: File[]) => {
        setFiles([
            ...files,
            ...newFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            )
        ]);
    };

    const removeFile = (name) => {
        setFiles(files.filter((file) => file.name !== name));
    };

    const thumbs = files.map((file) => (
        <div className={'thumb'} key={file.name}>
            <div className={'thumb-inner file w-full'}>
                <DocumentImage height={190} width={190} src={file.preview} mimetype={file.type} title={file.name} />
                <small>{file.name}</small>
            </div>
            <button
                onClick={() => removeFile(file.name)}
                className="thumb-button badge-danger"
            >
                X
            </button>
        </div>
    ));

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="intro-y box p-5 mt-5">
                <div className="grid grid-cols-12 gap-5">
                    <div className="col-span-12 sm:col-span-6">
                        <label>Date</label>
                        <input type="date" {...register('date')} className="input w-full border mt-2" placeholder="Date"/>
                    </div>
                    <div className="col-span-12 sm:col-span-6">
                        <label>Heure</label>
                        <input type="time" {...register('time')} className="input w-full border mt-2" placeholder="Heure"/>
                    </div>
                    <div className="col-span-12">
                        <label>Contenu</label>
                        <Controller
                            name="message"
                            control={control}
                            render={({
                                field: { onChange },
                            }) => (
                                <TextEditor onChange={(e) => onChange(DOMPurify.sanitize(draftToHtml(e)))}/>
                            )}
                        />
                    </div>
                    <div className="col-span-12">
                        <Dropzone onDrop={onDrop}>
                            {({
                                getRootProps,
                                getInputProps,
                            }) => (
                                <section className="container">
                                    <div
                                        {...getRootProps({
                                            className:
                                                'dropzone',
                                        })}
                                    >
                                        <input
                                            {...getInputProps()}
                                        />
                                        <p>
                                            Ajouter des fichiers ici, ou cliquez pour en sélectionner
                                        </p>
                                    </div>
                                    <aside className="thumb-container">
                                        {thumbs}
                                    </aside>
                                </section>
                            )}
                        </Dropzone>
                    </div>
                    <div className="col-span-12 flex items-center justify-end">
                        <button onClick={() => setOpenCreationForm(false)} className="button w-24 justify-center block bg-gray-200 text-gray-600 ml-2">Annuler</button>
                        <button onClick={handleSubmit(onSubmit)} className="button w-24 justify-center block bg-theme-1 text-white ml-2">Ajouter</button>
                    </div>
                </div>
            </div>
        </form>
    );
};