import { useEffect, useState } from "react";
import { useMealStore } from "../store/store";
import { mealLikeList as getMealLikeList } from '../service/meal.service';
import { Likes } from "../model/like";
import { auth } from "../service/firebase";
import { BreakfastOrDinner } from "../model/amount";
import { useErrorPresent } from "./useErrorPresent";


export const useGetNowDayLikes = (isMount: boolean) => {

    const { nowDay } = useMealStore();

    const [breakfastLikes, setBreakfastLikes] = useState<Likes | null>([])
    const [dinnerLikes, setDinnerLikes] = useState<Likes | null>([])
    const [presentError, dismissPresent] = useErrorPresent()


    useEffect(() => {
        (async () => {
            if (nowDay) {
                ['breakfastAmount' as BreakfastOrDinner, 'dinnerAmount' as BreakfastOrDinner].forEach(async (breakfastOrDinner: BreakfastOrDinner) => {
                    try {
                        const getLikesRes = await getMealLikeList(nowDay, breakfastOrDinner);
                        if (getLikesRes && isMount) {
                            if (breakfastOrDinner === 'breakfastAmount') {
                                setBreakfastLikes(getLikesRes);
                            } else {
                                setDinnerLikes(getLikesRes);
                            }
                        }
                    } catch (e) {
                        console.error(e);
                        presentError('오류', '식단을 불러오는 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
                    }
                })
            }
        })()
        return () => {
            setBreakfastLikes([]);
            setDinnerLikes([]);
        }
    }, [nowDay, auth.currentUser])

    return { breakfastLikes, dinnerLikes, setBreakfastLikes, setDinnerLikes };
}