import { addDoc, collection, getDocs, limit, onSnapshot, orderBy, query, Timestamp } from "firebase/firestore";
import { Amount, BreakfastOrDinner } from "../model/amount";
import { useMealStore } from "../store/store";
import { db } from "./firebase";

export const uploadAmount = async (amount: Amount, breakfastOrDinner: BreakfastOrDinner) => {
    const day = useMealStore.getState().nowDay;
    if (!day) return;
    await addDoc(collection(db, 'meals', day, breakfastOrDinner), {
        amount,
        checkedAt: new Date()
    });
}


export const subscribeAmounts = async (day: string, setBreakfastState: any, setDinnerState: any, setBreakfastCheckedAtState: any, setDinnerCheckedAtState: any) => {
    const breakfastAmountUnsubscribe = onSnapshot(query(collection(db, 'meals', day, 'breakfastAmount'), orderBy('checkedAt', 'desc'), limit(1)), (breakfastAmountSnapshot) => {
        if (breakfastAmountSnapshot.empty) return;
        const breakfastAmounts = breakfastAmountSnapshot.docs[0].data().amount as Amount
        const checkedAt = breakfastAmountSnapshot.docs[0].data().checkedAt as Timestamp
        setBreakfastState(breakfastAmounts)
        setBreakfastCheckedAtState(checkedAt.toDate())

    });

    const dinnerAmountUnsubscribe = onSnapshot(query(collection(db, 'meals', day, 'dinnerAmount'), orderBy('checkedAt', 'desc'), limit(1)), (dinnerAmountSnapshot) => {
        if (dinnerAmountSnapshot.empty) return
        const dinnerAmounts = dinnerAmountSnapshot.docs[0].data().amount as Amount
        const checkedAt = dinnerAmountSnapshot.docs[0].data().checkedAt as Timestamp
        setDinnerState(dinnerAmounts)
        setDinnerCheckedAtState(checkedAt.toDate())
    });

    return [breakfastAmountUnsubscribe, dinnerAmountUnsubscribe]
}