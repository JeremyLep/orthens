const withSvgr = require('next-plugin-svgr');
const withPlugins = require('next-compose-plugins');

const svgrPlugin = withSvgr({
    svgrOptions: {
        titleProp: true,
        icon: true,
        svgProps: {
            height: 'auto',
            width: 'auto',
        },
    },
});

const imagePlugin = {
    images: {
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'orthens-documents.s3.eu-west-1.amazonaws.com',
              port: '',
              pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'ui-avatars.com',
                port: '',
                pathname: '**',
            },
        ],
    },
};

const runtimeConfig = {
    publicRuntimeConfig: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_SERVER_API_URL: process.env.NEXT_PUBLIC_SERVER_API_URL,
    },
};

module.exports = withPlugins([
    runtimeConfig,
    svgrPlugin,
    imagePlugin,
]);
