import SeoHead from 'components/SeoHead';
import { GetServerSideProps } from 'next';
import { withSessionSsr } from 'lib/service/session/session';
import Layout from 'components/Layout/Layout';
import Link from 'next/link';

export default function Dashboard() {
    return (
        <>
            <SeoHead title="OrthEns" />
            <Layout title={'Tableau de bord'}>
                <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
                    <h2 className="text-lg font-medium mr-auto">
                        Tableau de bord
                    </h2>
                </div>
                <div className="pos intro-y grid grid-cols-12 gap-5 mt-5">
                    <div className="intro-y col-span-12 lg:col-span-8">
                        <div className="grid grid-cols-12 gap-5 mt-5">
                            <Link href={'/conversations'} className="col-span-12 sm:col-span-6 xxl:col-span-6 box p-5 cursor-pointer zoom-in">
                                <div className="font-medium text-base">Mes conversations</div>
                                <div className="text-gray-600 pt-3">Retrouvez toutes vos conversations avec les enseignants/orthophonistes</div>
                            </Link>
                            <Link href={'/relations'} className="col-span-12 sm:col-span-6 xxl:col-span-6 box p-5 cursor-pointer zoom-in">
                                <div className="font-medium text-base">Mes contacts</div>
                                <div className="text-gray-600 pt-3">Retrouvez tous vos contacts au sujet d’un patient créé sur la plateforme</div>
                            </Link>
                            <Link href={'/students/new'} className="col-span-12 sm:col-span-6 xxl:col-span-6 box p-5 cursor-pointer zoom-in">
                                <div className="font-medium text-base">Ajouter un patient sur la plateforme</div>
                                <div className="text-gray-600 pt-3">Ajoutez un patient sur la plateforme et invitez leurs enseignants/orthophonistes à vous rejoindre !</div>
                            </Link>
                            <Link href={'/documents'} className="col-span-12 sm:col-span-6 xxl:col-span-6 box p-5 cursor-pointer zoom-in">
                                <div className="font-medium text-base">Mes documents</div>
                                <div className="text-gray-600 pt-3">Retrouvez tous vos documents et ceux partagés avec vous !</div>
                            </Link>
                            <Link href={'/account'} className="col-span-12 sm:col-span-6 xxl:col-span-6 box p-5 cursor-pointer zoom-in">
                                <div className="font-medium text-base">Mon compte</div>
                                <div className="text-gray-600 pt-3">Configurez votre compte pour modifier votre mot de passe ou votre profil</div>
                            </Link>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = withSessionSsr(
    async ({ req, res }) => {
        return {
            props: {},
        };
    },
    '/auth/sign-in'
);
