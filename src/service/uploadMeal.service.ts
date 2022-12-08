import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { rowsToColumns, mergeRowsOf1DArraysin2DArrayin3D, splitRowsByNumberAndMergeTo3DArray, handleDate, sliceFirstColumn } from "../util/splitRows"
import { auth, db } from "./firebase"
import { mealConverter } from "./firebaseConverter"

export const wow = []

export const adminSignIn = async (password: string) => {
    const email = 'rwbugijpaefnrg@aeojinaefopsb.com'
    try {
        await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
        console.error(error)
        const errorName = error.code === 'auth/wrong-password' ? '비밀번호가 틀렸습니다.' : '로그인에 실패했습니다.'
        throw errorName as string
    }
}

export const convertAndUploadMeal = async (meal2DArray: string[][]) => {
    const converted = rowsToColumns(mergeRowsOf1DArraysin2DArrayin3D(splitRowsByNumberAndMergeTo3DArray(sliceFirstColumn(meal2DArray), 8)))
    converted.map(async (daily) => {
        const date = handleDate(daily[0])
        if (!date) { return }
        const meal = {
            breakfast: daily.slice(1, 4).filter((item) => item !== ''),
            dinner: daily.slice(4).filter((item) => item !== '')
        }
        try{
        await uploadMeal(date, meal)
        } catch (error: any) {
            console.error(error)
            throw error as string
        }
    })

}

const uploadMeal = async (day: string, meal: { breakfast: string[], dinner: string[] }) => {
    const mealRef = doc(db, "meals", day).withConverter(mealConverter)
    try {
        await setDoc(mealRef, meal)
    } catch (error: any) {
        console.error(error)
        throw '저장에 실패했습니다.'
    }
}
