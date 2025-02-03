// import moment from 'moment';
import moment from 'moment/min/moment-with-locales';

import { useState, useEffect } from 'react';

export const TimeNow = () => {
    return moment().format('LTS');
}
export const useCurrentTime = () => {
    const [time, setTime] = useState(TimeNow());
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(TimeNow());
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    return time;
}

export const formatDate = (date) => {
    return moment(date).format('MM/DD/YYYY');
}

export const formatDateTh = (date) => {
    return moment(date).locale('th').format('LL');
}

export const formatHourFromNow = (date) => {
    return moment(date).startOf('hour').fromNow();   
}

export const formatTime = (date) => {
    return moment(date).format('LT');
}

export const formatDateTime = (date) => {
    return moment(date).format('lll');
}

export const formatHour = (time) => {
    return moment(time).startOf('hour').fromNow();
}