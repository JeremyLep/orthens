import { useEffect, useState } from 'react';
import moment from 'moment-timezone';

const useCountdown = (targetDate?: string) => {
    const countDownDate = moment(targetDate).utc().valueOf();

    const [countDown, setCountDown] = useState(
        countDownDate - moment().utc().valueOf()
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCountDown(countDownDate - moment().utc().valueOf());
        }, 1000);

        if (countDown < 0) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [countDownDate, countDown]);

    return getReturnValues(countDown);
};

const getReturnValues = (countDown: number) => {
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

    const stop = days + hours + minutes + seconds > 0;

    return { days, hours, minutes, seconds, stop };
};

export { useCountdown };
