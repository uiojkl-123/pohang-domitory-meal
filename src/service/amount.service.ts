import { addDoc, collection, getDocs, limit, onSnapshot, orderBy, query, Timestamp } from "firebase/firestore";
import { Amount, BreakfastOrDinner } from "../model/amount";
import { useMealStore } from "../store/store";
import { db } from "./firebase";

export const uploadAmount = async (amount: Amount, breakfastOrDinner: BreakfastOrDinner) => {
    const day = useMealStore.getState().nowDay;
    if (!day) return;
    try {
        await addDoc(collection(db, 'meals', day, breakfastOrDinner), {
            amount,
            checkedAt: new Date()
        });
    } catch (e) {
        console.error(e)
        throw e
    }
}


export const subscribeAmounts = async (day: string, setBreakfastState: any, setDinnerState: any, setBreakfastCheckedAtState: any, setDinnerCheckedAtState: any) => {

    const getOnSnapshot = (breakfastOrDinner: BreakfastOrDinner) => {
        return onSnapshot(query(collection(db, 'meals', day, breakfastOrDinner), orderBy('checkedAt', 'desc'), limit(1)), (amountSnapshot) => {
            if (amountSnapshot.empty) return;
            const amounts = amountSnapshot.docs[0].data().amount as Amount
            const checkedAt = amountSnapshot.docs[0].data().checkedAt as Timestamp
            const setState = breakfastOrDinner === 'breakfastAmount' ? setBreakfastState : setDinnerState
            const setCheckedAtState = breakfastOrDinner === 'breakfastAmount' ? setBreakfastCheckedAtState : setDinnerCheckedAtState
            setState(amounts)
            setCheckedAtState(checkedAt.toDate())
        });
    }

    // getOnSnapshot returns unsubscribe function
    return [getOnSnapshot('breakfastAmount'), getOnSnapshot('dinnerAmount')]
}