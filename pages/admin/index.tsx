import SeoHead from 'components/SeoHead';
import { GetServerSideProps } from 'next';
import { withSessionSsr } from 'lib/service/session/session';
import Layout from 'components/Layout/Layout';
import getProfile from 'lib/provider/user/getProfile';
import { RelationList } from 'components/Relation/RelationList';
import { useEffect, useState } from 'react';
import getRelationListAdmin from 'lib/provider/relations/getRelationListAdmin';
import { RoleType } from 'lib/constants/roleType';

export default function Admin({ user }) {
    const [relationList, setRelationList] = useState([]);

    useEffect(() => {
        getRelationListAdmin().then((data) => {
            setRelationList(data);
        });
    }, []);
    return (
        <>
            <SeoHead title="OrthEns" />
            <Layout title={'Tableau de bord'}>
                <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
                    <h2 className="text-lg font-medium mr-auto">
                        Espace d'administration
                    </h2>
                </div>
                <div className="text-gray">
                    Vous avez accès à toutes les relations entre les professionnels et les patients ainsi qu'au profil "Patient".
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
        if (req.session.user.role !== RoleType.ROLE_ADMIN) {
            return {
                notFound: true,
            };
        }

        return {
            props: {
                user: req.session.user,
            },
        };
    },
    '/auth/sign-in'
);
