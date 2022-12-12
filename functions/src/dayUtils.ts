import { format } from "date-fns";

export const currentMonth = format(new Date(), "yyyyMM00");
export const nextMonth = format(new Date(new Date().setMonth(new Date().getMonth() + 1)), "yyyyMM00");
