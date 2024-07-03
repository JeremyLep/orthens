import SeoHead from 'components/SeoHead';
import { GetServerSideProps } from 'next';
import { withSessionSsr } from 'lib/service/session/session';
import Layout from 'components/Layout/Layout';

export default function Dashboard({ user }) {
    return (
        <>
            <SeoHead title="OrthEns - Dysorthographie" />
            <Layout title={'Dysorthographie'}>
                <div className="intro-y news p-5 box mt-8">
                    <h2 className="intro-y font-medium text-xl sm:text-2xl">
                        Dummy text of the printing and typesetting industry
                    </h2>
                    <div className="intro-y text-gray-700 mt-3 text-xs sm:text-sm"> 12 Juin 2024 <span className="mx-1">•</span> <a className="text-theme-1" href="">Troubles</a> <span className="mx-1">•</span> 8 minutes </div>
                    <div className="intro-y mt-6">
                        <div className="news__preview image-fit">
                            <img alt="" className="rounded-md" src="dist/images/preview-15.jpg"/>
                        </div>
                    </div>
                    <div className="intro-y text-justify leading-relaxed pt-16 sm:pt-6 items-center pb-6">
                        <p className="mb-5">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don&#039;t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn&#039;t anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</p>
                        <p className="mb-5">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of &quot;de Finibus Bonorum et Malorum&quot; (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, &quot;Lorem ipsum dolor sit amet..&quot;, comes from a line in section 1.10.32. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from &quot;de Finibus Bonorum et Malorum&quot; by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</p>
                        <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using &#039;Content here, content here&#039;, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for &#039;lorem ipsum&#039; will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
                    </div>
                    <div className="intro-y flex text-xs sm:text-sm flex-col sm:flex-row items-center mt-5 pt-5 border-t border-gray-200">
                        <div className="flex items-center">
                            <div className="w-12 h-12 flex-none image-fit">
                                <img alt="" className="rounded-full" src="dist/images/profile-3.jpg"/>
                            </div>
                            <div className="ml-3 mr-auto">
                                <a href="" className="font-medium">Charlotte Forst</a>, Auteur 
                                <div className="text-gray-600">Orthophoniste</div>
                            </div>
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
