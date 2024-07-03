import SeoHead from 'components/SeoHead';
import { GetServerSideProps } from 'next';
import { withSessionSsr } from 'lib/service/session/session';
import Layout from 'components/Layout/Layout';
import { ConversationSideMenu } from 'components/Conversation/ConversationSideMenu';
import { ConversationContent } from 'components/Conversation/ConversationContent';
import { ConversationDefault } from 'components/Conversation/ConversationDefault';
import getConversationList from 'lib/provider/conversation/getConversationList';
import { useState } from 'react';
import { MessageSquare } from 'react-feather';

export default function Conversation({ user, conversations }) {
    const [selectedConversation, setSelectedConversation] = useState(null);

    return (
        <>
            <SeoHead title="OrthEns" />
            <Layout title={'Conversations'}>
                <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
                    <div className="w-full sm:w-auto flex items-center mt-3 sm:mt-0">
                        <h2 className="text-lg font-medium inline-flex">
                            <MessageSquare/><span className='ml-3'>Mes conversations</span>
                        </h2>
                    </div>
                </div>
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
            </Layout>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = withSessionSsr(
    async ({ req, res }) => {
        const conversations = await getConversationList(req.headers);

        return {
            props: {
                conversations: conversations,
                user: req.session.user ?? null
            },
        };
    },
    '/auth/sign-in'
);
