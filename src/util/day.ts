import { format } from "date-fns";

export const nextDayFromyyyyMMdd = (day: string) => {
    const yyyy = Number(day.substring(0, 4));
    const mm = Number(day.substring(4, 6));
    const dd = Number(day.substring(6, 8));
    const nextDay = new Date(yyyy, mm - 1, dd);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayStr = format(nextDay, 'yyyyMMdd');
    return nextDayStr;
}

export const prevDayFromyyyyMMdd = (day: string) => {
    const yyyy = Number(day.substring(0, 4));
    const mm = Number(day.substring(4, 6));
    const dd = Number(day.substring(6, 8));
    const prevDay = new Date(yyyy, mm - 1, dd);
    prevDay.setDate(prevDay.getDate() - 1);
    const prevDayStr =  format(prevDay, 'yyyyMMdd');
    return prevDayStr;
}