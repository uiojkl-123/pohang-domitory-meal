import React from 'react';
import './Heart.scss';

interface HeartProps {
    onClick: () => Promise<void> | void;
}

export const Heart: React.FC<HeartProps> = (props) => {

    const { onClick } = props;

    const [isFilled, setIsFilled] = React.useState(false);

    const handleClick = () => {
        setIsFilled(!isFilled);
        onClick();
    }

    return (
        <div className="heart" onClick={handleClick}>
            <img src={isFilled ? 'assets/heart-fill.svg' : 'assets/heart-outline.svg'} className={isFilled ? 'fiiled' : ''} alt="heart" />
        </div>
    );
}
