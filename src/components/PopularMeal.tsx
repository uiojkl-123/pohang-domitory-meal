import React from 'react';
import { getPopularMeal } from '../service/meal.service';
import { currentMonth } from '../util/dayUtils';
import './PopularMeal.scss';

interface PopularMealProps {

}

export const PopularMeal: React.FC<PopularMealProps> = (props) => {

    const [popularMeal, setPopularMeal] = React.useState<{ meal: string, like: number }[]>();

    React.useEffect(() => {

        (async () => {
            const getPopularMealRes = await getPopularMeal();
            if (getPopularMealRes) {
                setPopularMeal(getPopularMealRes);
            }
        })();
    }, [])


    return (
        <div className="popularMeal card">

            <div className="cardHeader">
                <div className="title">
                    <h2>{currentMonth.slice(4, 6)}월</h2>
                    인기 메뉴
                </div>
                <div className="comment">
                    <img src="assets/refresh-outline.svg" alt="refreshIcon" />
                    매일 5시 업데이트
                </div>
            </div>



            {popularMeal &&
                <>
                    <div className="popularMealItem 1">
                        <div className="rankAndName">
                            <div className="rank rank1">1</div>
                            <div className="name">{popularMeal[0].meal}</div>
                            <div className="likes">
                                {popularMeal[0].like}
                            </div>
                        </div>
                    </div>
                    <div className="popularMealItem 2">
                        <div className="rankAndName">
                            <div className="rank rank2">2</div>
                            <div className="name">{popularMeal[1].meal}</div>
                            <div className="likes">
                                {popularMeal[1].like}
                            </div>
                        </div>
                    </div>
                    <div className="popularMealItem 3">
                        <div className="rankAndName">
                            <div className="rank rank3">3</div>
                            <div className="name">{popularMeal[2].meal}</div>
                            <div className="likes">
                                {popularMeal[2].like}
                            </div>
                        </div>
                    </div>
                </>
            }
        </div >
    );
}
