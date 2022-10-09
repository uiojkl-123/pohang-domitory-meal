import { IonButton, IonSpinner } from '@ionic/react'
import { useEffect, useRef, useState } from 'react'
import * as React from 'react'
import './DltButton.scss'

export interface WowButtonProps {
    onClick?: Function;
    className?: string | undefined
    id?: string
    disabled?: boolean
    style?: Object
    children?: React.ReactNode
}

/**
 * ## wow 버튼
 * 
 * onClick에 async 함수를 넣으면 실행중일 때 spinner가 나타남.  
 * textButton을 true로 하면 텍스트 버튼으로 표현.
 * 
 * @param {onClick} onClick 클릭 이벤트
 * @param {textButton} textButton 텍스트 버튼 여부
 *
 */
export const WowButton: React.FC<WowButtonProps> = (props) => {

    const { onClick, className, id, disabled, style } = props

    const [loading, setLoading] = useState<boolean>(false);

    const mountRef = useRef(true)

    useEffect(() => {
        return () => {
            mountRef.current = false
        }
    }, [])


    // onClick handle 로직
    const handleOnClick = async () => {
        setLoading(true)
        try {
            if (onClick) {
                try {
                    await onClick()
                    if (mountRef.current) setLoading(false)
                } catch (err: any) {
                    if (mountRef.current)
                        setLoading(false)
                    console.error(err);
                }
            } else if (onClick === undefined) {
                if (mountRef.current)
                    setLoading(false)
                return
            } else {
                if (mountRef.current)
                    setLoading(false)
                return
            }
        } catch (err) {
            if (mountRef.current)
                setLoading(false);
            console.log(err)
        }
        if (mountRef.current)
            setLoading(false);
    }

    return (
            <div className='dltbuttonText'>
                <div
                    style={style}
                    id={id}
                    className={className}
                    onClick={disabled ? () => { }
                        : handleOnClick}>
                    {loading ? <IonSpinner name='dots' color='medium' className='spinner'></IonSpinner> : props.children}
                </div>
            </div>
    )
}
