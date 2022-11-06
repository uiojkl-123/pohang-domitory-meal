import React from 'react';
import { Amount, BreakfastOrDinner } from '../model/amount';
import { format } from 'date-fns';
import { Dot } from './Dot';
import './AmountComponent.scss';
import { useIonAlert } from '@ionic/react';
import { uploadAmount } from '../service/amount.service';

interface AmountComponentProps {
    amount?: Amount;
    checkAt?: Date;
    breakfastOrDinner: BreakfastOrDinner;
}

export const AmountComponent: React.FC<AmountComponentProps> = (props) => {

    const { amount } = props;

    const [present, dismissPresent] = useIonAlert()

    const handleAmountClick = async () => {

        const thanks = async () => {
            await dismissPresent();
            present({
                mode: 'ios',
                header: '감사합니다!'
            })
        }
        await present({
            mode: 'ios',
            header: '남은 양을 선택해주세요',
            buttons: [
                {
                    text: '많이 있음',
                    cssClass: 'full',
                    handler: async () => {
                        uploadAmount('full', props.breakfastOrDinner);
                        await thanks()
                    }
                }, {
                    text: '적당히 있음',
                    cssClass: 'medium',
                    handler: async () => {
                        uploadAmount('medium', props.breakfastOrDinner);
                        await thanks()
                    }
                }, {
                    text: '적음',
                    cssClass: 'low',
                    handler: async () => {
                        uploadAmount('low', props.breakfastOrDinner);
                        await thanks()
                    }
                }, {
                    text: '없음',
                    cssClass: 'none',
                    handler: async () => {
                        uploadAmount('none', props.breakfastOrDinner);
                        await thanks()
                    }
                }, {
                    text: '닫기'
                },
            ]
        })

    }


    const CheckedTime = () =>
        <div className="checkedAt">
            {props.checkAt && format(props.checkAt, 'HH:mm 확인')}
        </div>

    const NoticeButton = () =>
        <div className="noticeButton" onClick={handleAmountClick}>
            남은 양 알려주기
        </div>


    switch (amount) {
        case 'full':
            return (
                <div className="amountComponent mealItem">
                    <div className="dotAndType">
                        {/* <Dot color='light-blue' /> */}
                        <div className="label full" style={{ color: 'var(--light-blue)' }}>
                            많이 있어요!
                        </div>
                        <CheckedTime />
                    </div>
                    <NoticeButton />
                </div>
            );

        case 'medium':
            return (
                <div className="amountComponent mealItem">
                    <div className="dotAndType">
                        {/* <Dot color='light-green' /> */}
                        <div className="label medium " style={{ color: 'var(--light-green)' }}>

                            적당히 있어요!
                        </div>
                        <CheckedTime />
                    </div>
                    <NoticeButton />
                </div>
            );

        case 'low':
            return (
                <div className="amountComponent mealItem">
                    <div className="dotAndType">
                        {/* <Dot color='light-orange' /> */}
                        <div className="label low" style={{ color: 'var(--light-orange)' }}>
                            얼마 없어요!
                        </div>
                        <CheckedTime />
                    </div>
                    <NoticeButton />
                </div>
            );

        case 'none':
            return (
                <div className="amountComponent mealItem">
                    <div className="dotAndType">
                        {/* <Dot color='light-red' /> */}
                        <div className="label none" style={{ color: 'var(--light-red)' }}>
                            전혀 없어요!
                        </div>
                        <CheckedTime />
                    </div>
                    <NoticeButton />
                </div>
            );

        default:
            return (
                <div className="amountComponent mealItem">
                    <div className="dotAndType">
                        <div className="label" style={{ color: 'var(--light-gray)' }}>
                            남은양 정보가 없어요...
                        </div>
                    </div>
                    <NoticeButton />
                </div>
            );

    }
}
