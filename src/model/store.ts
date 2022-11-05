import { MealClass } from "./meal";

interface MealsType {
    [key: string]: MealClass | null
}

export interface MealStoreType {
    meals: MealsType
    getGlobalDayMeal: (day: string) => Promise<void>;
    nowDay: string | undefined
}