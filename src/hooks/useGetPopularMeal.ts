import { useState, useEffect } from "react";
import { getPopularMeal } from "../service/meal.service";
import { useErrorPresent } from "./useErrorPresent";

export const useGetPopularMeal = () => {

    const [popularMeal, setPopularMeal] = useState<{ meal: string, like: number }[]>();
    const [presentError, dismissPresent] = useErrorPresent()


    const runGetPopularMeal = async () => {
        try {
            const getPopularMealRes = await getPopularMeal();
            if (getPopularMealRes) {
                if (getPopularMealRes.length <= 0) {
                    return
                }
                setPopularMeal(getPopularMealRes);
            }
        } catch (e) {
            console.error(e);
            presentError('오류', '인기 식단을 불러오는 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
        }
    }

    useEffect(() => {
        (async () => {
            await runGetPopularMeal();
        })()
    }, [])

    return { popularMeal, setPopularMeal, initPopularMeal: () => setPopularMeal(undefined), runGetPopularMeal };
}
