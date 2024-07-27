import Image from 'next/image';
import { FileText, HardDrive, Home, Key, Link2, Mail, MessageSquare, User, Users } from 'react-feather';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { RoleType } from 'lib/constants/roleType';

const Navbar = ({user}) => {
    const { pathname } = useRouter();

    return (
        <nav className="side-nav">
            <a href="" className="intro-x flex items-center">
                <Image alt="OrthEns" src="/assets/images/logo-white.svg" width={150} height={50}/>
            </a>
            <div className="side-nav__devider mb-6 mt-3"></div>
            <ul>
                <li>
                    <Link href="/dashboard" className={`side-menu ${pathname.includes('/dashboard') ? 'side-menu--active' : ''}`}>
                        <div className="side-menu__icon"> <Home/> </div>
                        <div className="side-menu__title"> Tableau de bord </div>
                    </Link>
                </li>
                <li>
                    <Link href="/students" className={`side-menu ${pathname.includes('/students') ? 'side-menu--active' : ''}`}>
                        <div className="side-menu__icon"> <Users/> </div>
                        <div className="side-menu__title"> Mes patients </div>
                    </Link>
                </li>
                <li>
                    <Link href="/relations"  className={`side-menu ${pathname.includes('/relations') ? 'side-menu--active' : ''}`}>
                        <div className="side-menu__icon"> <Link2/> </div>
                        <div className="side-menu__title"> Mes contacts </div>
                    </Link>
                </li>
                <li>
                    <Link href="/conversations" className={`side-menu ${pathname.includes('/conversations') ? 'side-menu--active' : ''}`}>
                        <div className="side-menu__icon"> <MessageSquare/> </div>
                        <div className="side-menu__title"> Mes conversations </div>
                    </Link>
                </li>
                <li>
                    <Link href="/documents" className={`side-menu ${pathname.includes('/documents') ? 'side-menu--active' : ''}`}>
                        <div className="side-menu__icon"> <HardDrive/> </div>
                        <div className="side-menu__title"> Mes documents </div>
                    </Link>
                </li>
                <li>
                    <Link href="/invitations"  className={`side-menu ${pathname.includes('/invitations') ? 'side-menu--active' : ''}`}>
                        <div className="side-menu__icon"> <Mail/> </div>
                        <div className="side-menu__title"> Mes invitations </div>
                    </Link>
                </li>
                <li className="side-nav__devider my-6"></li>
                <li>
                    <Link href="/articles" className={`side-menu ${pathname.includes('/articles') ? 'side-menu--active' : ''}`}>
                        <div className="side-menu__icon"> <FileText/> </div>
                        <div className="side-menu__title"> Ressources </div>
                    </Link>
                </li>
                <li>
                    <Link href="/account" className={`side-menu ${pathname.includes('/account') ? 'side-menu--active' : ''}`}>
                        <div className="side-menu__icon"> <User/> </div>
                        <div className="side-menu__title"> Mon compte </div>
                    </Link>
                </li>
                {user?.role === RoleType.ROLE_ADMIN && (
                    <>
                        <li className="side-nav__devider my-6"></li>
                        <li>
                            <Link href="/admin" className={`side-menu ${pathname.includes('/admin') ? 'side-menu--active' : ''}`}>
                                <div className="side-menu__icon"> <Key/> </div>
                                <div className="side-menu__title"> Administration </div>
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
