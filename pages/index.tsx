import 'apexcharts/dist/apexcharts.css';
import { GetServerSideProps } from 'next';

export default function Home({ user }) {
    return <></>;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    res.writeHead(302, { Location: '/dashboard' });
    res.end();

    return {
        props: { user: null },
    };
}
