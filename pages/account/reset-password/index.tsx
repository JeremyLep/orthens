import SeoHead from 'components/SeoHead';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { handleToastPromise } from 'lib/service/axios/handleToastPromise';
import { useState } from 'react';
import resetRequestPassword from 'lib/provider/user/resetRequestPassword';

export default function ResetRequestPassword() {
    const [email, setEmail] = useState('');

    const onSubmit = () => {
        handleToastPromise(
            resetRequestPassword(email),
            'demande de réinitialisation de mot de passe'
        );
    }

    return (
        <>
            <SeoHead title="OrthEns - Renouvellement de mot de passe" />
            <div className="login xl:block contents">
                <div className="container sm:px-10">
                    <div className="block xl:grid grid-cols-2 gap-4">
                        <div className="hidden xl:flex flex-col min-h-screen">
                            <a href="" className="-intro-x flex items-center pt-5">
                                <Image height={30} width={200} alt="OrthEns" className="" src="/assets/images/logo-white.svg"/>
                            </a>
                            <div className="my-auto">
                                <Image height={150} width={30} alt="OrthEns" className="-intro-x w-1/2 -mt-16" src="/assets/images/illustration.svg"/>
                                <div className="-intro-x text-white font-medium text-3xl leading-tight mt-10">
                                    Demande de renouvellement de mot de passe
                                </div>
                            </div>
                        </div>
                        <div className="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
                            <div className="my-auto mx-auto xl:ml-20 bg-white xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
                                <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
                                    Demander votre lien de réinitialisation
                                </h2>
                                <div className="col-span-12 xl:col-span-6">
                                    <div className="mt-3">
                                        <label>Email</label>
                                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="input w-full border mt-2"/>
                                    </div>
                                    <button
                                        onClick={onSubmit}
                                        className="button w-auto text-white bg-theme-1 mt-5">
                                        Recevoir un lien de réinitialisation
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    return {
        props: {},
    };
};
