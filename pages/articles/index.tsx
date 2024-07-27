import SeoHead from 'components/SeoHead';
import { GetServerSideProps } from 'next';
import { withSessionSsr } from 'lib/service/session/session';
import Layout from 'components/Layout/Layout';
import Link from 'next/link';

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
                    <Link href={'/articles/dyslexie'} className="intro-y col-span-12 md:col-span-6 xl:col-span-4 box">
                        <div className="flex items-center border-b border-gray-200 px-5 py-4">
                            <div className="w-10 h-10 flex-none image-fit">
                                <img alt="" className="rounded-full" src="dist/images/profile-14.jpg"/>
                            </div>
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
                    </Link>
                    <Link href={'/articles/dysorthographie'} className="intro-y col-span-12 md:col-span-6 xl:col-span-4 box">
                        <div className="flex items-center border-b border-gray-200 px-5 py-4">
                            <div className="w-10 h-10 flex-none image-fit">
                                <img alt="" className="rounded-full" src="dist/images/profile-13.jpg"/>
                            </div>
                            <div className="ml-3 mr-auto">
                                <div className="font-medium">La dysorthographie</div> 
                                <div className="flex text-gray-600 truncate text-xs mt-1"> <a className="text-theme-1 inline-block truncate" href="">Troubles</a> <span className="mx-1">•</span> 8 minutes </div>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="h-40 xxl:h-56 image-fit">
                                <img alt="" className="rounded-md" src="dist/images/preview-14.jpg"/>
                            </div>
                            <div className="block font-medium text-base mt-5">200 Latin words, combined with a handful of model sentences</div>
                            <div className="text-gray-700 mt-2">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomi</div>
                        </div>
                    </Link>
                    <Link href={'/articles/dysgraphie'} className="intro-y col-span-12 md:col-span-6 xl:col-span-4 box pointer">
                        <div className="flex items-center border-b border-gray-200 px-5 py-4">
                            <div className="w-10 h-10 flex-none image-fit">
                                <img alt="" className="rounded-full" src="dist/images/profile-6.jpg"/>
                            </div>
                            <div className="ml-3 mr-auto">
                                <div className="font-medium">La dysgraphie</div>
                                <div className="flex text-gray-600 truncate text-xs mt-1"> <a className="text-theme-1 inline-block truncate" href="">Troubles</a> <span className="mx-1">•</span> 11 minutes </div>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="h-40 xxl:h-56 image-fit">
                                <img alt="" className="rounded-md" src="dist/images/preview-7.jpg"/>
                            </div>
                            <div className="block font-medium text-base mt-5">Popularised in the 1960s with the release of Letraset</div>
                            <div className="text-gray-700 mt-2">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 20</div>
                        </div>
                    </Link>
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
