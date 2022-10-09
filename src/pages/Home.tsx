import { IonButton, IonCard, IonContent, IonDatetime, IonDatetimeButton, IonFooter, IonHeader, IonModal, IonPage, IonRippleEffect, IonRow, IonSlide, IonSlides, IonSpinner, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { Meal } from '../components/Meal';
import { MealStoreType } from '../model/store';
import { getDayMeal } from '../service/meal.service';
import { useMealStore } from '../store/store';
import { nextDayFromyyyyMMdd, prevDayFromyyyyMMdd } from '../util/day';
import { dayToKorean } from '../util/dayToKorean';
import './Home.css';

const Home: React.FC = () => {

  const page = useRef(undefined);
  const slideRef = useRef<HTMLIonSlidesElement>(null);

  const todayyyyyMMdd = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  const [day, setDay] = useState<string>(todayyyyyMMdd);
  const [presentingElement, setPresentingElement] = useState<HTMLElement | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);

  const { meals, getGlobalDayMeal } = useMealStore();

  useEffect(() => {
    setPresentingElement(page.current);
  }, []);

  useEffect(() => {
    getGlobalDayMeal(day);
  }, [day])


  const isMealExist = (day: string) => {
    return Object.keys(meals).includes(day)
  }

  const goNext = async () => {
    const nextDay = nextDayFromyyyyMMdd(day);
    if (!isMealExist(nextDay)) {
      const nextDayMeal = await getDayMeal(nextDay);
      if (nextDayMeal) {
        useMealStore.setState((state: MealStoreType) => { return { meals: { ...state.meals, [nextDay]: nextDayMeal } } })
      } else {
        useMealStore.setState((state: MealStoreType) => { return { meals: { ...state.meals, [nextDay]: null } } })

      }
    }
    setDay(nextDay);
  }

  const goPrev = async () => {
    const prevDay = prevDayFromyyyyMMdd(day);
    if (!isMealExist(prevDay)) {
      const prevDayMeal = await getDayMeal(prevDay);
      if (prevDayMeal) {
        useMealStore.setState((state: MealStoreType) => { return { meals: { ...state.meals, [prevDay]: prevDayMeal } } })
      } else {
        useMealStore.setState((state: MealStoreType) => { return { meals: { ...state.meals, [prevDay]: null } } })
      }
    }
    setDay(prevDay);
  }


  return (
    <IonPage ref={page}>
      <IonHeader mode='ios'>
        <IonToolbar mode='ios'>
          <IonTitle>포항학사 식단</IonTitle>
        </IonToolbar>
      </IonHeader>
      <div className='fullscreen'>

        <div className='cardContainer'>
          {meals[day] === undefined ? <IonSpinner></IonSpinner> : <Meal value={meals[day]} />}
        </div>
        <div className='toolbar'>

          <div className='leftButton ion-activatable ripple-parent' onClick={goPrev}>
            <img src='assets/leftButton.svg' />
            <IonRippleEffect></IonRippleEffect>
          </div>

          <div className='day' onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}>{dayToKorean(day)}</div>

          <div className='rightButton ion-activatable ripple-parent' onClick={goNext}>
            <img src='assets/rightButton.svg' />
            <IonRippleEffect></IonRippleEffect>
          </div>

        </div>

      </div>

      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} presentingElement={presentingElement}>
        <IonContent>
          <IonHeader mode='ios'>
            <IonToolbar mode='ios'>
              <IonTitle>날짜선택</IonTitle>
            </IonToolbar>
          </IonHeader>
          <div className='container'>
            <IonDatetime mode='md' id="datetime" presentation="date"></IonDatetime>
            <br></br>
            <IonButton mode='ios' onClick={() => setShowModal(false)}>완료</IonButton>
          </div>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default Home;

