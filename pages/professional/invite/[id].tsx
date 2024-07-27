import SeoHead from 'components/SeoHead';
import { GetServerSideProps } from 'next';
import { withSessionSsr } from 'lib/service/session/session';
import Image from 'next/image';
import Layout from 'components/Layout/Layout';
import Link from 'next/link';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Infer } from 'superstruct';
import { RelationInvitationInput } from 'lib/model/struct/invitation/relationInvitationInput';
import { superstructResolver } from '@hookform/resolvers/superstruct';
import { handleToastPromise } from 'lib/service/axios/handleToastPromise';
import { useRouter } from 'next/router';
import { ErrorMessage } from '@hookform/error-message';
import inviteRelation from 'lib/provider/relations/inviteRelation';
import getRelationChild from 'lib/provider/relations/getRelationChild';

export default function InviteProfessional({ user, relation }) {
    const [step, setStep] = useState(1);
    const router = useRouter();

    const {
        handleSubmit,
        register,
        control,
        getValues,
        trigger,
        formState: { errors },
    } = useForm<Infer<typeof RelationInvitationInput>>({
        resolver: superstructResolver(RelationInvitationInput),
        reValidateMode: 'onChange',
        defaultValues: {
            relationId: relation.id,
            invitations: [
                {
                    email: '',
                    profession: 'Orthophoniste',
                },
            ],
        },
    });

    const {
        fields: invitationsField,
        insert: invitationsInsert,
        remove: invitationsRemove
    } = useFieldArray({
        name: 'invitations',
        control,
    });

    const onSubmit = (data: Infer<typeof RelationInvitationInput>) => {
        handleToastPromise(
            inviteRelation(data),
            'Ajout du nouveau patient'
        ).finally(() => {
            router.push('/relations');
        });
    };

    const changeStep = (newStep) => {
        if (newStep === 2) {
            trigger(['invitations']).then((success) => {
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
                        Inviter un professionnel
                    </h2>
                </div>
                <div className="intro-y box py-10 sm:py-20 mt-5">
                    <div className="flex justify-center">
                        <button className={`intro-y w-10 h-10 rounded-full button ${step === 1 ? 'text-white bg-theme-1' : 'bg-gray-200 text-gray-600'} mx-2`}>1</button>
                        <button className={`intro-y w-10 h-10 rounded-full button ${step === 2 ? 'text-white bg-theme-1' : 'bg-gray-200 text-gray-600'} mx-2`}>2</button>
                    </div>
                    {step === 1 && <InviteProfessionalStep1 register={register} invitationsField={invitationsField} student={relation.child} invitationsInsert={invitationsInsert} invitationsRemove={invitationsRemove} changeStep={changeStep} errors={errors}/>}
                    {step === 2 && <InviteProfessionalStep2 changeStep={changeStep} getValues={getValues} student={relation.child} onSubmit={onSubmit}/>}
                </div>
            </Layout>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = withSessionSsr(
    async ({ req, res, params }) => {

        const relation = await getRelationChild(params.id as string, req.headers);

        return {
            props: {
                relation: relation
            },
        };
    },
    '/auth/sign-in'
);

export const InviteProfessionalStep1 = ({register, student, invitationsField, invitationsInsert, invitationsRemove, changeStep, errors}) => {
    return (
        <>
            <div className="px-5 mt-10">
                <div className="font-medium text-center text-lg">Inviter des professionnels dans le groupe de {student.firstname} {student.lastname}.</div>
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
                {invitationsField.map((professional, index) => {
                    return (
                        <div className='grid grid-cols-12 gap-4 row-gap-5 mt-5' key={professional.id}>
                            <div className='intro-y col-span-6'>
                                <input {...register(`invitations.${index}.email`)} type="email" className="input w-full border flex-1" placeholder="example@gmail.com"/>
                                <ErrorMessage
                                    errors={errors}
                                    name={`invitations.${index}.email`}
                                    render={({ message }) => (
                                        <p className="error-message">{message}</p>
                                    )}
                                />
                            </div>
                            <div className="intro-y col-span-5">
                                <select {...register(`invitations.${index}.profession`)} className="input w-full border flex-1">
                                    <option>Orthophoniste</option>
                                    <option>Enseignant</option>
                                </select>
                                <ErrorMessage
                                    errors={errors}
                                    name={`invitations.${index}.profession`}
                                    render={({ message }) => (
                                        <p className="error-message">{message}</p>
                                    )}
                                />
                            </div>
                            <div className="intro-y col-span-1">
                                <span onClick={() => invitationsRemove(index)}>X</span>
                            </div>
                        </div>
                    );
                })}
                <ErrorMessage
                    errors={errors}
                    name={`invitations`}
                    render={({ message }) => (
                        <p className="error-message">{message}</p>
                    )}
                />
                <div className="intro-y col-span-12 sm:col-span-12 mt-3">
                    <button className="button text-xs w-24 justify-center block bg-theme-1 text-white" onClick={invitationsInsert}>Ajouter</button>
                </div>
                <div className="intro-y col-span-12 flex items-center justify-center sm:justify-end mt-5">
                    <button onClick={() => changeStep(2)} className="button w-24 justify-center block bg-theme-1 text-white ml-2">Continuer</button>
                </div>
            </div>
        </>
    );
};

export const InviteProfessionalStep2 = ({changeStep, getValues, onSubmit, student}) => {
    return (
        <>
            <div className="px-5 mt-10">
                <div className="font-medium text-center text-lg">Récapitulatif</div>
                <div className="text-gray-600 text-center mt-2">Vérifier les informations avant d'enregistrer</div>
            </div>
            <div className="px-5 sm:px-20 mt-10 pt-10 border-t border-gray-200">
                <div className="grid grid-cols-12 gap-4 row-gap-5 mt-5">
                    <div className="intro-y col-span-12 sm:col-span-12">
                        <div className="mb-2">Professionnels en charge du patient à inviter pour {`${student.firstname} ${student.lastname}.`}</div>
                        {getValues('invitations').map((invitation, index) => {
                            return (
                                <div key={index} className="flex items-center justify-between font-bold">
                                    {invitation.email} - {invitation.profession}
                                </div>
                            )}
                        )}
                    </div>
                    <div className="intro-y col-span-12 flex items-center justify-center sm:justify-end mt-5">
                        <button onClick={() => changeStep(1)} className="button w-24 justify-center block bg-gray-200 text-gray-600">Retour</button>
                        <button onClick={onSubmit} className="button w-24 justify-center block bg-theme-1 text-white ml-2">Enregistrer</button>
                    </div>
                </div>
            </div>
        </>
    );
};