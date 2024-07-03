import SeoHead from 'components/SeoHead';
import { GetServerSideProps } from 'next';
import { withSessionSsr } from 'lib/service/session/session';
import Layout from 'components/Layout/Layout';
import { UserPlus, Link2 } from 'react-feather';
import Link from 'next/link';
import getRelationList from 'lib/provider/relations/getRelationList';
import { useState } from 'react';
import { RelationList } from 'components/Relation/RelationList';

export default function Relations({ user, relations }) {
    const [relationList, setRelationList] = useState(relations);

    return (
        <>
            <SeoHead title="OrthEns" />
            <Layout title={'Contacts'}>
                <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
                    <h2 className="intro-y text-lg font-medium inline-flex">
                        <Link2/><span className='ml-3'>Mes contacts</span>
                    </h2>
                </div>
                <div className="grid grid-cols-12 gap-6 mt-5">
                    {/* <div className="intro-y col-span-12 flex flex-wrap sm:flex-no-wrap items-center mt-2">
                        <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
                            <div className="w-56 relative text-gray-700">
                                <input type="text" className="input w-56 box pr-10 placeholder-theme-13" placeholder="Recherche..."/>
                                <Search className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"/> 
                            </div>
                        </div>
                    </div> */}
                    <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
                        {relationList?.length > 0 ? (
                            <RelationList
                                relations={relationList}
                                user={user}
                            />
                        ) : (
                            <div className="intro-y col-span-12 text-center items-center justify-center">
                                <div className="text-gray-600 mb-1">Vous n'avez pas encore de contacts sur OrthEns.<br/>Ajouter un patient pour commencez</div>
                                <Link href={'/students/new'} className="button text-white bg-theme-1 shadow-md mr-2 mt-3 inline-flex"><UserPlus className="w-4 h-4 mr-2"/> Ajouter un nouveau patient</Link>
                            </div>
                        )}
                    </div>
                </div>
            </Layout>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = withSessionSsr(
    async ({ req, res }) => {
        const relations = await getRelationList(req.headers);

        return {
            props: {
                user: req.session.user,
                relations: relations ?? [],
            },
        };
    },
    '/auth/sign-in'
);
