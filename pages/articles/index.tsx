import SeoHead from 'components/SeoHead';
import { GetServerSideProps } from 'next';
import { withSessionSsr } from 'lib/service/session/session';
import Layout from 'components/Layout/Layout';

export default function Dashboard({ user }) {
    return (
        <>
            <SeoHead title="OrthEns - Ressources" />
            <Layout title={'Ressources'}>
                <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
                    <h2 className="text-lg font-medium mr-auto">
                        Ressources
                    </h2>
                </div>
                <div className="intro-y grid grid-cols-12 gap-6 mt-5">
                    <a target='_blank' href={'/assets/articles/ANAE_SPRENGER_148-Final.pdf'} className="intro-y col-span-12 md:col-span-6 xl:col-span-4 box">
                        <div className="flex items-center border-b border-gray-200 px-5 py-4">
                            <div className="ml-3 mr-auto">
                                <div className="font-medium">L'apprentissage de la lecture</div> 
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="block font-medium text-base mt-5">Une progression pédagogique construite à partir de statistiques sur l’orthographe du français (d’après Manulex-Morpho): pour les lecteurs débutants et atypiques</div>
                            <div className="text-gray-700 mt-2">Cet article de L. Sprenger-Charolles s’adresse aux professionnels en charge de l’apprentissage de la lecture, à leurs formateurs ainsi qu’aux concepteurs de manuels scolaires. Il propose une progression pédagogique pour l’enseignement des correspondances graphèmes-phonèmes construite à partir de la base de données Manulex (Lété, Sprenger-Charolles &amp; Colé, 2004). Cette progression prend en compte la fréquence ainsi que la consistance des correspondances graphèmes-phonèmes dans les mots.</div>
                        </div>
                    </a>
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
