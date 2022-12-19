import { IonAccordion, IonAccordionGroup, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonList, IonRippleEffect, IonSkeletonText, IonText, IonTitle } from '@ionic/react';
import { DocumentData, Timestamp } from 'firebase/firestore';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useErrorPresent } from '../hooks/useErrorPresent';
import { useGetNowDayLikes } from '../hooks/useGetNowDayLikes';
import { useGetNowDayMealAmount } from '../hooks/useGetNowDayMealAmount';
import { Amount, BreakfastOrDinner } from '../model/amount';
import { Likes } from '../model/like';
import { MealClass } from '../model/meal';
import { subscribeAmounts } from '../service/amount.service';
import { auth } from '../service/firebase';
import { likeMeal, unlikeMeal } from '../service/meal.service';
import { useMealStore } from '../store/store';
import { todayyyyyMMdd, now9HourAfter } from '../util/day';
import { AmountComponent } from './AmountComponent';
import { Dot } from './Dot';
import { Heart } from './Heart';
import { HeartSkeleton } from './HeartSkeleton';
import './Meal.scss';
import { MealItem } from './MealItem';

interface MealProps {
    value: MealClass | null
}

export const Meal: React.FC<MealProps> = (props) => {

    const { value } = props;
    const { nowDay } = useMealStore();
    const mountRef = useRef(true);
    const [presentError, dismissPresent] = useErrorPresent()


    // Get amounts (Subscribe)
    const { breakfastAmount, dinnerAmount, breakfastCheckAt, dinnerCheckAt } = useGetNowDayMealAmount();

    // Get likes (Snapshot)
    const { breakfastLikes, dinnerLikes, setBreakfastLikes, setDinnerLikes, getLikes } = useGetNowDayLikes(mountRef.current);

    useEffect(() => {
        return () => {
            mountRef.current = false;
        }
    }, [])


    // Handle like

    const handleOnHeartClick = async (mealIndex: number, breakfastOrDinner: BreakfastOrDinner, isFill: boolean) => {
        if (!nowDay) return;
        const user = auth.currentUser;
        if (!user?.uid) return;
        const likeOrUnlike = isFill ? likeMeal : unlikeMeal;
        try {
            await likeOrUnlike(nowDay, mealIndex, user.uid, breakfastOrDinner);
            await getLikes(breakfastOrDinner);
        } catch (e) {
            console.error(e);
            presentError('오류', '좋아요 설정 도중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.')
        }
    }

    const MealSkeletion = () =>
        <>{[...Array(3)].map((_, index) => {
            return (
                <div className="mealItem" key={index}>
                    <div className="dotAndName">
                        <Dot color='light-gray' />
                        <div className="mealName">
                            <IonSkeletonText animated />
                        </div>
                    </div>
                    <HeartSkeleton />
                </div>
            )
        })}</>

    return (
        value !== null ?
            <>
                <div className='mealCard card'>
                    <div className='cardHeader'>
                        <h2>아침</h2>
                    </div>
                    {value && breakfastLikes ? value!.breakfast.map((menu, index) => {
                        return (
                            <MealItem
                                key={index}
                                likes={breakfastLikes}
                                menu={menu}
                                index={index}
                                onHeartChange={handleOnHeartClick}
                                breakfastOrDinner={'breakfastAmount'}
                            />
                        )
                    }) : <MealSkeletion />}
                    {(todayyyyyMMdd === nowDay) && new Date().getHours() >= 7 &&
                        <AmountComponent amount={breakfastAmount} checkAt={breakfastCheckAt} breakfastOrDinner='breakfastAmount' />}
                </div>

                <div className='mealCard card'>
                    <div className='cardHeader'>
                        <h2>저녁</h2>
                    </div>
                    {value && dinnerLikes ? value.dinner.map((menu, index) => {
                        return (
                            <MealItem
                                key={index}
                                likes={dinnerLikes}
                                menu={menu}
                                index={index}
                                onHeartChange={handleOnHeartClick}
                                breakfastOrDinner={'dinnerAmount'}
                            />
                        )
                    }) : <MealSkeletion />}
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
