import { useEffect, useState } from "react";
import { Amount } from "../model/amount";
import { subscribeAmounts } from "../service/amount.service";
import { useMealStore } from "../store/store"

export const useGetNowDayMealAmount = () => {

    const { nowDay } = useMealStore();

    const [breakfastAmount, setBreakfastAmount] = useState<Amount>();
    const [dinnerAmount, setDinnerAmount] = useState<Amount>();
    const [breakfastCheckAt, setBreakfastCheckAt] = useState<Date>();
    const [dinnerCheckAt, setDinnerCheckAt] = useState<Date>();

    useEffect(() => {
        let breakfastAmountUnsubscribe: any;
        let dinnerAmountUnsubscribe: any;
        (async () => {
            if (!nowDay) return;
            const [getBreakfastAmountUnsubscribe, getDinnerAmountUnsubscribe] = await subscribeAmounts(nowDay, setBreakfastAmount, setDinnerAmount, setBreakfastCheckAt, setDinnerCheckAt);
            breakfastAmountUnsubscribe = getBreakfastAmountUnsubscribe;
            dinnerAmountUnsubscribe = getDinnerAmountUnsubscribe;
        })();

        return () => {
            // breakfastAmountUnsubscribe();
            // dinnerAmountUnsubscribe();
            setBreakfastAmount(undefined);
            setDinnerAmount(undefined);
            setBreakfastCheckAt(undefined);
            setDinnerCheckAt(undefined);
        }
    }, [nowDay])

    return { breakfastAmount, dinnerAmount, breakfastCheckAt, dinnerCheckAt };
}