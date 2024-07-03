import SeoHead from 'components/SeoHead';
import { GetServerSideProps } from 'next';
import { withSessionSsr } from 'lib/service/session/session';
import Image from 'next/image';
import Layout from 'components/Layout/Layout';
import { Clock, List, UserCheck, Link2, Check, X, RefreshCcw, Trash2, Send, Mail, UserPlus } from 'react-feather';
import { Search, MessageSquare } from 'react-feather';
import Link from 'next/link';
import { useState } from 'react';
import getInvitationRecievedList from 'lib/provider/invitation/getInvitationRecievedList';
import getInvitationRequestedList from 'lib/provider/invitation/getInvitationRequestedList';
import { handleToastPromise } from 'lib/service/axios/handleToastPromise';
import refuseInvitation from 'lib/provider/invitation/refuseInvitation';
import acceptInvitation from 'lib/provider/invitation/acceptInvitation';
import deleteInvitation from 'lib/provider/invitation/deleteInvitation';
import retryInvitation from 'lib/provider/invitation/retryInvitation';
import { invitationStatus } from 'lib/provider/invitation/invitationStatus';

export default function Invitation({ user, invitationsRequested, invitationsRecieved }) {
    const [invitationRequestedList, setInvitationRequestedList] = useState(invitationsRequested);
    const [invitationRecievedList, setInvitationRecievedList] = useState(invitationsRecieved);
    const [suppressModal, setSuppressModal] = useState<any>(false);
    const [acceptModal, setAcceptModal] = useState<any>(false);
    const [refuseModal, setRefuseModal] = useState<any>(false);
    const [retryModal, setRetryModal] = useState<any>(false);

    const accept = (invitationId) => {
        handleToastPromise(
            acceptInvitation(invitationId),
            'acceptation de l\'invitation'
        ).then((res) => {
            if (typeof res !== 'undefined') {
                setInvitationRecievedList(invitationRecievedList.filter((invitation) => invitation.id !== res.id));
                setAcceptModal(false);
            }
        });
    };

    const refuse = (invitationId) => {
        handleToastPromise(
            refuseInvitation(invitationId),
            'refus de l\'invitation'
        ).then((res) => {
            if (typeof res !== 'undefined') {
                setInvitationRecievedList(invitationRecievedList.filter((invitation) => invitation.id !== res.id));
                setRefuseModal(false);
            }
        });
    };

    const suppress = (invitationId) => {
        handleToastPromise(
            deleteInvitation(invitationId),
            'archivage de l\'invitation'
        ).then((res) => {
            if (typeof res !== 'undefined') {
                setInvitationRequestedList(invitationRequestedList.filter((invitation) => invitation.id !== res.id));
                setSuppressModal(false);
            }
        })
    }

    const retry = (invitationId) => {
        handleToastPromise(
            retryInvitation(invitationId),
            'relance de l\'invitation'
        ).then((res) => {
            if (typeof res !== 'undefined') {
                setRetryModal(false);
            }
        })
    }

    const displayStatus = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return <span className="text-theme-11 flex"><Clock className="w-4 h-4 mr-2"/>En attente</span>;
            case 'accepted':
                return <span className="text-theme-9 flex"><Check className="w-4 h-4 mr-2"/>Accepté</span>;
            case 'refused':
                return <span className="text-theme-6 flex"><X className="w-4 h-4 mr-2"/> Refusé</span>;
            case 'deleted':
                return <span className="text-theme-6 flex"><Trash2 className="w-4 h-4 mr-2"/> Archivé</span>;
            default:
                return <span className="text-theme-6">Inconnu</span>;
        }
    }

    return (
        <>
            <SeoHead title="OrthEns - Invitations" />
            <Layout title={'Invitations'}>
                <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
                    <h2 className="intro-y text-lg font-medium inline-flex">
                        <Mail/><span className='ml-3'>Invitations reçues</span>
                    </h2>
                </div>
                <div className="grid grid-cols-12 gap-6 mt-5">
                    {/* <div className="intro-y col-span-12 flex flex-wrap sm:flex-no-wrap items-center mt-2">
                        <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
                            <div className="w-56 relative text-gray-700">
                                <input type="text" className="input w-56 box pr-10 placeholder-theme-13" placeholder="Recherche..."/>
                                <Search className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"/> 
                            </div>
                        </div>
                    </div> */}
                    <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
                        {invitationRecievedList?.length > 0 ? (
                            <table className="table table-report -mt-2">
                                <tbody>
                                    {invitationRecievedList.map((invitation) => (
                                        <tr className="intro-x" key={invitation.id}>
                                            <td className="w-40">
                                                <div className="flex ml-5">
                                                    {invitation.relation.users.map((user) => (
                                                        <Link key={user.id} href={`professional/${user.id}`} className="w-10 h-10 image-fit zoom-in -ml-5">
                                                            <img height={30} width={30} alt="1" className="tooltip rounded-full" src={user.image ?? `https://ui-avatars.com/api/?name=${user.name}&format=svg&rounded=true`} title={`${user.name ?? user.email}`}/>
                                                        </Link>
                                                    ))}
                                                    {invitation.relation.child && (
                                                        <Link href={`/students/${invitation.relation.child.id}`} className="w-10 h-10 image-fit zoom-in -ml-5">
                                                            <img height={30} width={30} alt="3" className="tooltip rounded-full" src={`https://ui-avatars.com/api/?name=${invitation.relation.child.firstname}+${invitation.relation.child.lastname}&format=svg&rounded=true`} title={`${invitation.relation.child.firstname} ${invitation.relation.child.lastname}.`}/>
                                                        </Link>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="font-medium text-primary whitespace-no-wrap">{`${invitation.relation.child.firstname} ${invitation.relation.child.lastname}`}</div>
                                                <div className="text-gray-600 text-xs whitespace-no-wrap">Patient</div>
                                            </td>
                                            <td>
                                                {invitation.relation.users.filter((u) => u.id !== user.id).map((user) => (
                                                    <div key={user.id}>
                                                        <div key={user.id} className="flex text-theme-9"> <UserCheck className="w-4 h-4 mr-2"/> {user.name ?? user.email} </div>
                                                        <div className="text-gray-600 text-xs whitespace-no-wrap">{user.profession}</div>
                                                    </div>
                                                ))}
                                                {invitation.relation.invitations.filter((i) => (i.email !== user.email && i.status === invitationStatus.PENDING)).map((invitation) => (
                                                    <div key={invitation.id}>
                                                        <div className="flex text-theme-11"> <Clock className="w-4 h-4 mr-2"/> {invitation.email} </div>
                                                        <div className="text-gray-600 text-xs whitespace-no-wrap">{invitation.profession}</div>
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="text-center">{invitation.relation.child.institution}</td>
                                            <td className='text-center'>
                                                <div className="text-gray-600 text-xs whitespace-no-wrap">Invité par</div>
                                                {invitation.invitedBy.name ?? invitation.invitedBy.email}
                                            </td>
                                            <td className="text-center text-primary">{displayStatus(invitation.status)}</td>
                                                {invitation.status === 'PENDING' ? (
                                                    <td className="table-report__action w-56">
                                                        <div className="flex justify-center items-center">
                                                            <button onClick={() => setAcceptModal(invitation)} className="flex items-center mr-3 text-theme-9"> <Check className="w-4 h-4 mr-1"/> Accepter </button>
                                                            <button onClick={() => setRefuseModal(invitation)} className="flex items-center text-theme-6"> <X className="w-4 h-4 mr-1"/> Refuser </button>
                                                        </div>
                                                    </td>
                                                ) : (
                                                    <td></td>
                                                )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="intro-y col-span-12 text-center items-center justify-center">
                                <div className="text-gray-600">Vous n'avez pas encore reçu d'invitation sur OrthEns.</div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
                    <h2 className="intro-y text-lg font-medium inline-flex">
                        <Send/><span className='ml-3'>Invitations envoyées</span>
                    </h2>
                </div>
                <div className="grid grid-cols-12 gap-6 mt-5">
                    <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
                        {invitationRequestedList?.length > 0 ? (
                            <table className="table table-report -mt-2">
                                <tbody>
                                    {invitationRequestedList.map((invitation) => (
                                        <tr className="intro-x" key={invitation.id}>
                                            <td className="w-40">
                                                <div className="flex ml-5">
                                                    {invitation.relation.users.filter((u) => u.id !== user.id).map((user) => (
                                                        <Link key={user.id} href={`professional/${user.id}`} className="w-10 h-10 image-fit zoom-in -ml-5">
                                                            <img height={30} width={30} className="tooltip rounded-full" src={user.image ?? `https://ui-avatars.com/api/?name=${user.name}&format=svg&rounded=true`} title={`${user.name ?? user.email}`}/>
                                                        </Link>
                                                    ))}
                                                    {invitation.relation.child && (
                                                        <Link href={`/students/${invitation.relation.child.id}`} className="w-10 h-10 image-fit zoom-in -ml-5">
                                                            <img height={30} width={30} className="tooltip rounded-full" src={`https://ui-avatars.com/api/?name=${invitation.relation.child.firstname}+${invitation.relation.child.lastname}&format=svg&rounded=true`} title={`${invitation.relation.child.firstname} ${invitation.relation.child.lastname}.`}/>
                                                        </Link>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <Link href={`/students/${invitation.relation.child.id}`} className="font-medium text-primary whitespace-no-wrap">{`${invitation.relation.child.firstname} ${invitation.relation.child.lastname}`}</Link>
                                                <div className="text-gray-600 text-xs whitespace-no-wrap">Patient</div>
                                            </td>
                                            <td>
                                                {invitation.relation.users.filter((u) => u.id !== user.id).map((user) => (
                                                    <div key={user.id}>
                                                        <div className="flex text-theme-9"> <UserCheck className="w-4 h-4 mr-2"/> {user.name ?? user.email} </div>
                                                        <div className="text-gray-600 text-xs whitespace-no-wrap">{user.profession}</div>
                                                    </div>
                                                ))}
                                                {invitation.relation.invitations.filter(i => i.status === invitationStatus.PENDING).map((invitation) => (
                                                    <div key={invitation.id}>
                                                        <div className="flex text-theme-11"> <Clock className="w-4 h-4 mr-2"/> {invitation.email} </div>
                                                        <div className="text-gray-600 text-xs whitespace-no-wrap">{invitation.profession}</div>
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="text-center">{invitation.relation.child.institution}</td>
                                            <td className="text-center">
                                            <div className="text-gray-600 text-xs whitespace-no-wrap">Invité par</div>
                                                {invitation.invitedBy.name ?? invitation.invitedBy.email}
                                            </td>
                                            <td className="text-center text-primary">{displayStatus(invitation.status)}</td>
                                            {invitation.status === 'PENDING' ? (
                                                <td className="table-report__action w-56">
                                                    <div className="flex justify-center items-center">
                                                        <button onClick={() => setRetryModal(invitation)} className="flex items-center mr-3 text-primary"> <RefreshCcw className="w-4 h-4 mr-1"/> Relancer </button>
                                                        <button onClick={() => setSuppressModal(invitation)} className="flex items-center text-theme-6"> <Trash2 className="w-4 h-4 mr-1"/> Archiver </button>
                                                    </div>
                                                </td>
                                            ) : (
                                                <td></td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="intro-y col-span-12 text-center items-center justify-center">
                                <div className="text-gray-600">Vous n'avez pas encore envoyé d'invitation sur OrthEns.<br/>Envoyer des invitations dans la section Contacts</div>
                                <Link href={'/relations'} className="button text-white bg-theme-1 shadow-md mr-2 mt-3 inline-flex"><Send className="w-4 h-4 mr-2"/> Envoyer une invition dans la section Contact</Link>
                            </div>
                        )}
                    </div>
                </div>
                {suppressModal && (
                    <div className={`modal ${suppressModal && 'show'}`}>
                        <div className="modal__content modal__content--lg">
                            <div className="p-5 text-center"> <i data-feather="x-circle" className="w-16 h-16 text-theme-6 mx-auto mt-3"></i>
                                <div className="text-xl mt-5">Êtes vous sur de vouloir archiver cette invitation pour rejoindre le groupe concernant {suppressModal.relation.child.firstname} {suppressModal.relation.child.lastname}. ?</div>
                                <div className="text-gray-600 mt-2">Une fois archivé, vous ne pourrez plus accepter cette invitation.</div>
                            </div>
                            <div className="px-5 pb-8 text-center"> 
                                <button onClick={() => setSuppressModal(false)} type="button" className="button w-24 border text-gray-700 mr-1">Annuler</button>
                                <button onClick={() => suppress(suppressModal.id)} type="button" className="button w-24 bg-theme-6 text-white">Archiver</button>
                            </div>
                        </div>
                    </div>
                )}
                {refuseModal && (
                    <div className={`modal ${refuseModal && 'show'}`}>
                        <div className="modal__content modal__content--lg">
                            <div className="p-5 text-center"> <i data-feather="x-circle" className="w-16 h-16 text-theme-6 mx-auto mt-3"></i>
                                <div className="text-xl mt-5">Êtes vous sur de vouloir refuser cette invitation pour rejoindre le groupe concernant {refuseModal.relation.child.firstname} {refuseModal.relation.child.lastname}. ?</div>
                                <div className="text-gray-600 mt-2">Une fois refusé, vous ne pourrez plus accepter cette invitation.</div>
                            </div>
                            <div className="px-5 pb-8 text-center"> 
                                <button onClick={() => setRefuseModal(false)} type="button" className="button w-24 border text-gray-700 mr-1">Annuler</button>
                                <button onClick={() => refuse(refuseModal.id)} type="button" className="button w-24 bg-theme-6 text-white">Refuser</button>
                            </div>
                        </div>
                    </div>
                )}
                {acceptModal && (
                    <div className={`modal ${acceptModal && 'show'}`}>
                        <div className="modal__content modal__content--lg">
                            <div className="p-5 text-center"> <i data-feather="x-circle" className="w-16 h-16 text-theme-6 mx-auto mt-3"></i>
                                <div className="text-xl mt-5">Êtes vous sur de vouloir accepter cette invitation pour rejoindre le groupe concernant {acceptModal.relation.child.firstname} {acceptModal.relation.child.lastname}. ?</div>
                                <div className="text-gray-600 mt-2">Une fois accepté, vous pourrez communiquer avec les membres du groupe.</div>
                            </div>
                            <div className="px-5 pb-8 text-center"> 
                                <button onClick={() => setAcceptModal(false)} type="button" className="button w-24 border text-gray-700 mr-1">Annuler</button>
                                <button onClick={() => accept(acceptModal.id)} type="button" className="button w-24 bg-theme-9 text-white">Accepter</button>
                            </div>
                        </div>
                    </div>
                )}
                {retryModal && (
                    <div className={`modal ${retryModal && 'show'}`}>
                        <div className="modal__content modal__content--lg">
                            <div className="p-5 text-center"> <i data-feather="x-circle" className="w-16 h-16 text-theme-6 mx-auto mt-3"></i>
                                <div className="text-xl mt-5">Êtes vous sur de vouloir relancer {retryModal.email} pour rejoindre le groupe concernant {retryModal.relation.child.firstname} {retryModal.relation.child.lastname}. ?</div>
                                <div className="text-gray-600 mt-2">Un nouvel email d'invitation sera envoyé à l'adresse email {retryModal.email}.</div>
                            </div>
                            <div className="px-5 pb-8 text-center"> 
                                <button onClick={() => setRetryModal(false)} type="button" className="button w-24 border text-gray-700 mr-1">Annuler</button>
                                <button onClick={() => retry(retryModal.id)} type="button" className="button w-24 bg-theme-1 text-white">Relancer</button>
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
        const invitationsRecieved = await getInvitationRecievedList(req.headers);
        const invitationsRequested = await getInvitationRequestedList(req.headers);

        return {
            props: {
                user: req.session.user,
                invitationsRecieved: invitationsRecieved ?? [],
                invitationsRequested: invitationsRequested ?? [],
            },
        };
    },
    '/auth/sign-in'
);
