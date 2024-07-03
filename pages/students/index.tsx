import SeoHead from 'components/SeoHead';
import { GetServerSideProps } from 'next';
import { withSessionSsr } from 'lib/service/session/session';
import Image from 'next/image';
import Layout from 'components/Layout/Layout';
import Link from 'next/link';
import { Clock, Eye, Search, Trash2, UserCheck, UserPlus, Users } from 'react-feather';
import { useEffect, useState } from 'react';
import getStudentList from 'lib/provider/students/getStudentList';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import moment from 'moment';
import { handleToastPromise } from 'lib/service/axios/handleToastPromise';
import deleteStudent from 'lib/provider/students/deleteStudent';
import { invitationStatus } from 'lib/provider/invitation/invitationStatus';

export default function Students({ user, students }) {
    const [suppressModal, setSuppressModal] = useState<any>(false);
    const [studentList, setStudentList] = useState<any>(students);

    const suppressStudent = (student) => {
        handleToastPromise(
            deleteStudent(student.id),
            `Suppression du patient ${student.firstname} ${student.lastname}`
        ).then((res) => {
            if (typeof res !== 'undefined') {
                setStudentList(studentList.filter((student) => student.id !== res.id));
                setSuppressModal(false);
            }
        })
    };

    return (
        <>
            <SeoHead title="OrthEns" />
            <Layout title={'Patients'}>
                <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
                    <h2 className="intro-y text-lg font-medium inline-flex">
                        <Users/><span className='ml-3'>Mes patients</span>
                    </h2>
                </div>
                <div className="grid grid-cols-12 gap-6 mt-5">
                    <div className="intro-y col-span-12 flex flex-wrap sm:flex-no-wrap items-center mt-2">
                        <Link href={'/students/new'} className="button text-white bg-theme-1 shadow-md mr-2 inline-flex"><UserPlus className="w-4 h-4 mr-2"/> Ajouter un nouveau patient</Link>
                        {/* <div className="w-full sm:w-auto mt-3 sm:ml-auto">
                            <div className="w-56 relative text-gray-700">
                                <input type="text" className="input w-56 box pr-10 placeholder-theme-13" placeholder="Recherche..."/>
                                <Search className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"/> 
                            </div>
                        </div> */}
                    </div>
                    <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
                        {studentList?.length > 0 ? (
                            <table className="table table-report -mt-2">
                                <tbody>
                                    {studentList && studentList.map((student: any) => (
                                        <tr className="intro-x" key={student.id}>
                                            <td className="">
                                                <div className="flex">
                                                    <div className="w-10 h-10 image-fit zoom-in">
                                                        <img height={30} width={30} alt={`${student.firstname} ${student.lastname}.`} className="tooltip rounded-full" src={`https://ui-avatars.com/api/?name=${student.firstname}+${student.lastname}&format=svg&rounded=true`} title={`${student.firstname} ${student.lastname}.`}/>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <Link href={`/students/${student.id}`} className="font-medium text-primary whitespace-no-wrap">{`${student.firstname} ${student.lastname}.`}</Link>
                                                <div className="text-gray-600 text-xs whitespace-no-wrap">Patient</div>
                                            </td>
                                            <td className="text-center">{moment().diff(moment(student.birthYear, "YYYY"), 'years')} ans</td>
                                            <td className="text-center">{student.institution}</td>
                                            <td className="">
                                                {student.relations.map((relation: any) => (
                                                    <div key={relation.id}>
                                                        {relation.users.length === 0 && relation.invitations.length === 0 && (
                                                            <Link href={`/professional/invite/${relation.id}`} className="button text-white text-xs bg-theme-1 shadow-md inline-flex"><UserPlus className="w-4 h-4 mr-1"/>Inviter</Link>
                                                        )}
                                                        {relation.users.map((user: any) => {
                                                            return <Link key={user.id} href={`/professional/${user.id}`} className="flex items-center justify-center text-theme-9"> <UserCheck className="w-4 h-4 mr-2"/> {user.name ?? user.email} </Link>
                                                        })}
                                                        {relation.invitations.filter((i) => i.status === invitationStatus.PENDING).map((invitation: any) => {
                                                            return <Link key={invitation.id} href={`/invitations`} className="flex items-center justify-center text-theme-11"> <Clock className="w-4 h-4 mr-2"/> {invitation.email} </Link>
                                                        })}
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="table-report__action w-56">
                                                <div className="flex justify-center items-center">
                                                    <Link className="flex items-center mr-3 text-primary" href={`/students/${student.id}`}> <Eye className="w-4 h-4 mr-1"/> Suivi </Link>
                                                    {student.createdBy.id === user.id && (
                                                        <button className="flex items-center text-theme-6" onClick={() => setSuppressModal(student)}> <Trash2 className="w-4 h-4 mr-1"/> Archiver </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="intro-y col-span-12 text-center items-center justify-center">
                                <div className="text-gray-600">Vous n'avez pas encore de patient sur OrthEns.<br/>Commencez maintenant en ajoutant un premier patient</div>
                                <Link href={'/students/new'} className="button text-white bg-theme-1 shadow-md mr-2 mt-3 inline-flex"><UserPlus className="w-4 h-4 mr-2"/> Ajouter un nouveau patient</Link>
                            </div>
                        )}
                    </div>
                </div>
                {suppressModal && (
                    <div className={`modal ${suppressModal && 'show'}`}>
                        <div className="modal__content modal__content--lg">
                            <div className="p-5 text-center"> <i data-feather="x-circle" className="w-16 h-16 text-theme-6 mx-auto mt-3"></i>
                                <div className="text-3xl mt-5">Êtes vous sur de vouloir archiver le patient {suppressModal.firstname} {suppressModal.lastname}. de OrthEns ?</div>
                                <div className="text-gray-600 mt-2">Tous les données relatives au patient seront également archivées. Cette action est définitive.</div>
                            </div>
                            <div className="px-5 pb-8 text-center"> 
                                <button onClick={() => setSuppressModal(false)} type="button" className="button w-24 border text-gray-700 mr-1">Annuler</button>
                                <button onClick={() => suppressStudent(suppressModal)} type="button" className="button w-24 bg-theme-6 text-white">Archiver</button>
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
        const students = await getStudentList(req.headers);

        return {
            props: {
                user: req.session.user,
                students: students,
            },
        };
    },
    '/auth/sign-in'
);
