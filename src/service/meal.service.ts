import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { mealConverter } from "./firebaseConverter";

/**
 * **하루 식단을 가져오는 함수**
 *
 * @param {string} day - 날짜 yyyyMMdd
 */
export const getDayMeal = async (day: string) => {
    const dayRef = doc(db, "meals", day).withConverter(mealConverter);
    const daySnap = await getDoc(dayRef);
    if (daySnap.exists()) {
        return daySnap.data();
    }
    return null;
}