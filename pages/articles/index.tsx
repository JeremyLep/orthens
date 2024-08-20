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
                                <div className="font-medium">La dyslexie</div> 
                                <div className="flex text-gray-600 truncate text-xs mt-1"> <a className="text-theme-1 inline-block truncate" href="">Troubles</a> <span className="mx-1">•</span> 5 minutes </div>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="h-40 xxl:h-56 image-fit">
                                <img alt="" className="rounded-md" src="dist/images/preview-14.jpg"/>
                            </div>
                            <div className="block font-medium text-base mt-5">Desktop publishing software like Aldus PageMaker</div>
                            <div className="text-gray-700 mt-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&#039;s standard dummy text ever since the 1500</div>
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
