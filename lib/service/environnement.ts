import getConfig from 'next/config';

export const getEnv = (env: string) => {
    const { publicRuntimeConfig } = getConfig();

    return publicRuntimeConfig[env];
};
