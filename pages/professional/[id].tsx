import { ConversationContent } from "components/Conversation/ConversationContent";
import { ConversationDefault } from "components/Conversation/ConversationDefault";
import { ConversationSideMenu } from "components/Conversation/ConversationSideMenu";
import { DocumentList } from "components/Documents/DocumentList";
import Layout from "components/Layout/Layout";
import SeoHead from "components/SeoHead";
import getProfessionalConversations from "lib/provider/conversation/getProfessionalConversations";
import getProfessionalDocument from "lib/provider/document/getProfessionalDocuments";
import getProfessional from "lib/provider/professional/getProfessional";
import { withSessionSsr } from "lib/service/session/session";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { HardDrive, Home, Mail, MapPin, MessageSquare, Phone } from "react-feather";

export default function StudentProfile({ user, professional}) {
    const [activeTab, setActiveTab] = useState('conversation');
    const [conversations, setConversations] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);

    useEffect(() => {
        switch (activeTab) {
            case 'conversation':
                getProfessionalConversations(professional.id).then((data) => {
                    setConversations(data);
                });
                break;
            case 'document':
                getProfessionalDocument(professional.id).then((data) => {
                    setDocuments(data);
                });
                break;
            default:
                break;
        }
    }, [activeTab]);

    return (
        <>
            <SeoHead title="OrthEns" />
            <Layout title={'Patients'}>
                <div className="intro-y flex items-center mt-8">
                    <h2 className="text-lg font-medium mr-auto">
                        Professionel
                    </h2>
                </div>
                <div className="intro-y box px-5 pt-5 mt-5">
                    <div className="flex flex-col lg:flex-row border-b border-gray-200 pb-5 -mx-5">
                        <div className="flex flex-1 px-5 items-center justify-center lg:justify-start">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 flex-none lg:w-32 lg:h-32 image-fit relative">
                                <img height={30} width={30} className="rounded-full" src={professional.image ?? `https://ui-avatars.com/api/?name=${professional.name}&format=svg&rounded=true`}/>
                            </div>
                            <div className="ml-5">
                                <div className="w-24 sm:w-40 truncate sm:whitespace-normal font-medium text-lg">{professional.name ?? professional.email}</div>
                                <div className="text-gray-600">{professional.profession}</div>
                            </div>
                        </div>
                        <div className="flex mt-6 lg:mt-0 items-center lg:items-start flex-1 flex-col justify-center text-gray-600 px-5 border-l border-gray-200 border-t lg:border-t-0 pt-5 lg:pt-0">
                            <div className="truncate sm:whitespace-normal flex items-center"> <Home className="w-4 h-4 mr-2"/> Etablissement: {professional.institution} </div>
                            <div className="truncate sm:whitespace-normal flex items-center mt-3"> <Mail className="w-4 h-4 mr-2"/> {professional.email} </div>
                            {professional.isAddressPublic && (
                                <div className="truncate sm:whitespace-normal flex items-center mt-3"> <MapPin className="w-4 h-4 mr-2"/> {professional.address}, {professional.postcode}, {professional.city} </div>
                            )}
                            {professional.isPhonePublic && (
                                <div className="truncate sm:whitespace-normal flex items-center mt-3"> <Phone className="w-4 h-4 mr-2"/> {professional.phone}</div>
                            )}
                        </div>
                        <div className="mt-6 lg:mt-0 flex-1 flex items-center justify-center"></div>
                    </div>
                    <div className="nav-tabs flex flex-col sm:flex-row justify-center lg:justify-start">
                        {/* <div onClick={() => setActiveTab('suivi')} className={`cursor-pointer py-4 sm:mr-8 flex items-center ${activeTab === 'suivi' ? 'active' : ''}`}> <List className="w-4 h-4 mr-2"/> Suivi en commun </div> */}
                        <div onClick={() => setActiveTab('conversation')} className={`cursor-pointer py-4 sm:mr-8 flex items-center ${activeTab === 'conversation' ? 'active' : ''}`}> <MessageSquare className="w-4 h-4 mr-2"/> Conversation en commun </div>
                        <div onClick={() => setActiveTab('document')} className={`cursor-pointer py-4 sm:mr-8 flex items-center ${activeTab === 'document' ? 'active' : ''}`}> <HardDrive className="w-4 h-4 mr-2"/> Documents partagés </div>
                    </div>
                </div>
                <div className="tab-content mt-5">
                    <div className={`tab-content__pane ${activeTab === 'conversation' ? 'active' : ''}`} id="conversation">
                        <div className="intro-y chat grid grid-cols-12 gap-5 mt-5">
                            <ConversationSideMenu
                                setSelectedConversation={setSelectedConversation}
                                selectedConversation={selectedConversation}
                                conversations={conversations}
                                user={user}
                            />
                            <div className="intro-y col-span-12 lg:col-span-8 xxl:col-span-9">
                                <div className="chat__box box">
                                    {selectedConversation !== null ? (
                                        <ConversationContent user={user} conversation={selectedConversation} />
                                    ) : (
                                        <ConversationDefault user={user}/>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`tab-content__pane ${activeTab === 'document' ? 'active' : ''}`} id="document">
                        <DocumentList documents={documents} setDocuments={setDocuments}/>
                    </div>
                </div>
            </Layout>
        </>
    );
}


export const getServerSideProps: GetServerSideProps = withSessionSsr(
    async ({ req, res, params }) => {
        const professional = await getProfessional(params.id as string, req.headers).catch(() => null);

        if (!professional) {
            return {
                notFound: true,
            };
        }

        return {
            props: {
                professional: professional,
                user: req.session.user ?? null
            },
        };
    },
    '/auth/sign-in'
);
