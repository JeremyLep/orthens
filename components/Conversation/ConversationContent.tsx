import { DocumentImage } from "components/Documents/DocumentImage";
import sendMessage from "lib/provider/conversation/sendMessage";
import uploadDocuments from "lib/provider/document/uploadDocument";
import { handleToastPromise } from "lib/service/axios/handleToastPromise";
import { fetcher } from "lib/service/utils/fetcher";
import moment from "moment";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Paperclip, Send, Smile } from "react-feather";
import useSWR from "swr";

export const ConversationContent = ({ conversation, user }) => {
    const [messageContent, setMessageContent] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [files, setFiles] = useState([]);
    const containerRef = useRef(null);
    const dropdownRef = useRef(null);

    const { data: messages = [], mutate } = useSWR(
        [`/api/conversation/${conversation.id}/messages`],
        ([url]) =>
            fetcher(url).then((response) => {
                return response.data;
            }),
        { refreshInterval: 30000 }
    );

    const sendMessageConversation = () => {
        let content = messageContent.trim();

        if (messageContent === '' && files.length === 0) {
            return;
        } else if (messageContent === '' && files.length > 0) {
            content = ' ';
        }

        sendMessage(
            conversation.id,
            {
                message: content
            }
        ).then((res) => {
            if (res) {
                setMessageContent('');
                if (files.length > 0) {
                    handleToastPromise(
                        uploadDocuments(files, 'conversation', res.id),
                        'Envoi des documents'
                    ).then((resFile) => {
                        if (resFile) {
                            mutate([...messages, resFile]);    
                        }
                    });
                } else {
                    mutate([...messages, res]);
                }

                setFiles([]);
            }
        });
    };

    useEffect(() => {
        const element = containerRef.current;

        if (element) {
            element.scrollTop = element.scrollHeight;
        }
    }, [messages]);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);

        setFiles(
            [
                ...files,
                ...newFiles.map((file: any) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                )
            ]
        );
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
        <div className="h-full flex flex-col">
            <div className="flex flex-col sm:flex-row border-b border-gray-200 px-5 py-4">
                <div className="flex items-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex-none image-fit relative">
                        <img height={30} width={30} alt="" className="rounded-full" src={`https://ui-avatars.com/api/?name=${conversation.relation.child.firstname}+${conversation.relation.child.lastname}&format=svg&rounded=true`}/>
                    </div>
                    <div className="ml-3 mr-auto">
                        <Link href={`/students/${conversation.relation.child.id}`} className="cursor-pointer font-medium text-base">{conversation.relation.child.firstname} {conversation.relation.child.lastname}.</Link>
                        <div className="text-gray-600 text-xs sm:text-sm">Conversation avec {conversation.relation.users.filter((u) => u.id !== user.id).map((user) => <><Link key={user.id} className="text-primary" href={`/professional/${user.id}`}>{user.name ?? user.email}</Link>, </>)} à propos de <Link className="text-primary" href={`/students/${conversation.relation.child.id}`}>{conversation.relation.child.firstname} {conversation.relation.child.lastname}</Link>.</div>
                    </div>
                </div>
            </div>
            <div className="overflow-y-scroll px-5 pt-5 flex-1" ref={containerRef}>
                {messages?.map((message) => {
                    return (
                        <div key={message.id}>
                            <div className={`chat__box__text-box flex items-end float-${user.id === message.createdBy.id ? 'right' : 'left'} mb-4`}>
                                <div className="w-10 h-10 block flex-none image-fit relative mr-5">
                                    <img height={30} width={30} alt="" className="rounded-full" title={message.createdBy.name} src={message.createdBy.image ?? `https://ui-avatars.com/api/?name=${message.createdBy.name}&format=svg&rounded=true`}/>
                                </div>
                                
                                <div className={`bg-${user.id === message.createdBy.id ? 'gray-200' : 'primary-light'} px-4 py-3 text-gray-700 rounded-r-md rounded-t-md`}>
                                    {message.message}
                                    {message.files.length > 0 && (
                                        <div className="mt-2 mb-2 file">
                                            {message.files.map((document) => (
                                                <div key={document.id} className="flex items-center mt-2">
                                                    <DocumentImage height={120} width={120} src={document.url} mimetype={document.extension} title={document.name} />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="mt-1 text-xs text-gray-600">{moment(message.createdAt)
                                        .startOf('minutes')
                                        .fromNow()}</div>
                                </div>
                            </div>
                            <div className="clear-both"></div>
                        </div>
                    )
                })}
            </div>
            <div className="pt-4 pb-10 sm:py-4 flex items-center border-t border-gray-200">
                <textarea onChange={(text) => setMessageContent(text.target.value)} value={messageContent} className="chat__box__input input w-full h-16 resize-none border-transparent px-5 py-3 focus:shadow-none" rows={1} placeholder="Ecrivez votre message..."></textarea>
                <div className="flex absolute sm:static left-0 bottom-0 ml-5 sm:ml-0 mb-5 sm:mb-0">
                    <div className="cursor-pointer dropdown relative mr-3 sm:mr-5" ref={dropdownRef}>
                        <span className="dropdown-toggle w-4 h-4 sm:w-5 sm:h-5 block text-gray-500" onClick={() => setIsDropdownOpen(!isDropdownOpen)}> <Smile /> </span>
                        {isDropdownOpen && (
                            <div className="chat-dropdown absolute w-40 top-0 left-0 sm:left-auto sm:right-0 z-20">
                                <div className="dropdown-box__content">
                                    <div className="chat-dropdown__box box flex flex-col pb-3 -mt-2">
                                        <div className="tab-content overflow-hidden mt-5">
                                            <div className="h-full tab-content__pane active" id="history">
                                                <div className="font-medium px-3">Ajouter un Emoji</div>
                                                <div className="h-full pb-10 px-2 overflow-y-auto scrollbar-hidden mt-2">
                                                    <div className="grid grid-cols-8 text-2xl">
                                                        <button onClick={() => setMessageContent(`${messageContent}😀`)} className="rounded focus:outline-none hover:bg-gray-200">😀</button>
                                                        <button onClick={() => setMessageContent(`${messageContent}😁`)} className="rounded focus:outline-none hover:bg-gray-200">😁</button>
                                                        <button onClick={() => setMessageContent(`${messageContent}😂`)} className="rounded focus:outline-none hover:bg-gray-200">😂</button>
                                                        <button onClick={() => setMessageContent(`${messageContent}🐵`)} className="rounded focus:outline-none hover:bg-gray-200">🐵</button>
                                                        <button onClick={() => setMessageContent(`${messageContent}🐒`)} className="rounded focus:outline-none hover:bg-gray-200">🐒</button>
                                                        <button onClick={() => setMessageContent(`${messageContent}🍇`)} className="rounded focus:outline-none hover:bg-gray-200">🍇</button>
                                                        <button onClick={() => setMessageContent(`${messageContent}🍈`)} className="rounded focus:outline-none hover:bg-gray-200">🍈</button>
                                                        <button onClick={() => setMessageContent(`${messageContent}🍉`)} className="rounded focus:outline-none hover:bg-gray-200">🍉</button>
                                                        <button onClick={() => setMessageContent(`${messageContent}🎃`)} className="rounded focus:outline-none hover:bg-gray-200">🎃</button>
                                                        <button onClick={() => setMessageContent(`${messageContent}🎄`)} className="rounded focus:outline-none hover:bg-gray-200">🎄</button>
                                                        <button onClick={() => setMessageContent(`${messageContent}🎆`)} className="rounded focus:outline-none hover:bg-gray-200">🎆</button>
                                                        <button onClick={() => setMessageContent(`${messageContent}🎇`)} className="rounded focus:outline-none hover:bg-gray-200">🎇</button>
                                                        <button onClick={() => setMessageContent(`${messageContent}✨`)} className="rounded focus:outline-none hover:bg-gray-200">✨</button>
                                                        <button onClick={() => setMessageContent(`${messageContent}🎈`)} className="rounded focus:outline-none hover:bg-gray-200">🎈</button>
                                                        <button onClick={() => setMessageContent(`${messageContent}🌍`)} className="rounded focus:outline-none hover:bg-gray-200">🌍</button>
                                                        <button onClick={() => setMessageContent(`${messageContent}🌎`)} className="rounded focus:outline-none hover:bg-gray-200">🌎</button>
                                                        <button onClick={() => setMessageContent(`${messageContent}🌏`)} className="rounded focus:outline-none hover:bg-gray-200">🌏</button>
                                                        <button onClick={() => setMessageContent(`${messageContent}🌐`)} className="rounded focus:outline-none hover:bg-gray-200">🌐</button>
                                                        <button onClick={() => setMessageContent(`${messageContent}🗺️`)} className="rounded focus:outline-none hover:bg-gray-200">🗺️</button>
                                                        <button onClick={() => setMessageContent(`${messageContent}🔇`)} className="rounded focus:outline-none hover:bg-gray-200">🔇</button>
                                                        <button onClick={() => setMessageContent(`${messageContent}🔈`)} className="rounded focus:outline-none hover:bg-gray-200">🔈</button>
                                                        <button onClick={() => setMessageContent(`${messageContent}🏧`)} className="rounded focus:outline-none hover:bg-gray-200">🏧</button>
                                                        <button onClick={() => setMessageContent(`${messageContent}🚮`)} className="rounded focus:outline-none hover:bg-gray-200">🚮</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 relative text-gray-500 mr-3 sm:mr-5 cursor-pointer">
                        <Paperclip className="w-full h-full"/>
                        <input onChange={handleFileChange} type="file" className="cursor-pointer w-full h-full top-0 left-0 absolute opacity-0"/>
                    </div>
                </div>
                <button onClick={sendMessageConversation} className="w-8 h-8 sm:w-10 sm:h-10 block bg-theme-1 text-white rounded-full flex-none flex items-center justify-center mr-5"> <Send data-feather="send" className="w-4 h-4"/> </button>
            </div>
            <aside className="thumb-container">
                {thumbs}
            </aside>
        </div>
    );
};