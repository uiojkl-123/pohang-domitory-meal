import React from 'react';
import { Amount } from '../model/amount';

interface AmountComponentProps {
    amount: Amount;
}

export const AmountComponent: React.FC<AmountComponentProps> = (props) => {

    const { amount } = props;

    switch (amount) {
        case 'full':
            return (
                <div className="amountComponent">
                    <div className='amountButtonIcon'>
                        <img src='assets/Full.png'></img>
                    </div>
                    <div className="label full">
                        많이 있어요!
                    </div>
                </div>
            );

        case 'medium':
            return (
                <div className="amountComponent">
                    <div className='amountButtonIcon'>

                        <img src='assets/Medium.png'></img>
                    </div>
                    <div className="label medium ">
                        적당히 있어요!
                    </div>
                </div>
            );

        case 'low':
            return (
                <div className="amountComponent">
                    <div className='amountButtonIcon'>
                        <img src='assets/Low.png'></img>
                    </div>
                    <div className="label low">
                        얼마 없어요!
                    </div>
                </div>
            );

        case 'none':
            return (
                <div className="amountComponent">
                    <div className='amountButtonIcon'>
                        <img src='assets/None.png'></img>
                    </div>
                    <div className="label none">
                        전혀 없어요!
                    </div>
                </div>
            );
    }
}
