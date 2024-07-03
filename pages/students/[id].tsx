import { superstructResolver } from "@hookform/resolvers/superstruct";
import { ConversationContent } from "components/Conversation/ConversationContent";
import { DocumentList } from "components/Documents/DocumentList";
import Layout from "components/Layout/Layout";
import SeoHead from "components/SeoHead";
import { FollowUpInput } from "lib/model/struct/followUp/followUpInput";
import getChildDocuments from "lib/provider/document/getChildDocuments";
import getFollowUpChild from "lib/provider/follow-up/getFollowUpChild";
import newFollowUpMessage from "lib/provider/follow-up/newFollowUpMessage";
import getStudent from "lib/provider/students/getStudent";
import { handleToastPromise } from "lib/service/axios/handleToastPromise";
import { withSessionSsr } from "lib/service/session/session";
import moment from "moment";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Gift, HardDrive, Home, List, MessageSquare, Trash2, User } from "react-feather";
import { useForm } from "react-hook-form";
import { Infer } from "superstruct";
import getChildConversation from "lib/provider/conversation/getChildConversation";
import deleteFollowUpMessage from "lib/provider/follow-up/deleteFollowUpMessage";
import uploadDocuments from "lib/provider/document/uploadDocument";
import { CreateFollowUpForm } from "components/FollowUp/CreateFollowUpForm";
import { FollowUpMessage } from "components/FollowUp/FollowUpMessage";
import { FollowUpContent } from "components/FollowUp/FollowUpContent";

export default function StudentProfile({ user, student }) {
    const { query } = useRouter();
    const [activeTab, setActiveTab] = useState('suivi');
    const [conversation, setConversation] = useState(null);
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        if (query.tab) {
            setActiveTab(query.tab as string);
        }
    }, [query]);

    useEffect(() => {
        switch (activeTab) {
            case 'suivi':
                break;
            case 'conversation':
                getChildConversation(student.id).then((data) => {
                    setConversation(data);
                });
                break;
            case 'documents':
                getChildDocuments(student.id).then((data) => {
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
                        Patient
                    </h2>
                </div>
                <div className="intro-y box px-5 pt-5 mt-5">
                    <div className="flex flex-col lg:flex-row border-b border-gray-200 pb-5 -mx-5">
                        <div className="flex flex-1 px-5 items-center justify-center lg:justify-start">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 flex-none lg:w-32 lg:h-32 image-fit relative">
                                <img height={30} width={30} alt="" className="rounded-full" src={`https://ui-avatars.com/api/?name=${student.firstname}+${student.lastname}&format=svg&rounded=true`}/>
                            </div>
                            <div className="ml-5">
                                <div className="w-24 sm:w-40 truncate sm:whitespace-normal font-medium text-lg">{student.firstname} {student.lastname}.</div>
                                <div className="text-gray-600">Patient</div>
                            </div>
                        </div>
                        <div className="flex mt-6 lg:mt-0 items-center lg:items-start flex-1 flex-col justify-center text-gray-600 px-5 border-l border-gray-200 border-t lg:border-t-0 pt-5 lg:pt-0">
                            <div className="truncate sm:whitespace-normal flex items-center"> <Home className="w-4 h-4 mr-2"/> Etablissement: {student.institution} </div>
                            <div className="truncate sm:whitespace-normal flex items-center mt-3"> <User className="w-4 h-4 mr-2"/>
                                Enseignant(s): {' '}
                                {student.relations.map((relation) => (
                                    relation.users.filter((user) => user.profession.toLowerCase() === 'enseignant').map((teacher) => (
                                        <Link key={teacher.id} href={`/professional/${teacher.id}`} className='text-primary'> {teacher.name ?? teacher.email} </Link>
                                    ))
                                ))}
                            </div>
                            <div className="truncate sm:whitespace-normal flex items-center mt-3"> <User className="w-4 h-4 mr-2"/>
                                Orthophoniste(s): {' '}
                                {student.relations.map((relation) => (
                                    relation.users.filter((user) => user.profession.toLowerCase() === 'orthophoniste').map((ortho) => (
                                        <Link key={ortho.id} href={`/professional/${ortho.id}`} className='text-primary'> {ortho.name ?? ortho.email} </Link>
                                    ))
                                ))}
                            </div>
                            <div className="truncate sm:whitespace-normal flex items-center mt-3"> <Gift className="w-4 h-4 mr-2"/> Age: {moment().diff(moment(student.birthYear, "YYYY"), 'years')} ans </div>
                        </div>
                        <div className="mt-6 lg:mt-0 flex-1 flex items-center justify-center"></div>
                    </div>
                    <div className="nav-tabs flex flex-col sm:flex-row justify-center lg:justify-start">
                        <div onClick={() => setActiveTab('suivi')} className={`cursor-pointer py-4 sm:mr-8 flex items-center ${activeTab === 'suivi' ? 'active' : ''}`}> <List className="w-4 h-4 mr-2"/> Suivi </div>
                        <div onClick={() => setActiveTab('conversation')} className={`cursor-pointer py-4 sm:mr-8 flex items-center ${activeTab === 'conversation' ? 'active' : ''}`}> <MessageSquare className="w-4 h-4 mr-2"/> Conversation </div>
                        <div onClick={() => setActiveTab('documents')} className={`cursor-pointer py-4 sm:mr-8 flex items-center ${activeTab === 'documents' ? 'active' : ''}`}> <HardDrive className="w-4 h-4 mr-2"/> Documents </div>
                    </div>
                </div>
                <div className="tab-content mt-5">
                    {activeTab === 'suivi' && (
                        <div className={`tab-content__pane active`} id="suivi">
                            <div className="grid grid-cols-12 gap-6">
                                <FollowUpContent
                                    student={student}
                                    user={user}
                                />
                                
                            </div>
                        </div>
                    )}
                    {activeTab === 'conversation' && (
                        <div className={`tab-content__pane active`} id="conversation">
                            <div className="intro-y chat grid grid-cols-12 gap-5 mt-5">
                                <div className="intro-y col-span-12 lg:col-span-12 xxl:col-span-12">
                                    <div className="chat__box box">
                                        {conversation && (
                                            <ConversationContent
                                                user={user}
                                                conversation={conversation}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'documents' && (
                        <div className={`tab-content__pane ${activeTab === 'documents' ? 'active' : ''}`} id="documents">
                            <DocumentList documents={documents} setDocuments={setDocuments} type={'relation'} relationId={student?.relations?.[0]?.id}/>
                        </div>
                    )}
                </div>
            </Layout>
        </>
    );
}


export const getServerSideProps: GetServerSideProps = withSessionSsr(
    async ({ req, res, params }) => {
        const student = await getStudent(params.id as string, req.headers).catch(() => null);

        if (!student) {
            return {
                notFound: true,
            };
        }

        return {
            props: {
                student: student,
                user: req.session.user ?? null
            },
        };
    },
    '/auth/sign-in'
);
