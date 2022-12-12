import { signInAnonymously } from "firebase/auth";
import { auth } from "./firebase";

export const login = async () => {
    try {
        await signInAnonymously(auth)
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        throw new Error(errorCode, { cause: errorMessage });
    }
}