import { IonAccordion, IonAccordionGroup, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonList, IonRippleEffect, IonText, IonTitle } from '@ionic/react';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { Amount } from '../model/amount';
import { MealClass } from '../model/meal';
import { subscribeAmounts } from '../service/amount.service';
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
            breakfastAmountUnsubscribe();
            dinnerAmountUnsubscribe();
            setBreakfastAmount(undefined);
            setDinnerAmount(undefined);
        }
    }, [nowDay])

    return (
        value ?
            <>
                <div className='mealCard card'>
                    <div className='cardHeader'>
                        <h2>아침</h2>
                    </div>
                    {value.breakfast.map((value) => {
                        return (
                            <div className="mealItem" key={value}>
                                <div className="dotAndName">
                                    <Dot color='light-gray' />
                                    <div className="mealName">{value.replace(' |', ',')}</div>
                                </div>
                                <Heart onClick={() => { }} />
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
                    {value.dinner.map((value) => {
                        return (
                            <div className="mealItem" key={value}>
                                <div className="dotAndName">
                                    <Dot color='light-gray' />
                                    <div className="mealName">{value.replace(' |', ',')}</div>
                                </div>
                                <Heart onClick={() => { }} />
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
