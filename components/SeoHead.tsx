import Head from 'next/head';
import { useRouter } from 'next/router';

const defaultMeta = {
    title: 'OrthEns',
    siteName: 'OrthEns',
    description: 'OrthEns',
    url: 'https://next-orthens.vercel.app/',
    type: 'website',
    robots: 'follow, index',
    image: 'https://next-ortens.vercel.app/assets/card-image.png',
    author: 'OrthEns',
};

const SeoHead = (props) => {
    const router = useRouter();
    const meta = {
        ...defaultMeta,
        ...props,
    };

    meta.title = props.templateTitle
        ? `${props.templateTitle} | ${meta.siteName}`
        : meta.title;

    return (
        <Head>
            <title>{meta.title}</title>
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
            <meta name="robots" content={meta.robots} />
            <meta content={meta.description} name="description" />
            <meta property="og:url" content={`${meta.url}${router.asPath}`} />
            <link rel="canonical" href={`${meta.url}${router.asPath}`} />
            <meta property="og:type" content={meta.type} />
            <meta property="og:site_name" content={meta.siteName} />
            <meta property="og:description" content={meta.description} />
            <meta property="og:title" content={meta.title} />
            <meta name="image" property="og:image" content={meta.image} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@F2aldi" />
            <meta name="twitter:title" content={meta.title} />
            <meta name="twitter:description" content={meta.description} />
            <meta name="twitter:image" content={meta.image} />
            {meta.date && (
                <>
                    <meta
                        property="article:published_time"
                        content={meta.date}
                    />
                    <meta
                        name="publish_date"
                        property="og:publish_date"
                        content={meta.date}
                    />
                    <meta
                        name="author"
                        property="article:author"
                        content={meta.author}
                    />
                </>
            )}
            {favicons.map((linkProps) => (
                <link key={linkProps.href} {...linkProps} />
            ))}
        </Head>
    );
};

const favicons = [
    {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/assets/favicon/apple-touch-icon.png',
    },
    {
        rel: 'icon',
        href: '/assets/favicon/favicon.ico',
    },
    {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/assets/favicon/favicon-16x16.png',
    },
    {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/assets/favicon/favicon-32x32.png',
    },
    {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        href: '/assets/favicon/android-chrome-192x192.png',
    },
    {
        rel: 'icon',
        type: 'image/png',
        sizes: '512x512',
        href: '/assets/favicon/android-chrome-512x512.png',
    },
    {
        rel: 'manifest',
        href: '/assets/favicon/site.webmanifest',
    },
];

export default SeoHead;
