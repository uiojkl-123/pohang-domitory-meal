import React from 'react';

interface HeartSkeletonProps {

}

export const HeartSkeleton: React.FC<HeartSkeletonProps> = (props) => {

    return (
        <div className="heart heartSkeleton">
            <img src={'assets/heart-outline.svg'} alt="heart" />
        </div>

    );
}
