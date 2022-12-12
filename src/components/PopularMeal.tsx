import { IonSkeletonText } from '@ionic/react';
import React, { useEffect } from 'react';
import { useErrorPresent } from '../hooks/useErrorPresent';
import { useGetPopularMeal } from '../hooks/useGetPopularMeal';
import { getPopularMeal, runRankCall } from '../service/meal.service';
import { currentMonth } from '../util/dayUtils';
import './PopularMeal.scss';

interface PopularMealProps {

}

export const PopularMeal: React.FC<PopularMealProps> = (props) => {

    const { popularMeal, initPopularMeal, runGetPopularMeal } = useGetPopularMeal()

    const [presentError, dismissPresent] = useErrorPresent()

    const refreshRank = async () => {
        initPopularMeal()
        try {
            await runRankCall()
            await runGetPopularMeal()
        } catch (e) {
            console.error(e);
            presentError('오류', '새로고침 도중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.')
        }
    }

    return (
        <div className="popularMeal card">

            <div className="cardHeader">
                <div className="title">
                    <h2>{currentMonth.slice(4, 6)}월</h2>
                    인기 메뉴
                </div>
                <div className="comment" onClick={refreshRank}>
                    <img src="assets/refresh-outline.svg" alt="refreshIcon" />
                    새로고침
                </div>
            </div>

            {popularMeal?.map((meal, index) => {
                return (
                    <div className="popularMealItem" key={index}>
                        <div className="rankAndName">
                            <div className={"rank rank" + (index + 1)}>{index + 1}</div>
                            {!popularMeal ?
                                <IonSkeletonText animated />
                                :
                                <>
                                    <div className="name">{meal.meal}</div>
                                    <div className="likes">
                                        {meal.like}
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                )
            })}
        </div >
    );
}
