import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Bell, ChevronRight, ToggleRight, User } from 'react-feather';
import { useEffect, useRef, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from 'lib/service/utils/fetcher';
import moment from 'moment';
import seeAlert from 'lib/provider/alert/seeAlert';

const Topbar = ({ title, user }) => {
    const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    const { data: alerts = [], mutate } = useSWR(
        [`/api/alert/list`],
        ([url]) =>
            fetcher(url).then((response) => {
                return response.data;
            }),
        { refreshInterval: 30000 }
    );

    const handleOutsideClick = (e) => {
        if (notificationRef.current && !notificationRef.current.contains(e.target)) {
            setNotificationDropdownOpen(false);
        }
        if (profileRef.current && !profileRef.current.contains(e.target)) {
            setProfileDropdownOpen(false);
        }
    };

    const processSeeAlert = (alert) => {
        if (alert.seen) {
            return;
        }

        seeAlert(alert.id).then(() => {
            mutate(alerts.map((a) => (a.id === alert.id ? { ...a, seen: true } : a)));
        });
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const redirect = (url) => {
        window.location.href = url;
    }

    return (
        <div className="top-bar">
            <div className="-intro-x breadcrumb mr-auto hidden sm:flex">
                <Image alt="OrthEns" src="/assets/images/logo.svg" width={80} height={40} />
                <ChevronRight className="breadcrumb__icon" />
                <a href="" className="breadcrumb--active">{title}</a>
            </div>
            <div ref={notificationRef} className="intro-x dropdown relative mr-auto sm:mr-6">
                <div
                    className={`dropdown-toggle notification cursor-pointer ${alerts.filter(a => !a.seen).length > 0 && 'notification--bullet'}`}
                    onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                >
                    <Bell className="notification__icon" />
                </div>
                {notificationDropdownOpen && (
                    <div className="notification-content mt-8 absolute top-0 left-0 sm:left-auto sm:right-0 z-20 -ml-10 sm:ml-0">
                        <div className="notification-content__box dropdown-box__content box">
                            <div className="notification-content__title">Notifications</div>
                            <div className='alert-container'>
                                {alerts.map((alert) => (
                                    <div key={alert.id} className="cursor-pointer relative flex items-center mb-3" onClick={() => processSeeAlert(alert)}>
                                        <div className="ml-2 overflow-hidden w-full">
                                            <div className="flex items-center">
                                                <div className="font-medium truncate mr-5">{alert.title}</div>
                                                <div className="text-xs text-gray-500 ml-auto whitespace-no-wrap">{moment(alert.createdAt).format('DD/MM/YYYY HH:ss')}</div>
                                            </div>
                                            <div className="w-full truncate text-gray-600">{alert.message}</div>
                                            {alert.link && (
                                                <a className='w-fit block text-xs button text-white bg-theme-1 shadow-md' href={alert.link}>{alert.linkText ?? 'Voir plus'}</a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {alerts.length === 0 && (
                                <div className="text-center">Aucune notification</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div ref={profileRef} className="intro-x dropdown w-8 h-8 relative">
                <div
                    className="dropdown-toggle w-8 h-8 rounded-full overflow-hidden shadow-lg image-fit zoom-in"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                    {user && (
                        <img width={20} height={20} alt="profile" src={user?.image ?? `https://ui-avatars.com/api/?name=${user?.name}&format=svg&rounded=true`} />
                    )}
                </div>
                {profileDropdownOpen && (
                    <div className="mt-10 absolute w-56 top-0 right-0 z-20">
                        <div className="dropdown-box__content box bg-white text-theme-7">
                            <div className="p-4 border-b border-theme-27">
                                <div className="font-medium">{user?.name}</div>
                                <div className="text-xs">{user?.profession}</div>
                            </div>
                            <div className="p-2">
                                <Link href={'/account'} className="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 hover:text-white rounded-md">
                                    <User className="w-4 h-4 mr-2" /> Mon Compte
                                </Link>
                            </div>
                            <div className="p-2 border-t border-theme-27">
                                <a onClick={() => signOut()} href="#" className="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 hover:text-white rounded-md">
                                    <ToggleRight className="w-4 h-4 mr-2" /> Déconnexion
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Topbar;
