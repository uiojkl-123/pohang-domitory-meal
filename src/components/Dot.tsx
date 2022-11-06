import React from 'react';
import './Dot.scss';

interface DotProps {
    color:
    'light-red'
    | 'light-orange'
    | 'light-green'
    | 'light-blue'
    | 'light-gray'
}

export const Dot: React.FC<DotProps> = (props) => {

    return (
        <div className="dot"
            style={{ background: 'var(--' + props.color + ')' }}
        ></div>
    );
}
