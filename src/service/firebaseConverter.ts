import { MealClass } from "../model/meal";

//mealConverter
export const mealConverter = {
    toFirestore: (meal: MealClass) => {
        return {
            breakfast: meal.breakfast,
            dinner: meal.dinner,
        }
    },
    fromFirestore: (snapshot: any, options: any) => {
        const data = snapshot.data(options);
        return new MealClass(data.breakfast, data.dinner);
    }
}
