import { IonSkeletonText } from '@ionic/react';
import React from 'react';
import { getPopularMeal, runRankCall } from '../service/meal.service';
import { currentMonth } from '../util/dayUtils';
import './PopularMeal.scss';

interface PopularMealProps {

}

export const PopularMeal: React.FC<PopularMealProps> = (props) => {

    const [popularMeal, setPopularMeal] = React.useState<{ meal: string, like: number }[]>();

    const [rankLoading, setRankLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        (async () => {
            const getPopularMealRes = await getPopularMeal();
            console.log(getPopularMealRes);
            if (getPopularMealRes) {
                if (getPopularMealRes.length <= 0) {
                    setRankLoading(false);
                    return
                }
                setPopularMeal(getPopularMealRes);
            }
        })();
    }, [])

    const refreshRank = async () => {
        setRankLoading(true);
        try {
            await runRankCall()
            const getPopularMealRes = await getPopularMeal();
            if (getPopularMealRes && getPopularMealRes.length > 0) {
                setPopularMeal(getPopularMealRes);
            }
            setRankLoading(false);
        } catch (e) {
            setRankLoading(false);
            console.error(e);
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

            {popularMeal && popularMeal[0].meal &&
                <div className="popularMealItem 1">
                    <div className="rankAndName">
                        <div className="rank rank1">1</div>
                        {rankLoading || !popularMeal ?
                            <IonSkeletonText animated />
                            :
                            <>
                                <div className="name">{popularMeal[0].meal}</div>
                                <div className="likes">
                                    {popularMeal[0].like}
                                </div>
                            </>
                        }
                    </div>
                </div>}

            {popularMeal && popularMeal[1].meal &&

                <div className="popularMealItem 2">
                    <div className="rankAndName">
                        <div className="rank rank2">2</div>
                        {rankLoading || !popularMeal ?
                            <IonSkeletonText animated />
                            :
                            <>
                                <div className="name">{popularMeal[1].meal}</div>
                                <div className="likes">
                                    {popularMeal[1].like}
                                </div>
                            </>
                        }
                    </div>
                </div>
            }

            {popularMeal && popularMeal[2].meal &&

                <div className="popularMealItem 3">
                    <div className="rankAndName">
                        <div className="rank rank3">3</div>
                        {rankLoading || !popularMeal ?
                            <IonSkeletonText animated />
                            :
                            <>
                                <div className="name">{popularMeal[2].meal}</div>
                                <div className="likes">
                                    {popularMeal[2].like}
                                </div>
                            </>
                        }
                    </div>
                </div>
            }
        </div >
    );
}
