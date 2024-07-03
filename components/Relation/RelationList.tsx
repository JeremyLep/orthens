import { invitationStatus } from "lib/provider/invitation/invitationStatus";
import Link from "next/link";
import { Clock, List, MessageSquare, UserCheck, UserPlus } from "react-feather";

export const RelationList = ({ relations, user }) => {
    return (
        <table className="table table-report -mt-2">
            <tbody>
                {relations.map((relation) => (
                    <tr className="intro-x" key={relation.id}>
                        <td className="w-40">
                            <div className="flex ml-5">
                                {relation.users.map((user) => (
                                    <Link key={user.id} href={`professional/${user.id}`} className="w-10 h-10 image-fit zoom-in -ml-5">
                                        <img height={30} width={30} className="tooltip rounded-full" src={user.image ?? `https://ui-avatars.com/api/?name=${user.name}&format=svg&rounded=true`} title={`${user.name ?? user.email}`}/>
                                    </Link>
                                ))}
                                {relation.child && (
                                    <Link href={`/students/${relation.child.id}`} className="w-10 h-10 image-fit zoom-in -ml-5">
                                        <img height={30} width={30} className="tooltip rounded-full" src={`https://ui-avatars.com/api/?name=${relation.child.firstname}+${relation.child.lastname}&format=svg&rounded=true`} title={`${relation.child.firstname} ${relation.child.lastname}.`}/>
                                    </Link>
                                )}
                            </div>
                        </td>
                        <td>
                            <Link href={`/students/${relation.child.id}`} className="font-medium text-primary whitespace-no-wrap">{`${relation.child.firstname} ${relation.child.lastname}`}</Link>
                            <div className="text-gray-600 text-xs whitespace-no-wrap">Patient</div>
                        </td>
                        <td>
                            {relation.users.filter((u) => u.id !== user.id).map((user) => (
                                <div key={user.id}>
                                    <Link key={user.id} href={`professional/${user.id}`} className="flex text-theme-9"> <UserCheck className="w-4 h-4 mr-2"/> {user.name ?? user.email} </Link>
                                    <div className="text-gray-600 text-xs whitespace-no-wrap">{user.profession}</div>
                                </div>
                            ))}
                            {relation.invitations.filter(i => i.status === invitationStatus.PENDING).map((invitation) => (
                                <div key={invitation.id}>
                                    <div className="flex text-theme-11"> <Clock className="w-4 h-4 mr-2"/> {invitation.email} </div>
                                    <div className="text-gray-600 text-xs whitespace-no-wrap">{invitation.profession}</div>
                                </div>
                            ))}
                        </td>
                        <td className="text-center">{relation.child.institution}</td>
                        <td className="text-primary">
                            <Link className='block' href={`/students/${relation.child.id}?tab=suivi`}>{relation._count.followUpMessages} suivis</Link>
                            <Link className='block mt-2' href={`/students/${relation.child.id}?tab=documents`}>{relation._count.files} documents</Link>
                        </td>
                        <td className="table-report__action w-56">
                            <div className="flex justify-center items-center">
                                <Link className="flex items-center mr-3 text-theme-11" href={`/professional/invite/${relation.id}`}> <UserPlus className="w-4 h-4 mr-1"/> Inviter </Link>
                                <Link className="flex items-center mr-3 text-primary" href={`/students/${relation.child.id}?tab=conversation`}> <MessageSquare className="w-4 h-4 mr-1"/> Conversation </Link>
                                <Link className="flex items-center text-theme-9" href={`/students/${relation.child.id}`}> <List className="w-4 h-4 mr-1"/> Suivi </Link>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};