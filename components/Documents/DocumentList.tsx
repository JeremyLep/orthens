import { FilePlus } from "react-feather";
import { DocumentImage } from "./DocumentImage";
import uploadDocuments from "lib/provider/document/uploadDocument";
import { handleToastPromise } from "lib/service/axios/handleToastPromise";

export const DocumentList = ({ documents, setDocuments, type = null, relationId = null }) => {
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files) as File[];

        handleToastPromise(
            uploadDocuments(files, type, relationId),
            'Envoi des documents'
        ).then((res) => {
            if (res?.files && res.files.length > 0) {
                setDocuments([res.files[0], ...documents]);
            } else if (res) {
                setDocuments([res, ...documents]);
            }
        });
    };

    const formatSize = (sizeInBytes) => {
        const units = ["o", "Ko", "Mo", "Go", "To"];
        let size = sizeInBytes;
        let unitIndex = 0;
      
        while (size >= 1024 && unitIndex < units.length - 1) {
          size /= 1024;
          unitIndex += 1;
        }
      
        return `${size?.toFixed(2)} ${units[unitIndex]}`;
    }

    return (
        <div className="col-span-12 lg:col-span-9 xxl:col-span-10">
            <div className="intro-y flex flex-col-reverse sm:flex-row items-center">
                <div className="w-full sm:w-auto relative mr-auto mt-3 sm:mt-0">
                    {/* <Search className="w-4 h-4 absolute my-auto inset-y-0 ml-3 left-0 z-10 text-gray-700"/> 
                    <input type="text" className="input w-full sm:w-64 box px-10 text-gray-700 placeholder-theme-13" placeholder="Recherche de fichier"/> */}
                </div>
                {type && (
                    <div className="w-full sm:w-auto flex">
                        <input onChange={handleFileChange} type="file" className="w-full h-full top-0 left-0 absolute opacity-0"/>
                        <button className="button text-white bg-theme-1 shadow-md mr-2 inline-flex"><FilePlus className="w-4 h-4 mr-2"/>Charger un nouveau fichier</button>
                    </div>
                )}
            </div>
            <div className="intro-y grid grid-cols-12 gap-3 sm:gap-6 mt-5">
                {documents.map((document) => (
                    <div className="intro-y col-span-6 sm:col-span-4 md:col-span-3 xxl:col-span-2" key={document.id}>
                        <div className="file box rounded-md px-5 pt-8 pb-5 px-3 sm:px-5 relative zoom-in">
                            <DocumentImage src={document.url} height={180} width={180} title={document.name} mimetype={document.extension}/>
                            <a href="" className="block font-medium mt-4 text-center truncate">{document.name}</a> 
                            <div className="text-gray-600 text-xs text-center">{formatSize(document.size)}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};