import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonList, IonText, IonTitle } from '@ionic/react';
import React from 'react';
import { MealClass } from '../model/meal';
import './Meal.scss';

interface MealProps {
    value: MealClass | null
}

export const Meal: React.FC<MealProps> = (props) => {
    const { value } = props;

    return (
        value ?
            <div className="meal">

                <div className='mealCard'>
                    <div className='cardHeader'>
                        <div>아침</div>
                    </div>
                    <div className='cardContent'>
                        {value.breakfast.map((value) => {
                            return (
                                <div className="mealItem">
                                    <div className="mealName">{value}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className='mealCard'>
                    <div className='cardHeader'>
                        <div>저녁</div>
                    </div>
                    <div className='cardContent'>   
                        {value.dinner.map((value) => {
                            return (
                                <div className="mealItem">
                                    <div className="mealName">{value}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
            :
            <div className="nomeal">
                <h2>자료가 없습니다.</h2>
            </div>
    );
}
