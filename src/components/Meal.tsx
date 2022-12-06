import { IonAccordion, IonAccordionGroup, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonList, IonRippleEffect, IonSkeletonText, IonText, IonTitle } from '@ionic/react';
import { DocumentData, Timestamp } from 'firebase/firestore';
import React, { useCallback, useEffect } from 'react';
import { Amount, BreakfastOrDinner } from '../model/amount';
import { MealClass } from '../model/meal';
import { subscribeAmounts } from '../service/amount.service';
import { auth } from '../service/firebase';
import { likeMeal, mealLikeList as getMealLikeList, unlikeMeal } from '../service/meal.service';
import { useMealStore } from '../store/store';
import { todayyyyyMMdd, now9HourAfter } from '../util/day';
import { AmountComponent } from './AmountComponent';
import { Dot } from './Dot';
import { Heart } from './Heart';
import './Meal.scss';

interface MealProps {
    value: MealClass | null
}

export const Meal: React.FC<MealProps> = (props) => {
    const { value } = props;

    const { nowDay } = useMealStore();

    const [breakfastAmount, setBreakfastAmount] = React.useState<Amount>();
    const [dinnerAmount, setDinnerAmount] = React.useState<Amount>();

    const [breakfastCheckAt, setBreakfastCheckAt] = React.useState<Date>();
    const [dinnerCheckAt, setDinnerCheckAt] = React.useState<Date>();

    const [breakfastLikes, setBreakfastLikes] = React.useState<{
        userId: string;
        likedMealIndex: string;
    }[] | null>([])
    const [dinnerLikes, setDinnerLikes] = React.useState<{
        userId: string;
        likedMealIndex: string;
    }[] | null>([])

    const mountRef = React.useRef(true);


    React.useEffect(() => {
        let breakfastAmountUnsubscribe: any;
        let dinnerAmountUnsubscribe: any;
        (async () => {
            if (!nowDay) return;
            const [getBreakfastAmountUnsubscribe, getDinnerAmountUnsubscribe] = await subscribeAmounts(nowDay, setBreakfastAmount, setDinnerAmount, setBreakfastCheckAt, setDinnerCheckAt);
            breakfastAmountUnsubscribe = getBreakfastAmountUnsubscribe;
            dinnerAmountUnsubscribe = getDinnerAmountUnsubscribe;
        })();

        return () => {
            // breakfastAmountUnsubscribe();
            // dinnerAmountUnsubscribe();
            setBreakfastAmount(undefined);
            setDinnerAmount(undefined);
            setBreakfastCheckAt(undefined);
            setDinnerCheckAt(undefined);
        }

    }, [nowDay])

    useEffect(() => {
        (async () => {

            if (value && nowDay) {
                const getBreakFastLikesRes = await getMealLikeList(nowDay, 'breakfastAmount');
                const getDinnerLikesRes = await getMealLikeList(nowDay, 'dinnerAmount');
                if (getBreakFastLikesRes && mountRef.current) {
                    setBreakfastLikes(getBreakFastLikesRes);
                }
                if (getDinnerLikesRes && mountRef.current) {
                    setDinnerLikes(getDinnerLikesRes);
                }
            }
        })()
        return () => {
            setBreakfastLikes([]);
            setDinnerLikes([]);
        }
    }, [nowDay, auth.currentUser])

    useEffect(() => {
        return () => {
            mountRef.current = false;
        }
    }, [])

    const handleOnFill = async (mealIndex: number, breakfastOrDinner: BreakfastOrDinner) => {
        if (!nowDay) return;
        const user = auth.currentUser;
        if (!user?.uid) return;
        await likeMeal(nowDay, mealIndex, user.uid, breakfastOrDinner);
        if (breakfastOrDinner === 'breakfastAmount') {
            setBreakfastLikes((prev) => {
                if (!prev) return prev;
                return [...prev, {
                    userId: user.uid,
                    likedMealIndex: String(mealIndex)
                }]
            }
            )
        } else {
            setDinnerLikes((prev) => {
                if (!prev) return prev;
                return [...prev, {
                    userId: user.uid,
                    likedMealIndex: String(mealIndex)
                }]
            }
            )
        }
    }

    const handleOnUnfill = async (mealIndex: number, breakfastOrDinner: BreakfastOrDinner) => {
        if (!nowDay) return;
        const user = auth.currentUser;
        if (!user?.uid) return;
        await unlikeMeal(nowDay, mealIndex, user.uid, breakfastOrDinner);
        if (breakfastOrDinner === 'breakfastAmount') {
            setBreakfastLikes((prev) => {
                if (!prev) return prev;
                return prev.filter((like) => !(like.userId === user.uid && like.likedMealIndex === String(mealIndex)))

            }
            )
        } else {
            setDinnerLikes((prev) => {
                if (!prev) return prev;
                return prev.filter((like) => !(like.userId === user.uid && like.likedMealIndex === String(mealIndex)))
            }
            )
        }
    }

    return (
        value !== null ?
            <>
                <div className='mealCard card'>
                    <div className='cardHeader'>
                        <h2>아침</h2>
                    </div>
                    {value && breakfastLikes ? value!.breakfast.map((value, index) => {
                        return (
                            <div className="mealItem" key={value}>
                                <div className="dotAndName">
                                    <Dot color='light-gray' />
                                    <div className="mealName">
                                        {value.replace(' |', ',')}
                                    </div>
                                    {breakfastLikes.filter(v => (v.likedMealIndex === String(index))).length > 0 ?
                                        <div className="likes">
                                            {breakfastLikes.filter(v => (v.likedMealIndex === String(index))).length}
                                        </div> : null}
                                </div>
                                <Heart likes={breakfastLikes} likedMealIndex={index} onFill={async () => handleOnFill(index, 'breakfastAmount')} onUnfill={async () => handleOnUnfill(index, 'breakfastAmount')} />
                            </div>
                        )
                    }) : [...Array(3)].map((_, index) => {
                        return (
                            <div className="mealItem" key={index}>
                                <div className="dotAndName">
                                    <Dot color='light-gray' />
                                    <div className="mealName">
                                        <IonSkeletonText animated />
                                    </div>
                                </div>
                                <Heart />
                            </div>
                        )
                    })}
                    {(todayyyyyMMdd === nowDay) && new Date().getHours() >= 7 &&
                        <AmountComponent amount={breakfastAmount} checkAt={breakfastCheckAt} breakfastOrDinner='breakfastAmount' />}
                </div>

                <div className='mealCard card'>
                    <div className='cardHeader'>
                        <h2>저녁</h2>
                    </div>
                    {value && dinnerLikes ? value.dinner.map((value, index) => {
                        return (
                            <div className="mealItem" key={value}>
                                <div className="dotAndName">
                                    <Dot color='light-gray' />
                                    <div className="mealName">{value.replace(' |', ',')}</div>
                                    {dinnerLikes.filter(v => (v.likedMealIndex === String(index))).length > 0 ?
                                        <div className="likes">
                                            {dinnerLikes.filter(v => (v.likedMealIndex === String(index))).length}
                                        </div> : null}
                                </div>
                                <Heart likes={dinnerLikes} likedMealIndex={index} onFill={async () => handleOnFill(index, 'dinnerAmount')} onUnfill={async () => handleOnUnfill(index, 'dinnerAmount')} />
                            </div>
                        )
                    }) : [...Array(3)].map((_, index) => {
                        return (
                            <div className="mealItem" key={index}>
                                <div className="dotAndName">
                                    <Dot color='light-gray' />
                                    <div className="mealName">
                                        <IonSkeletonText animated />
                                    </div>
                                </div>
                                <Heart />
                            </div>
                        )
                    })}
                    {(todayyyyyMMdd === nowDay) && new Date().getHours() >= 16 &&
                        < AmountComponent amount={dinnerAmount} checkAt={dinnerCheckAt} breakfastOrDinner='dinnerAmount' />}
                </div>
            </>
            :
            <div className="nomeal card">
                <h2>자료가 없습니다.</h2>
            </div>
    );
}
