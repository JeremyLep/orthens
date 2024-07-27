import SeoHead from 'components/SeoHead';
import { GetServerSideProps } from 'next';
import { withSessionSsr } from 'lib/service/session/session';
import Image from 'next/image';
import Layout from 'components/Layout/Layout';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { StudentInput } from 'lib/model/struct/student/studentInput';
import { Infer, validate } from 'superstruct';
import { superstructResolver } from '@hookform/resolvers/superstruct';
import { ErrorMessage } from '@hookform/error-message';
import newStudent from 'lib/provider/students/newStudent';
import { handleToastPromise } from 'lib/service/axios/handleToastPromise';
import { useRouter } from 'next/router';

export default function NewStudents({ user }) {
    const [step, setStep] = useState(1);
    const router = useRouter();

    const {
        handleSubmit,
        register,
        control,
        getValues,
        trigger,
        formState: { errors },
    } = useForm<Infer<typeof StudentInput>>({
        resolver: superstructResolver(StudentInput),
        reValidateMode: 'onChange',
        defaultValues: {
            firstname: undefined,
            lastname: undefined,
            birthYear: undefined,
            institution: undefined,
            professionals: [
                {
                    email: '',
                    profession: 'Orthophoniste',
                },
            ],
        },
    });

    const {
        fields: professionalField,
        insert: professionalInsert,
        remove: professionalsRemove
    } = useFieldArray({
        name: 'professionals',
        control,
    });

    const onSubmit = (data: Infer<typeof StudentInput>) => {
        handleToastPromise(
            newStudent(data),
            'Ajout du nouveau patient'
        ).finally(() => {
            router.push('/students');
        });
    };

    const changeStep = (newStep) => {
        if (newStep === 2) {
            trigger(['firstname', 'lastname', 'birthYear', 'institution']).then((success) => {
                if (success) {
                    setStep(newStep);
                }
            })
        } else if (newStep === 3) {
            trigger(['professionals']).then((success) => {
                if (success) {
                    setStep(newStep);
                }
            })
        } else {
            setStep(newStep);
        }

        return;
    }

    return (
        <>
            <SeoHead title="OrthEns" />
            <Layout title={'Patients'}>
            <div className="flex items-center mt-8">
                    <h2 className="intro-y text-lg font-medium mr-auto">
                        Nouveau patient
                    </h2>
                </div>
                <div className="intro-y box py-10 sm:py-20 mt-5">
                    <div className="flex justify-center">
                        <button className={`intro-y w-10 h-10 rounded-full button ${step === 1 ? 'text-white bg-theme-1' : 'bg-gray-200 text-gray-600'} mx-2`}>1</button>
                        <button className={`intro-y w-10 h-10 rounded-full button ${step === 2 ? 'text-white bg-theme-1' : 'bg-gray-200 text-gray-600'} mx-2`}>2</button>
                        <button className={`intro-y w-10 h-10 rounded-full button ${step === 3 ? 'text-white bg-theme-1' : 'bg-gray-200 text-gray-600'} mx-2`}>3</button>
                    </div>
                    {step === 1 && <NewStudentsStep1 changeStep={changeStep} errors={errors} register={register}/>}
                    {step === 2 && <NewStudentsStep2 changeStep={changeStep} register={register} errors={errors} professionalFields={professionalField} professionalInsert={professionalInsert} professionalsRemove={professionalsRemove}/>}
                    {step === 3 && <NewStudentsStep3 changeStep={changeStep} onSubmit={handleSubmit(onSubmit)} getValues={getValues}/>}
                </div>
            </Layout>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = withSessionSsr(
    async ({ req, res }) => {
        return {
            props: {

            },
        };
    },
    '/auth/sign-in'
);

export const NewStudentsStep1 = ({changeStep, register, errors}) => {
    return (
        <>
            <div className="px-5 mt-10">
                <div className="font-medium text-center text-lg">Informations concernant le patient</div>
                <div className="text-gray-600 text-center mt-2">Pour commencer, entrez le prénom et la premiere lettre du nom de famille du patient</div>
            </div>
            <div className="px-5 sm:px-20 mt-10 pt-10 border-t border-gray-200">
                <div className="font-medium text-base">Informations concernant le patient</div>
                <div className="grid grid-cols-12 gap-4 row-gap-5 mt-5">
                    <div className="intro-y col-span-12 sm:col-span-6">
                        <div className="mb-2">Prénom*</div>
                        <input {...register('firstname')} type="text" className="input w-full border flex-1" placeholder="Théo"/>
                        <ErrorMessage
                            errors={errors}
                            name="firstname"
                            render={({ message }) => (
                                <p className="error-message">{message}</p>
                            )}
                        />
                    </div>
                    <div className="intro-y col-span-12 sm:col-span-6">
                        <div className="mb-2">Première lettre du nom de famille*</div>
                        <input {...register('lastname')} type="text" className="input w-full border flex-1" placeholder="H"/>
                        <ErrorMessage
                            errors={errors}
                            name="lastname"
                            render={({ message }) => (
                                <p className="error-message">{message}</p>
                            )}
                        />
                    </div>
                    <div className="intro-y col-span-12 sm:col-span-6">
                        <div className="mb-2">Année de naissance*</div>
                        <input {...register('birthYear', { valueAsNumber: true })} type="number" className="input w-full border flex-1" min={2004} max={2024} placeholder="2014"/>
                        <ErrorMessage
                            errors={errors}
                            name="birthYear"
                            render={({ message }) => (
                                <p className="error-message">{message}</p>
                            )}
                        />
                    </div>
                    <div className="intro-y col-span-12 sm:col-span-6">
                        <div className="mb-2">Etablissement</div>
                        <input {...register('institution')} type="text" className="input w-full border flex-1" placeholder="Saint-Exupéry"/>
                        <ErrorMessage
                            errors={errors}
                            name="institution"
                            render={({ message }) => (
                                <p className="error-message">{message}</p>
                            )}
                        />
                    </div>
                    <div className="intro-y col-span-12 flex items-center justify-center sm:justify-end mt-5">
                        <button onClick={() => changeStep(2)} className="button w-24 justify-center block bg-theme-1 text-white ml-2">Continuer</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export const NewStudentsStep2 = ({changeStep, professionalFields, professionalInsert, professionalsRemove, register, errors}) => {
    return (
        <>
            <div className="px-5 mt-10">
                <div className="font-medium text-center text-lg">Inviter des professionnels</div>
                <div className="text-gray-600 text-center mt-2">Inviter des professionnels dans le groupe de discussion lié à ce patient</div>
            </div>
            <div className="px-5 sm:px-20 mt-10 pt-10 border-t border-gray-200">
                {/* <div className="font-medium text-base">Choisissez des professionnels</div>
                <div className="grid grid-cols-12 gap-4 row-gap-5 mt-5 mb-10">
                    <div className="intro-y col-span-12 sm:col-span-6">
                        <div className="mb-2">Liste de professionnels existants sur OrthEns</div>
                        <select className="input w-full border flex-1">
                            <option>Choisir</option>
                            <option>Aucun</option>
                            <option>charlotte.forst@gmail.com</option>
                        </select>
                    </div>
                </div> */}
                <div className="font-medium text-base">Invitez de nouveaux professionnels</div>
                <div className="grid grid-cols-12 gap-4 row-gap-5 mt-5">
                    <div className="intro-y col-span-12">
                        <div className="mb-2">Liste d'email de professionnels à inviter sur OrthEns</div>
                    </div>
                </div>
                {professionalFields.map((professional, index) => {
                    return (
                        <div className='grid grid-cols-12 gap-4 row-gap-5 mt-5' key={professional.id}>
                            <div className='intro-y col-span-6'>
                                <input {...register(`professionals.${index}.email`)} type="email" className="input w-full border flex-1" placeholder="example@gmail.com"/>
                                <ErrorMessage
                                    errors={errors}
                                    name={`professionals.${index}.email`}
                                    render={({ message }) => (
                                        <p className="error-message">{message}</p>
                                    )}
                                />
                            </div>
                            <div className="intro-y col-span-5">
                                <select {...register(`professionals.${index}.profession`)} className="input w-full border flex-1">
                                    <option>Orthophoniste</option>
                                    <option>Enseignant</option>
                                </select>
                                <ErrorMessage
                                    errors={errors}
                                    name={`professionals.${index}.profession`}
                                    render={({ message }) => (
                                        <p className="error-message">{message}</p>
                                    )}
                                />
                            </div>
                            <div className="intro-y col-span-1">
                                <span onClick={() => professionalsRemove(index)}>X</span>
                            </div>
                        </div>
                    );
                })}
                <div className="intro-y col-span-12 sm:col-span-12 mt-3">
                    <button className="button text-xs w-24 justify-center block bg-theme-1 text-white" onClick={professionalInsert}>Ajouter</button>
                </div>
                <div className="intro-y col-span-12 flex items-center justify-center sm:justify-end mt-5">
                    <button onClick={() => changeStep(1)} className="button w-24 justify-center block bg-gray-200 text-gray-600">Retour</button>
                    <button onClick={() => changeStep(3)} className="button w-24 justify-center block bg-theme-1 text-white ml-2">Continuer</button>
                </div>
            </div>
        </>
    );
};

export const NewStudentsStep3 = ({changeStep, onSubmit, getValues}) => {
    return (
        <>
            <div className="px-5 mt-10">
                <div className="font-medium text-center text-lg">Récapitulatif</div>
                <div className="text-gray-600 text-center mt-2">Vérifier les informations avant d'enregistrer</div>
            </div>
            <div className="px-5 sm:px-20 mt-10 pt-10 border-t border-gray-200">
                <div className="grid grid-cols-12 gap-4 row-gap-5 mt-5">
                    <div className="intro-y col-span-12 sm:col-span-12">
                        <div className="mb-2">Nom du patient</div>
                        <span className="font-bold">{getValues('firstname')} {getValues('lastname')}. né en {getValues('birthYear')}</span>
                    </div>
                    <div className="intro-y col-span-12 sm:col-span-12">
                        <div className="mb-2">Professionnels en charge du patient</div>
                        {getValues('professionals').map((professional, index) => {
                            return (
                                <div key={index} className="flex items-center justify-between font-bold">
                                    {professional.email} - {professional.profession}
                                </div>
                            )}
                        )}
                    </div>
                    <div className="intro-y col-span-12 flex items-center justify-center sm:justify-end mt-5">
                        <button onClick={() => changeStep(2)} className="button w-24 justify-center block bg-gray-200 text-gray-600">Retour</button>
                        <button onClick={onSubmit} className="button w-24 justify-center block bg-theme-1 text-white ml-2">Enregistrer</button>
                    </div>
                </div>
            </div>
        </>
    );
};