import { useEffect, useState } from "react";
import { File, Image, Grid, Link, Video } from "react-feather";

export const DocumentFilter = ({setFilteredDocuments, allDocuments}) => {
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        switch (filter) {
            case 'all':
                setFilteredDocuments(allDocuments)
                break;
            case 'image':
                setFilteredDocuments(allDocuments.filter((d) => [
                    'image/jpeg',
                    'image/png',
                    'image/gif',
                    'image/svg+xml',
                    'image/bmp',
                    'image/webp',
                ].includes(d.extension)))
                break;
            case 'video':
                setFilteredDocuments(allDocuments.filter((d) => [
                    'video/mp4',
                    'video/webm',
                    'video/ogg',
                    'video/3gpp',
                    'video/3gpp2',
                    'audio/mpeg',
                    'audio/ogg',
                    'audio/wav',
                    'audio/3gpp',
                    'audio/3gpp2',
                    'audio/*',
                ].includes(d.extension)));
                break;
            case 'document':
                setFilteredDocuments(allDocuments.filter((d) => [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.oasis.opendocument.text',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.oasis.opendocument.spreadsheet',
                    'text/csv',
                    'application/vnd.ms-powerpoint',
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    'application/vnd.oasis.opendocument.presentation',
                    'text/plain',
                    'application/zip',
                    'application/x-rar-compressed',
                    'application/x-7z-compressed',
                    'application/octet-stream'
                ].includes(d.extension)));
                break;
            case 'shared':
                setFilteredDocuments(allDocuments.filter((d) => d.relationId || d.conversationMessageId || d.followUpMessageId));
                break;
            default:
                break;
        }
    }, [filter])

    return (
        <div className="mt-1">
            <button onClick={() => setFilter('all')} className={`flex w-full items-center px-3 py-2 rounded-md ${filter === 'all' ? 'bg-theme-1 text-white font-medium' : ''}`}> <Grid className="w-4 h-4 mr-2"/> Tous </button>
            <button onClick={() => setFilter('image')} className={`flex w-full items-center px-3 py-2 mt-2 rounded-md ${filter === 'image' ? 'bg-theme-1 text-white font-medium' : ''}`}> <Image className="w-4 h-4 mr-2"/> Images </button>
            <button onClick={() => setFilter('video')} className={`flex w-full items-center px-3 py-2 mt-2 rounded-md ${filter === 'video' ? 'bg-theme-1 text-white font-medium' : ''}`}> <Video className="w-4 h-4 mr-2"/> Audios / Videos </button>
            <button onClick={() => setFilter('document')} className={`flex w-full items-center px-3 py-2 mt-2 rounded-md ${filter === 'document' ? 'bg-theme-1 text-white font-medium' : ''}`}> <File className="w-4 h-4 mr-2"/> Documents </button>
            <button onClick={() => setFilter('shared')} className={`flex w-full items-center px-3 py-2 mt-2 rounded-md ${filter === 'shared' ? 'bg-theme-1 text-white font-medium' : ''}`}> <Link className="w-4 h-4 mr-2"/> Partagés </button>
        </div>
    );
}