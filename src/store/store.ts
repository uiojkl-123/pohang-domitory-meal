import { string } from 'prop-types';
import create from 'zustand';
import { devtools } from 'zustand/middleware'
import { MealClass } from '../model/meal';
import { MealStoreType } from '../model/store';
import { getDayMeal } from '../service/meal.service';
import { todayyyyyMMdd } from '../util/day';

const store = (set: any): MealStoreType => ({
    meals: {},
    getGlobalDayMeal: async (day: string) => {
        const dailyMeal = await getDayMeal(day)
        if (!dailyMeal) { set((state: MealStoreType) => ({ meals: { ...state.meals, [day]: null } })); return }
        set((state: MealStoreType) => ({ meals: { ...state.meals, [day]: dailyMeal } }))
    },
    nowDay: todayyyyyMMdd,
    setNowDay: (day: string) => set((state: MealStoreType) => ({ nowDay: day })),
})

/**
 * **식단 스토어**
 */
export const useMealStore = create(devtools(store));