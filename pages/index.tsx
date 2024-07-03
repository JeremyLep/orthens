import 'apexcharts/dist/apexcharts.css';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import Hero from 'components/Landing/Hero';

export default function Home({ user }) {
    return <>
        <Hero />
    </>;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await getServerSession(req, res, authOptions);

    return {
        props: { user: session?.user ?? null },
    };
}
