import SeoHead from 'components/SeoHead';
import { GetServerSideProps } from 'next';
import { withSessionSsr } from 'lib/service/session/session';
import Image from 'next/image';
import Layout from 'components/Layout/Layout';
import { Activity, Lock, User, X } from 'react-feather';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Infer } from 'superstruct';
import { UpdatePasswordInput } from 'lib/model/struct/account/updatePasswordInput';
import { superstructResolver } from '@hookform/resolvers/superstruct';
import updatePassword from 'lib/provider/user/updatePassword';
import { handleToastPromise } from 'lib/service/axios/handleToastPromise';
import { ErrorMessage } from '@hookform/error-message';
import getProfile from 'lib/provider/user/getProfile';
import { UpdateProfileInput } from 'lib/model/struct/account/updateProfileInput';
import updateProfile from 'lib/provider/user/updateProfile';
import { signOut } from 'next-auth/react';
import deleteAccount from 'lib/provider/user/deleteAccount';
import uploadDocuments from 'lib/provider/document/uploadDocument';
import updateAvatar from 'lib/provider/user/updateAvatar';

export default function Account({ initProfile }) {
    const [tabOpen, setTabOpen] = useState('information');
    const [suppressAccountModal, setSuppressAccountModal] = useState(false);
    const [profile, setProfile] = useState(initProfile)

    const {
        handleSubmit: handleSubmitUpdatePassword,
        register: registerUpdatePassword,
        formState: { errors: errorsUpdatePassword },
    } = useForm<Infer<typeof UpdatePasswordInput>>({
        resolver: superstructResolver(UpdatePasswordInput),
        reValidateMode: 'onChange',
        defaultValues: {},
    });

    const {
        handleSubmit: handleSubmitUpdateProfile,
        register: registerUpdateProfile,
        formState: { errors: errorsUpdateProfile },
        getValues
    } = useForm<Infer<typeof UpdateProfileInput>>({
        resolver: superstructResolver(UpdateProfileInput),
        reValidateMode: 'onChange',
        defaultValues: {
            name: initProfile.name,
            profession: initProfile.profession,
            institution: initProfile.institution,
            phone: initProfile.phone,
            postcode: initProfile.postcode,
            city: initProfile.city,
            address: initProfile.address,
            isPhonePublic: initProfile.isPhonePublic,
            isAddressPublic: initProfile.isAddressPublic,
        },
    });

    const onSubmitUpdatePassword = (data: Infer<typeof UpdatePasswordInput>) => {
        handleToastPromise(
            updatePassword(data.password, data.verifiedPassword, data.oldPassword),
            'mise à jour du mot de passe'
        );
    }

    const onSubmitUpdateProfile = (data: Infer<typeof UpdateProfileInput>) => {
        handleToastPromise(
            updateProfile(data),
            'mise à jour du profil'
        );
    }

    const suppressAccount = () => {
        handleToastPromise(
            deleteAccount(),
            'suppression du compte'
        ).then((res) => {
            if (res.status === 200) {
                signOut({ callbackUrl: '/' });
            }
        });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files) as File[];

        handleToastPromise(
            uploadDocuments(files, 'user'),
            'Envoi des documents'
        ).then((res) => {
            updateAvatar(res.url).then((r) => {
                if (r) {
                    setProfile({...profile, image: res.url});
                }
            });
        });
    };

    return (
        <>
            <SeoHead title="OrthEns - Profil" />
            <Layout title={'Mon profil'}>
            <div className="intro-y flex items-center mt-8">
                    <h2 className="text-lg font-medium mr-auto inline-flex">
                        <User/><span className='ml-3'>Mon profil</span>
                    </h2>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-4 xxl:col-span-3 flex lg:block flex-col-reverse">
                        <div className="intro-y box mt-5">
                            <div className="relative flex items-center p-5">
                                <div className="w-12 h-12 image-fit">
                                    <Image height={30} width={30}alt="avatar" className="rounded-full" src={profile.image ?? "/assets/images/profile-11.jpg"}/>
                                </div>
                                <div className="ml-4 mr-auto">
                                    <div className="font-medium text-base">{getValues('name')}</div>
                                    <div className="text-gray-600">Orthophoniste</div>
                                </div>
                            </div>
                            <div className="p-5 border-t border-gray-200">
                                <div onClick={() => setTabOpen('information')} className={`flex items-center cursor-pointer ${tabOpen === 'information' ? 'text-theme-1 font-medium': ''}`}> <Activity className="w-4 h-4 mr-2"/> Informations personnelles </div>
                                <div onClick={() => setTabOpen('password')} className={`flex items-center cursor-pointer mt-5 ${tabOpen === 'password' ? 'text-theme-1 font-medium': ''}`}> <Lock className="w-4 h-4 mr-2"/> Modifier mon mot de passe</div>
                            </div>
                        </div>
                    </div>
                    <div className={`col-span-12 lg:col-span-8 xxl:col-span-9 ${tabOpen === 'information' ? '' : 'hidden'}`}>
                        <form onSubmit={handleSubmitUpdateProfile(onSubmitUpdateProfile)}>
                            <div className="intro-y box lg:mt-5">
                                <div className="flex items-center p-5 border-b border-gray-200">
                                    <h2 className="font-medium text-base mr-auto">
                                        Mes informations publiques
                                    </h2>
                                </div>
                                <div className="p-5">
                                    <div className="grid grid-cols-12 gap-5">
                                        <div className="col-span-12 xl:col-span-4">
                                            <div className="border border-gray-200 rounded-md p-5">
                                                <div className="w-40 h-40 relative image-fit cursor-pointer zoom-in mx-auto">
                                                    <Image height={30} width={30}className="rounded-md" alt="" src={profile.image ?? '/assets/images/profile-11.jpg'}/>
                                                </div>
                                                <div className="w-40 mx-auto cursor-pointer relative mt-5">
                                                    <button type="button" className="button w-full bg-theme-1 text-white cursor-pointer">Changer la photo</button>
                                                    <input onChange={handleFileChange} type="file" className="cursor-pointer w-full h-full top-0 left-0 absolute opacity-0"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-12 xl:col-span-8">
                                            <div>
                                                <label>Email</label>
                                                <input type="text" className="input w-full border bg-gray-100 cursor-not-allowed mt-2" value={profile.email} disabled/>
                                            </div>
                                            <div className='mt-3'>
                                                <label>Nom</label>
                                                <input {...registerUpdateProfile('name')} type="text" className="input w-full border bg-white mt-2" placeholder="Votre nom et prénom"/>
                                                <ErrorMessage
                                                    errors={errorsUpdateProfile}
                                                    name="name"
                                                    render={({ message }) => 
                                                        <p className="text-theme-6 mt-2">{message}</p>
                                                    }
                                                />
                                            </div>
                                            <div className="mt-3">
                                                <label>Profession</label>
                                                <div className="mt-2">
                                                    <select className="input w-full border flex-1" {...registerUpdateProfile('profession')}>
                                                        <option value="orthophoniste">Orthophoniste</option>
                                                        <option value="enseignant">Enseignant</option>
                                                    </select>
                                                </div>
                                                <ErrorMessage
                                                    errors={errorsUpdateProfile}
                                                    name="profession"
                                                    render={({ message }) => 
                                                        <p className="text-theme-6 mt-2">{message}</p>
                                                    }
                                                />
                                            </div>
                                            <div className='mt-3'>
                                                <label>Cabinet / Etablissement</label>
                                                <input {...registerUpdateProfile('institution')} type="text" className="input w-full border bg-white mt-2" placeholder="Votre cabinet / etablissement"/>
                                                <ErrorMessage
                                                    errors={errorsUpdateProfile}
                                                    name="institution"
                                                    render={({ message }) => 
                                                        <p className="text-theme-6 mt-2">{message}</p>
                                                    }
                                                />
                                            </div>
                                            <div className="mt-5">
                                                <input id='isPhonePublic' {...registerUpdateProfile('isPhonePublic')} className="input border border-gray-500 mr-2" type="checkbox"/>
                                                <label htmlFor='isPhonePublic'>Numéro de téléphone visible par mes contacts</label>
                                            </div>
                                            <div className="mt-3">
                                                <input id='isAddressPublic' {...registerUpdateProfile('isAddressPublic')} className="input border border-gray-500 mr-2" type="checkbox"/>
                                                <label htmlFor='isAddressPublic'>Adresse visible par mes contacts</label>
                                            </div>
                                            <button type="submit" className="button w-fit bg-theme-1 text-white mt-3 float-right">Sauvegarder</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="intro-y box lg:mt-5">
                                <div className="flex items-center p-5 border-b border-gray-200">
                                    <h2 className="font-medium text-base mr-auto">
                                        Mes informations personnelles
                                    </h2>
                                </div>
                                <div className="p-5">
                                    <div className="grid grid-cols-12 gap-5">
                                        <div className="col-span-12 xl:col-span-6">
                                            <label>Numéro de téléphone</label>
                                            <input {...registerUpdateProfile('phone')} type="text" className="input w-full border mt-2" placeholder="Numero de télépone"/>
                                            <ErrorMessage
                                                errors={errorsUpdateProfile}
                                                name="phone"
                                                render={({ message }) => 
                                                    <p className="text-theme-6 mt-2">{message}</p>
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-12 gap-5 mt-3">
                                        <div className="col-span-12 xl:col-span-6">
                                            <label>Ville</label>
                                            <input {...registerUpdateProfile('city')} type="text" className="input w-full border mt-2" placeholder="Ville"/>
                                            <ErrorMessage
                                                errors={errorsUpdateProfile}
                                                name="city"
                                                render={({ message }) => 
                                                    <p className="text-theme-6 mt-2">{message}</p>
                                                }
                                            />
                                        </div>
                                        <div className="col-span-12 xl:col-span-6">
                                            <label>Code postal</label>
                                            <input {...registerUpdateProfile('postcode')} maxLength={6} type="text" className="input w-full border mt-2" placeholder="Code postal"/>
                                            <ErrorMessage
                                                errors={errorsUpdateProfile}
                                                name="postcode"
                                                render={({ message }) => 
                                                    <p className="text-theme-6 mt-2">{message}</p>
                                                }
                                            />
                                        </div>
                                        <div className="col-span-12">
                                            <label>Adresse</label>
                                            <textarea {...registerUpdateProfile('address')} className="input w-full border mt-2" placeholder="Mon adresse"/>
                                            <ErrorMessage
                                                errors={errorsUpdateProfile}
                                                name="address"
                                                render={({ message }) => 
                                                    <p className="text-theme-6 mt-2">{message}</p>
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <button type='button' onClick={() => setSuppressAccountModal(true)} className="text-theme-6 flex items-center">
                                            <i data-feather="trash-2" className="w-4 h-4 mr-1"></i>
                                            Supprimer mon compte
                                        </button>
                                        <button type="submit" className="button w-fit bg-theme-1 text-white ml-auto">Sauvegarder</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className={`col-span-12 lg:col-span-8 xxl:col-span-9 ${tabOpen === 'password' ? '' : 'hidden'}`}>
                        <div className="intro-y box lg:mt-5">
                            <div className="flex items-center p-5 border-b border-gray-200">
                                <h2 className="font-medium text-base mr-auto">
                                    Changer mon mot de passe
                                </h2>
                            </div>
                            <form onSubmit={handleSubmitUpdatePassword(onSubmitUpdatePassword)} className="p-5">
                                <div className="grid grid-cols-12 gap-5">
                                    <div className="col-span-12 xl:col-span-6">
                                        <div>
                                            <label>Mot de passe actuel</label>
                                            <input {...registerUpdatePassword('oldPassword')} type="password" className="input w-full border bg-gray-100 mt-2"/>
                                            <ErrorMessage
                                                errors={errorsUpdatePassword}
                                                name="oldPassword"
                                                render={({ message }) => 
                                                    <p className="text-theme-6 mt-2">{message}</p>
                                                }
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <label>Nouveau mot de passe</label>
                                            <input {...registerUpdatePassword('password')} minLength={6} type="password" className="input w-full border mt-2"/>
                                            <ErrorMessage
                                                errors={errorsUpdatePassword}
                                                name="password"
                                                render={({ message }) => 
                                                    <p className="text-theme-6 mt-2">{message}</p>
                                                }
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <label>Confirmer le mot de passe</label>
                                            <input  {...registerUpdatePassword('verifiedPassword')} minLength={6} type="password" className="input w-full border mt-2"/>
                                            <ErrorMessage
                                                errors={errorsUpdatePassword}
                                                name="verifiedPassword"
                                                render={({ message }) => 
                                                    <p className="text-theme-6 mt-2">{message}</p>
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-start mt-4">
                                    <button type="submit" className="button w-fit bg-theme-1 text-white">Sauvegarder</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {suppressAccountModal && (
                    <div className={`modal ${suppressAccountModal && 'show'}`}>
                        <div className="modal__content modal__content--lg">
                            <div className="p-5 text-center"> <i data-feather="x-circle" className="w-16 h-16 text-theme-6 mx-auto mt-3"></i>
                                <div className="text-xl mt-5">Êtes-vous sûr(e) de vouloir supprimer votre compte d'OrthEns ?</div>
                                <div className="text-gray-600 mt-2">Une fois supprimé, vous perdrez toutes les données relatives à votre compte. Cette action est irréversible</div>
                            </div>
                            <div className="px-5 pb-8 text-center"> 
                                <button onClick={() => setSuppressAccountModal(false)} type="button" className="button w-24 border text-gray-700 mr-1">Annuler</button>
                                <button onClick={suppressAccount} type="button" className="button w-64 bg-theme-6 text-white">Supprimer définitivement</button>
                            </div>
                        </div>
                    </div>
                )}
            </Layout>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = withSessionSsr(
    async ({ req, res }) => {
        const profile = await getProfile(req.headers);

        return {
            props: {
                initProfile: profile ?? null,
            },
        };
    },
    '/auth/sign-in'
);
