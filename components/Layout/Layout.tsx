import MobileMenu from './MobileMenu';
import Navbar from './Navbar';
import Topbar from './Topbar';
import { useEffect, useState } from 'react';
import getProfile from 'lib/provider/user/getProfile';

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
        </>
    );
};

export default Layout;
