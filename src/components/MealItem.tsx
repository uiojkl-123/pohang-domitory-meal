import React from 'react';
import { BreakfastOrDinner } from '../model/amount';
import { Dot } from './Dot';
import { Heart } from './Heart';

interface MealItemProps {
    likes: {
        userId: string;
        likedMealIndex: string;
    }[]
    menu: string;
    index: number;
    onHeartChange: (mealIndex: number, breakfastOrDinner: BreakfastOrDinner, isFill: boolean) => Promise<void>;
    breakfastOrDinner: BreakfastOrDinner;
}

export const MealItem: React.FC<MealItemProps> = (props) => {

    const { likes, menu, index, onHeartChange, breakfastOrDinner } = props;

    return (
        <div className="mealItem" >
            <div className="dotAndName">
                <Dot color='light-gray' />
                <div className="mealName">
                    {menu.replace(' |', ',')}
                </div>
                {likes.filter(v => (v.likedMealIndex === String(index))).length > 0 ?
                    <div className="likes">
                        {likes.filter(v => (v.likedMealIndex === String(index))).length}
                    </div> : null}
            </div>
            <Heart likes={likes} likedMealIndex={index} onFill={async () => onHeartChange(index, breakfastOrDinner, true)} onUnfill={async () => onHeartChange(index, breakfastOrDinner, false)} />
        </div>
    );
}
