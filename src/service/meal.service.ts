import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { BreakfastOrDinner } from "../model/amount";
import { currentMonth } from "../util/dayUtils";
import { db, functions } from "./firebase";
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

/**
 * **좋아요 함수**
 * 
 * 해당 날짜 컬렉션에 breafastLike 컬렉션 또는 dinnerLike 컬렉션에 좋아요를 누른 사용자의 uid + 식단 index를 아이디로 
 * 해당 모든 정보를 저장한다.
 * 
 * 이후 functions 에서 collectionGroup 으로 해당 컬렉션을 가져와서 모든 문서의 like 정보를 파싱하면 좋아요 수를 알 수 있다.
 * 
 * @param {string} day - 날짜 yyyyMMdd
 * @param {number} mealIndex - 몇 번째인지
 * @param {string} userId - 사용자 uid
 * @param {BreakfastOrDinner} breakfastOrDinner - 아침인지 점심인지
 */
export const likeMeal = async (day: string, mealIndex: number, userId: string, breakfastOrDinner: BreakfastOrDinner) => {
    const dayRef = doc(db, "meals", day).withConverter(mealConverter);
    const breakfastOrDinnerLike = breakfastOrDinner === 'breakfastAmount' ? 'breakfastLike' : 'dinnerLike'
    await setDoc(doc(dayRef, breakfastOrDinnerLike, userId + mealIndex), { like: day + '-' + breakfastOrDinnerLike + '-' + mealIndex })
}

/**
 * **좋아요 취소 함수**
 * 
 * @param {string} day - 날짜 yyyyMMdd
 * @param {number} mealIndex - 몇 번째인지
 * @param {string} userId - 사용자 uid
 * @param {BreakfastOrDinner} breakfastOrDinner - 아침인지 점심인지
 */
export const unlikeMeal = async (day: string, mealIndex: number, userId: string, breakfastOrDinner: BreakfastOrDinner) => {
    const dayRef = doc(db, "meals", day).withConverter(mealConverter);
    const breakfastOrDinnerLike = breakfastOrDinner === 'breakfastAmount' ? 'breakfastLike' : 'dinnerLike'
    await deleteDoc(doc(dayRef, breakfastOrDinnerLike, userId + mealIndex))
}

export const mealLikeList = async (day: string, breakfastOrDinner: BreakfastOrDinner) => {
    try {
        const dayRef = doc(db, "meals", day).withConverter(mealConverter);
        const breakfastOrDinnerLike = breakfastOrDinner === 'breakfastAmount' ? 'breakfastLike' : 'dinnerLike'
        const likeCollectionRef = collection(dayRef, breakfastOrDinnerLike)
        const likeSnap = await getDocs(likeCollectionRef)
        if (!likeSnap.empty) {
            return likeSnap.docs.map(doc => {
                const likedMealIndex = doc.data().like.split('-').at(-1)
                return { userId: doc.id.slice(0, -1), likedMealIndex }
            })
        }
        return null
    } catch (e) {
        console.error(e)
    }
}


export const getPopularMeal = async () => {
    try {
        console.log(currentMonth);

        const rankSnap = await getDoc(doc(db, 'rank', currentMonth))
        if (rankSnap.exists()) {
            const data = rankSnap.data() as { breakfast: { breakfast: string, like: number }[], dinner: { dinner: string, like: number }[] }
            const result: { meal: string, like: number }[] = []
            data.breakfast.forEach(b => {
                result.push({ meal: b.breakfast, like: b.like })
            })
            data.dinner.forEach(d => {
                result.push({ meal: d.dinner, like: d.like })
            })
            return result.sort((a, b) => b.like - a.like).slice(0, 3)
        }
        return null
    } catch (e) {
        console.error(e)
    }
}


export const runRankCall = async () => {
    try {
        const call = httpsCallable(functions, 'rankRun')
        await call()
    } catch (e) {
        console.error(e)
    }
}