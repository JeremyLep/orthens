import MobileMenu from './MobileMenu';
import Navbar from './Navbar';
import Topbar from './Topbar';
import { useEffect, useState } from 'react';
import getProfile from 'lib/provider/user/getProfile';
import Image from 'next/image';

const Layout = ({children, title}) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        getProfile().then((data) => {
            setUser(data);
        });
    }, []);

    return (
        <>
            <MobileMenu user={user}/>
            <div className="flex">
                <Navbar user={user}/>
                <div className="content">
                    <Topbar title={title} user={user}/>
                    {children}
                </div>
            </div>
            <div className='sponsors text-center flex w-fit m-auto gap-5'>
                <a href='https://www.ars.sante.fr/' target='_blank'><Image className='' src={'/assets/images/logo-ars.png'} alt={'ARS'} height={90} width={90} /></a>
                <a href='https://occitadys.fr/' target='_blank'><Image className='ml-2' src={'/assets/images/logo-occitadys.png'} alt={'Occitadys'} height={90} width={90} /></a>
                <a href='https://occitadys.fr/tsla/accueil-tsla' target='_blank'><Image className='ml-2' src={'/assets/images/logo-tsla.png'} alt={'A'} height={90} width={90} /></a>
            </div>
        </>
    );
};

export default Layout;
