import SeoHead from 'components/SeoHead';
import { GetServerSidePropsContext } from 'next';
import { BuiltInProviderType } from 'next-auth/providers';
import {
    ClientSafeProvider,
    LiteralUnion,
    getCsrfToken,
    getProviders,
    getSession,
    signIn,
} from 'next-auth/react';
import LinkedinIcon from 'public/assets/icons/linkedin.svg';
import GoogleIcon from 'public/assets/icons/google.svg';
import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';

export default function SignIn({
    csrfToken,
    providers,
}: {
    csrfToken: string;
    providers: Record<
        LiteralUnion<BuiltInProviderType, string>,
        ClientSafeProvider
    >;
}) {
    const renderSocialIcon = (social: string) => {
        switch (social) {
            case 'google':
                return <GoogleIcon height={30} width={30} />;
            case 'linkedin':
                return <LinkedinIcon height={30} width={30} />;
            default:
                return <></>;
        }
    };

    return (
        <>
            <SeoHead title="OrthEns - Connexion" />
            <div className="login xl:block contents">
                <div className="container sm:px-10">
                    <div className="block xl:grid grid-cols-2 gap-4">
                        <div className="hidden xl:flex flex-col min-h-screen">
                            <a href="" className="-intro-x flex items-center pt-5">
                                <Image height={30} width={200} alt="OrthEns" className="" src="/assets/images/logo-white.svg"/>
                            </a>
                            <div className="my-auto">
                                <Image height={150} width={30} alt="OrthEns" className="-intro-x w-1/2 -mt-16" src="/assets/images/illustration.svg"/>
                                <div className="-intro-x text-white font-medium text-4xl leading-tight mt-10">
                                    Connectez vous
                                    <br/>
                                    en seulement quelques clics
                                </div>
                                <div className="-intro-x mt-5 text-lg text-white">Gérez votre communication professionnel au même endroit</div>
                            </div>
                        </div>
                        <div className="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
                            <div className="my-auto mx-auto xl:ml-20 bg-white xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
                                <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
                                    Se connecter
                                </h2>
                                <div className="intro-x mt-2 text-gray-500 xl:hidden text-center">Connectez vous en seulement quelques clics. Gérez votre communication professionnel au même endroit</div>
                                <form
                                    method="post"
                                    action="/api/auth/callback/credentials"
                                >
                                    <div className="intro-x mt-8">
                                        <input
                                            name="csrfToken"
                                            type="hidden"
                                            defaultValue={csrfToken}
                                        />
                                        <input type="email" name="email" className="intro-x login__input input input--lg border border-gray-300 block" placeholder="Email"/>
                                        <input type="password" name="password" className="intro-x login__input input input--lg border border-gray-300 block mt-4" placeholder="Mot de passe"/>
                                    </div>
                                    <div className="intro-x flex text-gray-700 text-xs sm:text-sm mt-4">
                                        <Link href={'/account/reset-password'}>Mot de passe oublié?</Link> 
                                    </div>
                                    <div className="intro-x mt-5 xl:mt-8 text-center xl:text-left pb-5">
                                        <button type="submit" className="button button--lg w-full xl:w-32 text-white bg-theme-1 xl:mr-3">Se connecter</button>
                                        <Link href={'/auth/sign-up'} className="block sm:inline-block button button--lg w-full xl:w-32 text-gray-700 border border-gray-300 mt-3 xl:mt-0">S'inscrire</Link>
                                    </div>
                                </form>
                                <hr className="my-4 mx-auto pb-5" />
                                {Object.values(providers)
                                    .filter(
                                        (providerFilter) =>
                                            providerFilter.id !== 'credentials'
                                    )
                                    .map((provider) => {
                                        return (
                                            <div key={provider.name} className="m-3">
                                                <div className={'form-group col-12'}>
                                                    <button
                                                        className={
                                                            'button button--lg w-full text-gray-700 border border-gray-300 mt-3 xl:mt-0 inline-flex'
                                                        }
                                                        onClick={() =>
                                                            signIn(provider.id)
                                                        }
                                                    >
                                                        {renderSocialIcon(provider.id)}
                                                        <span className="ps-3 m-auto">
                                                            Se connecter avec{' '}
                                                            {provider.name}
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                                <div className="intro-x mt-5 xl:mt-16 text-gray-700 text-center xl:text-left">
                                    En vous connectant vous acceptez nos 
                                    <br/>
                                    <a className="text-theme-1" target='_blank' href="/public/assets/legal/OrthEns-CGU.pdf">Condition d'utilisation</a> & <a className="text-theme-1" href="">Politique de confidentialité</a> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export const getServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const { req, res } = context;
    const session = await getServerSession(req, res, authOptions);

    if (session) {
        return {
            redirect: { destination: '/dashboard' },
         };
    }

    const csrfToken = await getCsrfToken(context);
    const providers = await getProviders();

    return {
        props: {
            providers: providers,
            csrfToken: csrfToken,
        },
    };
};
