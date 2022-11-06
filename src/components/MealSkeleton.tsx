import React from 'react';
import './Meal.scss';

interface MealSkeletonProps {

}

export const MealSkeleton: React.FC<MealSkeletonProps> = (props) => {

    return (
        <div className="mealSkeleton">
            MealSkeleton
        </div>
    );
}
