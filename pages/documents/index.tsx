import SeoHead from 'components/SeoHead';
import { GetServerSideProps } from 'next';
import { withSessionSsr } from 'lib/service/session/session';
import Image from 'next/image';
import Layout from 'components/Layout/Layout';
import { DocumentList } from 'components/Documents/DocumentList';
import { DocumentFilter } from 'components/Documents/DocumentFilter';
import getDocumentList from 'lib/provider/document/getDocumentList';
import { HardDrive } from 'react-feather';
import { useState } from 'react';

export default function Doucments({ user, initDocuments }) {
    const [documents, setDocuments] = useState(initDocuments);
    const [filteredDocuments, setFilteredDocuments] = useState(initDocuments);

    return (
        <>
            <SeoHead title="OrthEns - Documents" />
            <Layout title={'Mes documents'}>
            <div className="grid grid-cols-12 gap-6 mt-8">
                    <div className="col-span-12 lg:col-span-3 xxl:col-span-2">
                        <h2 className="intro-y text-lg font-medium mr-auto mt-2 inline-flex">
                            <HardDrive/><span className='ml-3'>Mes documents</span>
                        </h2>
                        <div className="intro-y box p-5 mt-6">
                            <DocumentFilter setFilteredDocuments={setFilteredDocuments} allDocuments={documents} />
                        </div>
                    </div>
                    <DocumentList documents={filteredDocuments ?? []} setDocuments={setDocuments} type={'user'}/>
                </div>
            </Layout>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = withSessionSsr(
    async ({ req, res }) => {
        const documents = await getDocumentList(req.headers);

        return {
            props: {
                initDocuments: documents,
            },
        };
    },
    '/auth/sign-in'
);
