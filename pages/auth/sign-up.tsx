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
import { useState } from 'react';
import signUp from 'lib/provider/auth/signUp';
import { useForm } from 'react-hook-form';
import { Infer, set } from 'superstruct';
import { superstructResolver } from '@hookform/resolvers/superstruct';
import { CreateAccountInput } from 'lib/model/struct/account/createAccountInput';
import { ErrorMessage } from '@hookform/error-message';
import { handleToastPromise } from 'lib/service/axios/handleToastPromise';

export default function SignUp({
    csrfToken,
    providers,
}: {
    csrfToken: string;
    providers: Record<
        LiteralUnion<BuiltInProviderType, string>,
        ClientSafeProvider
    >;
}) {
    const {
        handleSubmit,
        register,
        setError,
        formState: { errors },
    } = useForm<Infer<typeof CreateAccountInput>>({
        resolver: superstructResolver(CreateAccountInput),
        reValidateMode: 'onChange',
        defaultValues: {},
    });
    const [lock, setLock] = useState<boolean>(false);

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


    const onSubmit = (data: Infer<typeof CreateAccountInput>) => {
        if (data.password !== data.confirmPassword) {
            setError('confirmPassword', {message: 'Les mots de passe ne correspondent pas'});
            return;
        }

        if (data.acceptCgu !== true) {
            setError('acceptCgu', {message: 'Vous devez accepter les CGU pour continuer'});
            return;
        }

        setLock(true);

        handleToastPromise(
            signUp(data),
            'inscription',
        ).then(async (response) => {
            if (typeof response !== 'undefined') {
                handleToastPromise(
                    new Promise(r => setTimeout(r, 3000)),
                    'redirection'
                );
                window.location.href = '/dashboard';
            }
        }).finally(() => {
            setLock(false);
        });
    }

    return (
        <>
            <SeoHead title="OrthEns - Inscription" />
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
                                    Encore quelques clics
                                    <br/>
                                    pour créer votre compte.
                                </div>
                                <div className="-intro-x mt-5 text-lg text-white">Gérez votre communication professionnel au même endroit</div>
                            </div>
                        </div>
                        <div className="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
                            <div className="my-auto mx-auto xl:ml-20 bg-white xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
                                <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
                                    S'inscrire sur OrthEns
                                </h2>
                                <div className="intro-x mt-2 text-gray-500 xl:hidden text-center">Encore quelques clics pour créer votre compte. Gérez votre communication professionnel au même endroit</div>
                                <form method="post" onSubmit={handleSubmit(onSubmit)} action="/api/auth/signin/email">
                                    <div className="intro-x mt-8">
                                        {/* <input type="text" className="intro-x login__input input input--lg border border-gray-300 block" placeholder="Prénom"/>
                                        <input type="text" className="intro-x login__input input input--lg border border-gray-300 block mt-4" placeholder="Nom de famille"/> */}
                                        <input {...register('email')} type="email" className="intro-x login__input input input--lg border border-gray-300 block mt-4" placeholder="Email *"/>
                                        <ErrorMessage
                                            errors={errors}
                                            name="email"
                                            render={({ message }) => 
                                                <p className="text-theme-6 mt-2">{message}</p>
                                            }
                                        />
                                        <input {...register('password')} minLength={6} type="password" className="intro-x login__input input input--lg border border-gray-300 block mt-4" placeholder="Mot de passe *"/>
                                        <ErrorMessage
                                            errors={errors}
                                            name="password"
                                            render={({ message }) => 
                                                <p className="text-theme-6 mt-2">{message}</p>
                                            }
                                        />
                                        {/* <div className="intro-x w-full grid grid-cols-12 gap-4 h-1 mt-3">
                                            <div className="col-span-3 h-full rounded bg-theme-9"></div>
                                            <div className="col-span-3 h-full rounded bg-theme-9"></div>
                                            <div className="col-span-3 h-full rounded bg-theme-9"></div>
                                            <div className="col-span-3 h-full rounded bg-gray-200"></div>
                                        </div>
                                        <a href="" className="intro-x text-gray-600 block mt-2 text-xs sm:text-sm">Qu'est ce qu'un mot de passe sécurisé?</a>  */}
                                        <input {...register('confirmPassword')}  minLength={6} type="password" className="intro-x login__input input input--lg border border-gray-300 block mt-4" placeholder="Confirmation de mot de passe *"/>
                                        <ErrorMessage
                                            errors={errors}
                                            name="confirmPassword"
                                            render={({ message }) => 
                                                <p className="text-theme-6 mt-2">{message}</p>
                                            }
                                        />
                                    </div>
                                    <hr className="my-4 mx-auto" />
                                    <div className="intro-x text-center xl:text-left">
                                        <input type="text" {...register('name')} className="intro-x login__input input input--lg border border-gray-300 block mt-4" placeholder="Votre nom et prénom *"/>
                                        <ErrorMessage
                                            errors={errors}
                                            name="name"
                                            render={({ message }) => 
                                                <p className="text-theme-6 mt-2">{message}</p>
                                            }
                                        />
                                        <select className="input w-full border flex-1 mt-4" {...register('profession')}>
                                            <option value="orthophoniste">Orthophoniste</option>
                                            <option value="enseignant">Enseignant</option>
                                        </select>
                                        <ErrorMessage
                                            errors={errors}
                                            name="profession"
                                            render={({ message }) => 
                                                <p className="text-theme-6 mt-2">{message}</p>
                                            }
                                        />
                                        <input type="text" {...register('institution')} className="intro-x login__input input input--lg border border-gray-300 block mt-4" placeholder="Votre cabinet / etablissement"/>
                                        <ErrorMessage
                                            errors={errors}
                                            name="institution"
                                            render={({ message }) => 
                                                <p className="text-theme-6 mt-2">{message}</p>
                                            }
                                        />
                                    </div>
                                    <div className="intro-x flex items-center text-gray-700 mt-4 text-xs sm:text-sm">
                                        <input {...register('acceptCgu')} type="checkbox" className="input border mr-2" id="accept-cgu"/>
                                        <label className="cursor-pointer select-none" htmlFor="accept-cgu">J'accepte les<a className="text-theme-1 ml-1" href="/assets/legal/OrthEns-CGU.pdf" target='_blank'>conditions d'utilisation</a> d'OthEns.</label>
                                    </div>
                                    <ErrorMessage
                                        errors={errors}
                                        name="acceptCgu"
                                        render={({ message }) => 
                                            <p className="text-theme-6 mt-2">{message}</p>
                                        }
                                    />
                                    <div className="intro-x mt-5 xl:mt-8 text-center xl:text-left">
                                        <button disabled={lock} type='submit' className="button button--lg w-full xl:w-32 text-white bg-theme-1 xl:mr-3">S'inscrire</button>
                                        <Link href={'/auth/sign-in'} className="block sm:inline-block button button--lg w-full xl:w-32 text-gray-700 border border-gray-300 mt-3 xl:mt-0">Se connecter</Link>
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
                                                            S'inscrire avec{' '}
                                                            {provider.name}
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900">
                <a
                    href="/"
                    className="flex items-center justify-center mb-8 text-2xl font-semibold lg:mb-10 dark:text-white"
                >
                    <img
                        src="/assets/images/logo.svg"
                        className="mr-4 h-11"
                        alt="OrthEns Logo"
                    />
                </a>
                <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        sign-up.title OrthEns
                    </h2>
                    <div className="mt-5 space-y-6">
                        {Object.values(providers)
                            .filter(
                                (providerFilter) =>
                                    providerFilter.id === 'email'
                            )
                            .map((emailProvider) => {
                                return (
                                    <div
                                        key={emailProvider.name}
                                        className="row m-3"
                                    >
                                        <div className={'form-group col-12'}>
                                            <form
                                                method="post"
                                                action="/api/auth/signin/email"
                                            >
                                                <input
                                                    name="csrfToken"
                                                    type="hidden"
                                                    defaultValue={csrfToken}
                                                />
                                                <div className="mb-3">
                                                    <label
                                                        htmlFor="email"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        sign-up.form.email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        id="email"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        placeholder="name@company.com"
                                                        required
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="w-full px-5 py-3 text-base font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                                >
                                                    sign-up.form.submit
                                                </button>
                                                <div className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    sign-up.already-have-account
                                                    {' '}
                                                    <Link
                                                        href={'/auth/sign-in'}
                                                        className="text-primary-700 hover:underline dark:text-primary-500"
                                                    >
                                                        sign-up.already-have-account.link
                                                    </Link>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                );
                            })}
                        <hr className="my-4 mx-auto" />
                        {Object.values(providers)
                            .filter(
                                (providerFilter) =>
                                    providerFilter.id !== 'email'
                            )
                            .map((provider) => {
                                return (
                                    <div key={provider.name} className="m-3">
                                        <div className={'form-group col-12'}>
                                            <button
                                                className={
                                                    'btn btn-primary btn-block btn-lg inline-flex'
                                                }
                                                onClick={() =>
                                                    signIn(provider.id)
                                                }
                                            >
                                                {renderSocialIcon(provider.id)}
                                                <span className="ps-3">
                                                    sign-up.provider.btn
                                                    {provider.name}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div> */}
        </>
    );
}

export const getServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const { req } = context;
    const session = await getSession({ req });

    if (session) {
        return {
            redirect: { destination: '/dashboard' },
        };
    }

    return {
        props: {
            providers: await getProviders(),
            csrfToken: await getCsrfToken(context)
        },
    };
};
