import { DocumentImage } from "components/Documents/DocumentImage";
import moment from "moment";
import { Trash2 } from "react-feather";

export const FollowUpMessage = ({followUp, suppressFollowUp, user}) => {
    return (
        <div key={followUp.id} className="intro-x relative flex items-center mb-3">
            <div className="report-timeline__image">
                <div className="w-10 h-10 flex-none image-fit rounded-full overflow-hidden">
                    <img height={30} width={30} alt="" title={followUp.createdBy.name} src={followUp.createdBy.image ?? `https://ui-avatars.com/api/?name=${followUp.createdBy.name}&format=svg&rounded=true`}/>
                </div>
            </div>
            <div className="box px-5 py-3 ml-4 flex-1 zoom-in">
                <div className="flex items-center">
                    <div className="font-medium">{`${followUp.createdBy.name ?? followUp.createdBy.email }`}</div>
                    <div className="text-xs text-gray-500 ml-auto">{moment(followUp.date).format('LLLL')}</div>
                </div>
                <div className="text-gray-600">
                    <div className="mt-1" dangerouslySetInnerHTML={{__html: followUp.message}}/>
                    <div className="flex mt-2 file">
                        {followUp.files.map((file) => {
                            return (
                                <div key={file.id} className="tooltip w-24 h-24 image-fit mr-2 zoom-in" title={file.name}>
                                    <DocumentImage height={100} width={100} src={file.url} mimetype={file.extension} title={file.name} />
                                </div>
                            );
                        })}
                        {followUp.createdBy.id === user.id && (
                            <div className="w-full">
                                <button onClick={() => suppressFollowUp(followUp.id)} className="float-right w-6 h-6 block bg-theme-6 text-white rounded-full flex-none flex items-center justify-center"> <Trash2 data-feather="send" className="w-3 h-3"/> </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};