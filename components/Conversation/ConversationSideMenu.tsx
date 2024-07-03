import { useEffect, useState } from "react";
import { Search } from "react-feather";

export const ConversationSideMenu = ({ user, conversations, setSelectedConversation, selectedConversation }) => {
    const [filteredConversations, setFilteredConversations] = useState(conversations);

    useEffect(() => {
        setFilteredConversations(conversations);
    }, [conversations])

    const handleSearch = (e) => {
        const search = e.target.value;
        setFilteredConversations(conversations.filter((conversation) => conversation.relation.child.firstname.toLowerCase().includes(search.toLowerCase()) || conversation.relation.child.lastname.toLowerCase().includes(search.toLowerCase())));
    }

    return (
        <div className="col-span-12 lg:col-span-4 xxl:col-span-3">
            <div className="tab-content">
                <div className="tab-content__pane active" id="chats">
                    <div className="pr-1">
                        <div className="box px-5 pt-5 pb-5 lg:pb-0 mt-5">
                            <div className="relative text-gray-700">
                                <input type="text" onChange={handleSearch} className="input input--lg w-full bg-gray-200 pr-10 placeholder-theme-13" placeholder="Rechercher une conversation"/>
                                <Search className="w-4 h-4 sm:absolute my-auto inset-y-0 mr-3 right-0"/> 
                            </div>
                            <div className="overflow-x-auto scrollbar-hidden">
                                <div className="flex mt-5">
                                    {filteredConversations.map((conversation) => {
                                        return (
                                            <div key={conversation.id} onClick={() => setSelectedConversation(conversation)} className="w-10 mr-4 cursor-pointer">
                                                <div key={conversation.id} className={`w-10 h-10 flex-none image-fit rounded-full ${selectedConversation?.id === conversation.id ? 'bg-theme-1' : 'bg-gray-200'}`}>
                                                    <img height={30} width={30} title={`${conversation.relation.child.firstname} ${conversation.relation.child.lastname}`} className="rounded-full" src={`https://ui-avatars.com/api/?name=${conversation.relation.child.firstname}+${conversation.relation.child.lastname}&format=svg&rounded=true`}/>
                                                </div>
                                                <div className="text-xs text-gray-600 truncate text-center mt-2">{conversation.relation.child.firstname} {conversation.relation.child.lastname}.</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="chat__chat-list overflow-y-auto scrollbar-hidden pr-1 pt-1 mt-4">
                        {filteredConversations.map((conversation) => {
                            return (
                                <div onClick={() => setSelectedConversation(conversation)} key={conversation.id} className="intro-x cursor-pointer box relative flex items-center p-5 mt-5">
                                    <div className="w-12 h-12 flex-none image-fit mr-1">
                                        <img height={30} width={30}  className="rounded-full" src={`https://ui-avatars.com/api/?name=${conversation.relation.child.firstname}+${conversation.relation.child.lastname}&format=svg&rounded=true`}/>
                                    </div>
                                    <div className="ml-2 overflow-hidden">
                                        <div className="flex items-center font-medium">{conversation.relation.child.firstname} {conversation.relation.child.lastname}</div>
                                        <div className="w-full text-gray-600">Conversation avec {conversation.relation.users.filter((u) => u.id !== user.id).map((user) => <><span key={user.id} className="text-primary">{user.name ?? user.email}</span>, </>)} à propos de <span className="text-primary">{conversation.relation.child.firstname} {conversation.relation.child.lastname}</span>.</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};