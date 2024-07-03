import Image from "next/image";

export const DocumentImage = ({
    src,
    mimetype,
    title,
    height,
    width
}) => {
    switch (mimetype) {
        case 'image/jpeg':
        case 'image/png':
        case 'image/gif':
        case 'image/bmp':
        case 'image/webp':
        case 'image/svg+xml':
            return <a href={src} target="_blank"><Image height={height} width={width} className="w-full" alt={title} src={src} title={title}/></a>
        case 'video/mp4':
        case 'video/webm': 
        case 'video/ogg':
        case 'video/3gpp':
        case 'video/3gpp2':
            return <a href={src} target="_blank" className="w-full file__icon file__icon--file mx-auto">
                <div className="file__icon__file-name">Vidéo</div>
            </a>
        case 'audio/mpeg':
        case 'audio/ogg':
        case 'audio/*':
        case 'audio/wav':
        case 'audio/3gpp':
        case 'audio/3gpp2':
            return <a href={src} target="_blank" className="w-full file__icon file__icon--file mx-auto">
                <div className="file__icon__file-name">Audio</div>
            </a>
        case 'application/pdf':
            return <a href={src} target="_blank" className="w-full file__icon file__icon--file mx-auto">
                <div className="file__icon__file-name">PDF</div>
            </a>
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/vnd.oasis.opendocument.text':
            return <a href={src} target="_blank" className="w-full file__icon file__icon--file mx-auto">
                <div className="file__icon__file-name">Word</div>
            </a>
        case 'application/vnd.ms-excel':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        case 'application/vnd.oasis.opendocument.spreadsheet':
        case 'text/csv':
            return <a href={src} target="_blank" className="w-full file__icon file__icon--file mx-auto">
                <div className="file__icon__file-name">Excel</div>
            </a>
        case 'application/vnd.ms-powerpoint':
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        case 'application/vnd.oasis.opendocument.presentation':
            return <a href={src} target="_blank" className="w-full file__icon file__icon--file mx-auto">
                <div className="file__icon__file-name">PowerPoint</div>
            </a>
        case 'text/plain':
            return <a href={src} target="_blank" className="w-full file__icon file__icon--file mx-auto">
                <div className="file__icon__file-name">Texte</div>
            </a>
        case 'application/zip':
        case 'application/x-rar-compressed':
        case 'application/x-7z-compressed':
            return <a href={src} target="_blank" className="w-full file__icon file__icon--directory mx-auto"></a>
        case 'application/octet-stream':
        default:
            return <a href={src} target="_blank" className="w-full file__icon file__icon--file mx-auto">
                <div className="file__icon__file-name">Inconnu</div>
            </a>
    }    
};