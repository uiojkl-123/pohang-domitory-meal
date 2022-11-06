import create from 'zustand';
import { devtools } from 'zustand/middleware'

const store = (set: any) => ({
    

})

/**
 * **당일 좋아요 스토어**
 */
export const useLikeStore = create(devtools(store));