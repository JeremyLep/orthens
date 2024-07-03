import 'styles/tailwind.css';
import 'styles/app.scss';
import 'styles/global.scss';

import 'react-toastify/dist/ReactToastify.css';

import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import moment from 'moment';
import 'moment/locale/fr'

const App = ({ Component, pageProps }: AppProps) => {
    moment.locale('fr');

    return (
        <SessionProvider session={pageProps.session}>
            <ToastContainer />
            <Component {...pageProps} />
        </SessionProvider>
    );
};

export default App;
