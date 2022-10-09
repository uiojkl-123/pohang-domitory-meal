export class MealClass {
    breakfast: string[];
    dinner: string[];
    /**
     * **날짜**
     * 
     * yyyyMMdd
     */
    date: string;
    constructor(breakfast: string[], dinner: string[], date: string) {
        this.breakfast = breakfast;
        this.dinner = dinner;
        this.date = date;
    }
}