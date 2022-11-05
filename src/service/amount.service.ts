import { addDoc, collection, getDocs, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { Amount, BreakfastOrDinner } from "../model/amount";
import { db } from "./firebase";

export const uploadAmount = async (amount: Amount, day: string, breakfastOrDinner: BreakfastOrDinner) => {
    await addDoc(collection(db, 'meals', day, breakfastOrDinner), {
        amount,
        checkedAt: new Date()
    });
}


export const subscribeAmounts = async (day: string, setBreakfastState: any, setDinnerState: any) => {
    const breakfastAmountUnsubscribe = onSnapshot(query(collection(db, 'meals', day, 'breakfastAmount'), orderBy('checkedAt', 'desc'), limit(1)), (breakfastAmountSnapshot) => {
        if (breakfastAmountSnapshot.empty) return;
        const breakfastAmounts = breakfastAmountSnapshot.docs[0].data().amount as Amount
        setBreakfastState(breakfastAmounts)
    });

    const dinnerAmountUnsubscribe = onSnapshot(query(collection(db, 'meals', day, 'dinnerAmount'), orderBy('checkedAt', 'desc'), limit(1)), (dinnerAmountSnapshot) => {
        if (dinnerAmountSnapshot.empty) return
        const dinnerAmounts = dinnerAmountSnapshot.docs[0].data().amount as Amount
        setDinnerState(dinnerAmounts)
    });

    return [breakfastAmountUnsubscribe, dinnerAmountUnsubscribe]
}