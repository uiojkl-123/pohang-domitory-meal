import { MealClass } from "./meal";

interface MealsType {
    [key: string]: MealClass | null
}

export interface MealStoreType {
    /**
     * **nowDay의 식단**
     */
    meals: MealsType
    /**
     * **식단을 가져오고 저장**
     */
    getGlobalDayMeal: (day: string) => Promise<void>;
    /**
     * **현재 날짜**
     */
    nowDay: string
    /**
     * **현재 날짜를 변경**
     */
    setNowDay: (day: string) => void
}