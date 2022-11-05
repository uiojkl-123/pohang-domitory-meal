import { IonAccordion, IonAccordionGroup, IonLoading, IonRippleEffect, useIonAlert } from '@ionic/react';
import React from 'react';
import { Amount, BreakfastOrDinner } from '../model/amount';
import { uploadAmount } from '../service/amount.service';

interface AmountButtonsProps {
    breakfastOrDinner: BreakfastOrDinner
    day: string | undefined;
}

export const AmountButtons: React.FC<AmountButtonsProps> = (props) => {


    const { breakfastOrDinner, day } = props;

    const [sended, setSended] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const [present, dismissPresent] = useIonAlert()

    const handleAmountClick = async (amountType: Amount) => {
        if (!day) return;
        setLoading(true);
        try {
            await uploadAmount(amountType, day, breakfastOrDinner);
            setLoading(false);
            present({ header: '감사합니다!', mode: 'ios' })
            setSended(true);
        } catch (e) {
            setLoading(false);
            present({ header: '오류가 발생했습니다!', mode: 'ios' })
        }
    }

    return (
        <>
            <IonLoading isOpen={loading} message='업로드중...' mode='ios'></IonLoading>
            {!sended &&
                <IonAccordionGroup>
                    <IonAccordion mode='ios'>
                        <div className='amountShow' slot='header'>
                            남은양 알려주기
                        </div>
                        <div className='amountButtons' slot='content'>
                            <div className='amountButton ripple-parent ion-activatable' onClick={async () => handleAmountClick('full')}>
                                <div className='amountButtonIcon'>
                                    <img src='assets/Full.png'></img>
                                </div>
                                <div className="label full">
                                    많이 있어요!
                                </div>
                                <IonRippleEffect></IonRippleEffect>
                            </div>
                            <div className='amountButton ripple-parent ion-activatable' onClick={async () => handleAmountClick('medium')}>
                                <div className='amountButtonIcon'>
                                    <img src='assets/Medium.png'></img>
                                </div>
                                <div className="label medium ">
                                    적당히 있어요!
                                </div>
                                <IonRippleEffect></IonRippleEffect>
                            </div>
                            <div className='amountButton ripple-parent ion-activatable' onClick={async () => handleAmountClick('low')}>
                                <div className='amountButtonIcon'>
                                    <img src='assets/Low.png'></img>
                                </div>
                                <div className="label low">
                                    얼마 없어요!
                                </div>
                                <IonRippleEffect></IonRippleEffect>
                            </div>
                            <div className='amountButton ripple-parent ion-activatable' onClick={async () => handleAmountClick('none')}>
                                <div className='amountButtonIcon'>
                                    <img src='assets/None.png'></img>
                                </div>
                                <div className="label none">
                                    전혀없어요!
                                </div>
                                <IonRippleEffect></IonRippleEffect>
                            </div>
                        </div>
                    </IonAccordion>
                </IonAccordionGroup>
            }</>
    );
}
