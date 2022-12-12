import { useIonAlert } from "@ionic/react";
import { Amount, BreakfastOrDinner } from "../model/amount";
import { Color } from "../model/color";
import { uploadAmount } from "../service/amount.service";

export const AMOUNT_DATA: {
    [key in Amount]: {
        selectText: string;
        displayText: string;
        color: Color;
    }
} = {
    full: {
        selectText: '많이 있음',
        displayText: '많이 있어요!',
        color: 'light-blue'
    },
    medium: {
        selectText: '적당히 있음',
        displayText: '적당히 있어요!',
        color: 'light-green'
    },
    low: {
        selectText: '적음',
        displayText: '얼마 없어요!',
        color: 'light-orange'
    },
    none: {
        selectText: '없음',
        displayText: '없어요!',
        color: 'light-red'
    }
}

export const useOnAmountClick = (breakfastOrDinner: BreakfastOrDinner) => {
    const [present, dismissPresent] = useIonAlert()

    return async () => {

        const thanks = async () => {
            await dismissPresent();
            present({
                mode: 'ios',
                header: '감사합니다!'
            })
        }

        await present({
            mode: 'ios',
            header: '남은 양을 선택해주세요',
            buttons: [
                ...Object.entries(AMOUNT_DATA).map(([key, value]) => {
                    return {
                        text: value.selectText,
                        cssClass: key,
                        handler: async () => {
                            try {
                                await uploadAmount(key as Amount, breakfastOrDinner)
                                thanks()
                            } catch (e) {
                                console.error(e)

                            }
                        }
                    }
                }),
                {
                    text: '닫기',
                    role: 'cancel',
                }
            ]
        })

    }
}