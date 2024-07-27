import { RoleType } from 'lib/constants/roleType';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { HardDrive, MessageSquare, FileText, Users, BarChart2, Home, Mail, User, Link2, Key } from 'react-feather';

const MobileMenu = ({user}) => {
    const { pathname } = useRouter();
    const [openNav, setOpenNav] = useState(false);

    return (
        <div className="mobile-menu md:hidden">
            <div className="mobile-menu-bar">
                <a href="" className="flex mr-auto">
                    <Image alt="OrthEns" src="/assets/images/logo-white.svg" width={100} height={50}/>
                </a>
                <a onClick={() => setOpenNav(!openNav)} id="mobile-menu-toggler"> <BarChart2 className="w-8 h-8 text-white transform -rotate-90"/> </a>
            </div>
            {openNav && (
                <ul className="pl-8 border-t border-theme-24 py-5 text-white">
                    <li>
                        <Link href="/dashboard" className={`side-menu flex mb-3 ${pathname.includes('/dashboard') ? 'side-menu--active' : ''}`}>
                            <div className="side-menu__icon"> <Home/> </div>
                            <div className="side-menu__title ml-2"> Tableau de bord </div>
                        </Link>
                    </li>
                    <li>
                        <Link href="/students" className={`side-menu flex mb-3  ${pathname.includes('/students') ? 'side-menu--active' : ''}`}>
                            <div className="side-menu__icon"> <Users/> </div>
                            <div className="side-menu__title ml-2"> Mes patients </div>
                        </Link>
                    </li>
                    <li>
                        <Link href="/relations"  className={`side-menu flex mb-3 ${pathname.includes('/relations') ? 'side-menu--active' : ''}`}>
                            <div className="side-menu__icon"> <Link2/> </div>
                            <div className="side-menu__title ml-2"> Mes contacts </div>
                        </Link>
                    </li>
                    <li>
                        <Link href="/conversations" className={`side-menu flex mb-3 ${pathname.includes('/conversations') ? 'side-menu--active' : ''}`}>
                            <div className="side-menu__icon"> <MessageSquare/> </div>
                            <div className="side-menu__title ml-2"> Mes conversations </div>
                        </Link>
                    </li>
                    <li>
                        <Link href="/documents" className={`side-menu flex mb-3 ${pathname.includes('/documents') ? 'side-menu--active' : ''}`}>
                            <div className="side-menu__icon"> <HardDrive/> </div>
                            <div className="side-menu__title ml-2"> Mes documents </div>
                        </Link>
                    </li>
                    <li>
                        <Link href="/invitations"  className={`side-menu flex mb-3 ${pathname.includes('/invitations') ? 'side-menu--active' : ''}`}>
                            <div className="side-menu__icon"> <Mail/> </div>
                            <div className="side-menu__title ml-2"> Mes invitations </div>
                        </Link>
                    </li>
                    <li className="side-nav__devider my-6"></li>
                    <li>
                        <Link href="/articles" className={`side-menu flex mb-3 ${pathname.includes('/articles') ? 'side-menu--active' : ''}`}>
                            <div className="side-menu__icon"> <FileText/> </div>
                            <div className="side-menu__title ml-2"> Ressources </div>
                        </Link>
                    </li>
                    <li>
                        <Link href="/account" className={`side-menu flex mb-3 ${pathname.includes('/account') ? 'side-menu--active' : ''}`}>
                            <div className="side-menu__icon"> <User/> </div>
                            <div className="side-menu__title ml-2"> Mon compte </div>
                        </Link>
                    </li>
                    {user?.role === RoleType.ROLE_ADMIN && (
                        <>
                            <li className="side-nav__devider my-6"></li>
                            <li>
                                <Link href="/admin" className={`side-menu flex mb-3 ${pathname.includes('/admin') ? 'side-menu--active' : ''}`}>
                                    <div className="side-menu__icon"> <Key/> </div>
                                    <div className="side-menu__title ml-2"> Administration </div>
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            )}
        </div>
    );
}

export default MobileMenu;