import React from 'react';
import './PopularMeal.scss';

interface PopularMealProps {

}

export const PopularMeal: React.FC<PopularMealProps> = (props) => {

    const nowMonth = new Date().getMonth() + 1;

    const [popularMeal, setPopularMeal] = React.useState<string[]>([]);

    React.useEffect(() => {
        setPopularMeal([
            '기록 준비중',
            '기록 준비중',
            '기록 준비중',
        ])
    }, [])


    return (
        <div className="popularMeal card">
            <div className="cardHeader">
                <h2>{nowMonth}월</h2>
                인기 메뉴
            </div>
            {popularMeal &&
                < div className="popularMealRank">
                    <div className="popularMealItem 1">
                        <div className="rankAndName">
                            <div className="rank rank1">1</div>
                            <div className="name">{popularMeal[0]}</div>
                        </div>
                    </div>
                    <div className="popularMealItem 2">
                        <div className="rankAndName">
                            <div className="rank rank2">2</div>
                            <div className="name">{popularMeal[0]}</div>
                        </div>
                    </div>
                    <div className="popularMealItem 3">
                        <div className="rankAndName">
                            <div className="rank rank3">3</div>
                            <div className="name">{popularMeal[0]}</div>
                        </div>
                    </div>
                </div>
            }
        </div >
    );
}
