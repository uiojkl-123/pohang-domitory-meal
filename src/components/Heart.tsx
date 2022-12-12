import React, { useEffect } from 'react';
import { auth } from '../service/firebase';
import { useMealStore } from '../store/store';
import './Heart.scss';

type HeartProps = {
    onFill: () => Promise<void>;
    onUnfill: () => Promise<void>;
    likes?: { userId: string, likedMealIndex: string }[] | null;
    likedMealIndex?: number;
}



export const Heart: React.FC<HeartProps> = (props) => {

    const { nowDay } = useMealStore();

    const { onFill, onUnfill, likes, likedMealIndex } = props;

    const [isFilled, setIsFilled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);


    useEffect(() => {
        if (likes) {
            const isLiked = likes.some((like) => {
                return like.userId === auth.currentUser?.uid && like.likedMealIndex === String(likedMealIndex);
            })
            setIsFilled(isLiked);
        }
    }, [likes, auth.currentUser, nowDay, likedMealIndex])

    const handleClick = async () => {
        if (loading) return;
        setLoading(true);
        const fillOrUnfill = isFilled ? onUnfill : onFill;
        await fillOrUnfill?.();

        setIsFilled(!isFilled);
        setLoading(false);
    }

    return (
        <div className="heart" onClick={handleClick}>
            <img src={isFilled ? 'assets/heart-fill.svg' : 'assets/heart-outline.svg'} className={isFilled ? 'fiiled' : ''} alt="heart" />
        </div>
    );
}
