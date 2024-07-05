import SeoHead from 'components/SeoHead';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { Infer } from 'superstruct';
import { superstructResolver } from '@hookform/resolvers/superstruct';
import { handleToastPromise } from 'lib/service/axios/handleToastPromise';
import { ErrorMessage } from '@hookform/error-message';
import jwt from 'jsonwebtoken';
import { ResetPasswordInput } from 'lib/model/struct/account/resetPasswordInput';
import resetPassword from 'lib/provider/user/resetPassword';

export default function ResetPasswordToken({ userId }) {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<Infer<typeof ResetPasswordInput>>({
        resolver: superstructResolver(ResetPasswordInput),
        reValidateMode: 'onChange',
        defaultValues: {},
    });

    const onSubmit = (data: Infer<typeof ResetPasswordInput>) => {
        handleToastPromise(
            resetPassword(data, userId),
            'modification de mot de passe'
        ).then((res) => {
            if (res) {
                handleToastPromise(
                    new Promise(r => setTimeout(r, 3000)),
                    'redirection'
                );
                window.location.href = '/auth/sign-in';
            }
        });
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
                                    Renouvellement de mot de passe
                                </div>
                            </div>
                        </div>
                        <div className="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
                            <div className="my-auto mx-auto xl:ml-20 bg-white xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
                                <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
                                    Renouveller votre mot de passe
                                </h2>
                                <form
                                    onClick={handleSubmit(onSubmit)}
                                >
                                    <div className="col-span-12 xl:col-span-6">
                                        <div className="mt-3">
                                            <label>Nouveau mot de passe</label>
                                            <input {...register('password')} minLength={6} type="password" className="input w-full border mt-2"/>
                                            <ErrorMessage
                                                errors={errors}
                                                name="password"
                                                render={({ message }) => 
                                                    <p className="text-theme-6 mt-2">{message}</p>
                                                }
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <label>Confirmer le mot de passe</label>
                                            <input  {...register('verifiedPassword')} minLength={6} type="password" className="input w-full border mt-2"/>
                                            <ErrorMessage
                                                errors={errors}
                                                name="verifiedPassword"
                                                render={({ message }) => 
                                                    <p className="text-theme-6 mt-2">{message}</p>
                                                }
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="button w-full xl:w-32 text-white bg-theme-1 mt-5">
                                            Renouveller
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res, params }) => {
    const token = params?.token as string;

    if (!token) {
        return {
            notFound: true,
        };
    }

    let decoded;

    try {
        decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
    } catch (err) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            userId: (decoded as { id: string }).id,
        },
    };
};
