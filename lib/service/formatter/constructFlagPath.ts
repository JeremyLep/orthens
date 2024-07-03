import { countriesList } from 'lib/service/countriesList';

export const constructFlagPath = (countryCode: string): string => {
    let country = countriesList.find((c) => {
        return c.value === countryCode.toUpperCase();
    })?.value;

    if (typeof country === 'undefined') country = `unknown`;

    const flagPath = `/assets/images/flags/${country.toLowerCase()}.svg`;

    return flagPath;
};
