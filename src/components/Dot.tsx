import React from 'react';
import { Color } from '../model/color';
import './Dot.scss';


interface DotProps {
    /**
     * 색상
     */
    color: Color
}

/**
 * **점을 표시하는 컴포넌트**
 * 
 * 색상 지정 가능
 */
export const Dot: React.FC<DotProps> = (props) => {

    return (
        <div className="dot"
            style={{ background: 'var(--' + props.color + ')' }}
        ></div>
    );
}
