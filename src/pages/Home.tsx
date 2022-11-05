import { DatetimeChangeEventDetail, IonButton, IonButtons, IonCard, IonContent, IonDatetime, IonDatetimeButton, IonFooter, IonHeader, IonItem, IonLabel, IonMenu, IonMenuButton, IonModal, IonPage, IonRippleEffect, IonRow, IonSlide, IonSlides, IonSpinner, IonTitle, IonToolbar } from '@ionic/react';
import { parseISO } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { Meal } from '../components/Meal';
import { MealStoreType } from '../model/store';
import { getDayMeal } from '../service/meal.service';
import { useMealStore } from '../store/store';
import { nextDayFromyyyyMMdd, prevDayFromyyyyMMdd, yyyyMMddToDate } from '../util/day';
import { dayToKorean } from '../util/dayToKorean';
import './Home.css';

const Home: React.FC = () => {

  const page = useRef(undefined);

  const now9HourAfter = new Date(new Date().setHours(new Date().getHours() + 9)); // 한국 시간

  const todayyyyyMMdd = now9HourAfter.toISOString().slice(0, 10).replace(/-/g, '');

  const [day, setDay] = useState<string>(todayyyyyMMdd);
  const [dayFar, setDayFar] = useState<string>('오늘');
  const [presentingElement, setPresentingElement] = useState<HTMLElement | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);

  const { meals, getGlobalDayMeal } = useMealStore();

  useEffect(() => {
    setPresentingElement(page.current);
  }, []);

  useEffect(() => {
    getGlobalDayMeal(day);
  }, [])

  useEffect(() => {
    useMealStore.setState({ nowDay: day });
  }, [day])

  useEffect(() => {
    const today = new Date()
    const dayDate = yyyyMMddToDate(day)
    const diff = Math.floor((today.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24))
    if (diff === 0) {
      setDayFar('오늘')
    } else if (diff === 1) {
      setDayFar('어제')
    } else if (diff === -1) {
      setDayFar('내일')
    } else if (diff === -2) {
      setDayFar('모레')
    } else if (diff === 2) {
      setDayFar('그저께')
    } else if (diff > 1) {
      setDayFar(diff.toString() + '일 전')
    } else if (diff < -1) {
      setDayFar(Math.abs(diff).toString() + '일 후')
    }
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

  const handleSelectDay = (e: CustomEvent<DatetimeChangeEventDetail>) => {
    const selectedDay = e.detail.value;
    if (selectedDay) {
      const wow = selectedDay as string;
      const yyyyMMdd = wow.slice(0, 10).replace(/-/g, '');
      setDay(yyyyMMdd);
      getGlobalDayMeal(yyyyMMdd);
    }
  }


  return (
    <>
      <IonMenu contentId="main-content">
        <IonHeader mode='ios'>
          <IonToolbar mode='ios'>
            <IonTitle>메뉴</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent >
          <IonItem mode='ios' button lines='full' href='/upload'>
            <IonLabel>업로드 하기</IonLabel>
          </IonItem>
        </IonContent>
        <IonFooter>
          <IonToolbar>
            <p className='footerDescription'>
              문의 : aa187523@gmail.com<br></br>
              개발자 : ㅜㅂ랴ㅔㅍㅇ
            </p>
          </IonToolbar>
        </IonFooter>
      </IonMenu>

      <IonPage ref={page} id='main-content'>
        <IonHeader mode='ios'>
          <IonToolbar mode='ios'>
            <IonButtons slot="start">
              <IonMenuButton mode='ios'></IonMenuButton>
            </IonButtons>
            <IonTitle>포항학사 식단</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className='fullscreen'>
          <div className='dayFar'>{dayFar}</div>
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
              <IonDatetime onIonChange={handleSelectDay} mode='md' id="datetime" presentation="date"></IonDatetime>
              <br></br>
              <IonButton mode='ios' onClick={() => setShowModal(false)}>완료</IonButton>
            </div>
          </IonContent>
        </IonModal>
      </IonPage>
    </>
  );
};

export default Home;

