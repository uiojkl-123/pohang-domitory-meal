import { IonAccordion, IonAccordionGroup, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonList, IonRippleEffect, IonText, IonTitle } from '@ionic/react';
import React from 'react';
import { Amount } from '../model/amount';
import { MealClass } from '../model/meal';
import { subscribeAmounts } from '../service/amount.service';
import { useMealStore } from '../store/store';
import { now9HourAfter, todayyyyyMMdd } from '../util/day';
import { AmountButtons } from './AmountButtons';
import { AmountComponent } from './AmountComponent';
import './Meal.scss';

interface MealProps {
    value: MealClass | null
}

export const Meal: React.FC<MealProps> = (props) => {
    const { value } = props;

    const { nowDay } = useMealStore();

    const [breakfastAmount, setBreakfastAmount] = React.useState<Amount>();
    const [dinnerAmount, setDinnerAmount] = React.useState<Amount>();

    React.useEffect(() => {
        let breakfastAmountUnsubscribe: any;
        let dinnerAmountUnsubscribe: any;
        (async () => {
            if (!nowDay) return;
            const [getBreakfastAmountUnsubscribe, getDinnerAmountUnsubscribe] = await subscribeAmounts(nowDay, setBreakfastAmount, setDinnerAmount);
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
            <div className="meal">
                <div className='mealCard'>
                    <div className='cardHeader'>
                        <div>아침</div>
                    </div>
                    <div className='cardContent'>
                        {breakfastAmount && <div className='mealItem'>
                            <AmountComponent amount={breakfastAmount} />
                        </div>}
                        {value.breakfast.map((value) => {
                            return (
                                <div className="mealItem" key={value}>
                                    <div className="mealName">{value}</div>
                                </div>
                            )
                        })}
                        {(todayyyyyMMdd === nowDay) && now9HourAfter.getHours() > 7 && <AmountButtons breakfastOrDinner='breakfastAmount' day={nowDay}></AmountButtons>}
                    </div>
                </div>

                <div className='mealCard'>
                    <div className='cardHeader'>
                        <div>저녁</div>
                    </div>
                    <div className='cardContent'>
                        {dinnerAmount && <div className='mealItem'>
                            <AmountComponent amount={dinnerAmount} />
                        </div>}
                        {value.dinner.map((value) => {
                            return (
                                <div className="mealItem" key={value}>
                                    <div className="mealName">{value}</div>
                                </div>
                            )
                        })}
                        {(todayyyyyMMdd === nowDay) && now9HourAfter.getHours() > 16 && <AmountButtons breakfastOrDinner='dinnerAmount' day={nowDay}></AmountButtons>}
                    </div>
                </div>

            </div >
            :
            <div className="nomeal">
                <h2>자료가 없습니다.</h2>
            </div>
    );
}
