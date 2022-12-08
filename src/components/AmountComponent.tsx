import React from 'react';
import { Amount, BreakfastOrDinner } from '../model/amount';
import { format } from 'date-fns';
import { Dot } from './Dot';
import './AmountComponent.scss';
import { useIonAlert } from '@ionic/react';
import { uploadAmount } from '../service/amount.service';
import { Color } from '../model/color';
import { AMOUNT_DATA, useOnAmountClick } from '../hooks/useOnAmountClick';

interface AmountComponentProps {
    amount?: Amount;
    checkAt?: Date;
    breakfastOrDinner: BreakfastOrDinner;
}

export const AmountComponent: React.FC<AmountComponentProps> = (props) => {

    const { amount } = props;

    const handleAmountClick = useOnAmountClick(props.breakfastOrDinner)

    const CheckedTime = () =>
        <div className="checkedAt">
            {props.checkAt && format(props.checkAt, 'HH:mm 확인')}
        </div>

    const NoticeButton = () =>
        <div className="noticeButton" onClick={handleAmountClick}>
            남은 양 알려주기
        </div>

    return (
        <>
            {amount ? <div className="amountComponent mealItem">
                <div className="dotAndType">
                    <Dot color={AMOUNT_DATA[amount].color} />
                    <div className="label" style={{ color: `var(--${AMOUNT_DATA[amount].color})` }}>
                        {AMOUNT_DATA[amount].displayText}
                    </div>
                    <CheckedTime />
                </div>
                <NoticeButton />
            </div>
                :
                <div className="amountComponent mealItem">
                    <div className="dotAndType">
                        <div className="label">
                        </div>
                    </div>
                    <NoticeButton />
                </div>
            }
        </>
    )
}
