import { DatetimeChangeEventDetail, IonButton, IonContent, IonDatetime, IonFooter, IonHeader, IonItem, IonLabel, IonMenu, IonMenuToggle, IonModal, IonPage, IonRippleEffect, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { Meal } from '../components/Meal';
import { PopularMeal } from '../components/PopularMeal';
import { MealStoreType } from '../model/store';
import { getDayMeal } from '../service/meal.service';
import { useMealStore } from '../store/store';
import { nextDayFromyyyyMMdd, prevDayFromyyyyMMdd, todayyyyyMMdd, yyyyMMddToDate } from '../util/day';
import { dayToKorean } from '../util/dayToKorean';
import './Home.scss';

const Home: React.FC = () => {


  // 🪝 Hooks

  const page = useRef(undefined);
  const [day, setDay] = useState<string>(todayyyyyMMdd);
  const [dayFar, setDayFar] = useState<string>('오늘');
  const [presentingElement, setPresentingElement] = useState<HTMLElement | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);

  const { meals, getGlobalDayMeal } = useMealStore();

  
  // 🔄 Life Cycle

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


  // ✋ Handlers

  const isMealExist = (day: string) => {
    return Object.keys(meals).includes(day)
  }

  const goNextOrPrev = async (nextOrPrev: 'next' | 'prev') => {
    const goDay = nextOrPrev === 'next' ? nextDayFromyyyyMMdd(day) : prevDayFromyyyyMMdd(day)
    if (!isMealExist(goDay)) {
      const goDayMeal = await getDayMeal(goDay);
      if (goDayMeal) {
        useMealStore.setState((state: MealStoreType) => { return { meals: { ...state.meals, [goDay]: goDayMeal } } })
      } else {
        useMealStore.setState((state: MealStoreType) => { return { meals: { ...state.meals, [goDay]: null } } })
      }
    }
    setDay(goDay)
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
      <IonMenu contentId="main-content" >
        <h1>메뉴</h1>
        <IonContent >
          <IonItem mode='ios' button lines='full' href='/upload'>
            <IonLabel>업로드 하기</IonLabel>
          </IonItem>
          <IonItem mode='ios' button lines='full' href='https://github.com/uiojkl-123/pohang-domitory-meal'>
            <IonLabel>Github 깃헙</IonLabel>
          </IonItem>
        </IonContent>
        <IonFooter>
          <IonToolbar>
            <p className='footerDescription'>
              문의 : aa187523@gmail.com<br />
              밥사주기 : 010-9364-1875<br />
              라이선스: MIT
            </p>
          </IonToolbar>
        </IonFooter>
      </IonMenu>

      <IonPage ref={page} id='main-content'>
        <div className="header">
          <IonMenuToggle className='menuToggle'>
            <img src="assets/menu-button.svg" alt="menuButton" />
          </IonMenuToggle>
          포항학사 식단
        </div>
        <div className='container'>
          <div className='day'>
            <h1 className='dayFar'>{dayFar}</h1>
            <h1 className='dayKorean'>{dayToKorean(day)}</h1>
          </div>

          <div className='toolbar'>
            <div className="toolbarContainer ripple-parent">

              <div className="buttons">
                <div className='leftButton ion-activatable ' onClick={async () => goNextOrPrev('prev')}>
                  <img src='assets/leftArrow.svg' />
                  <IonRippleEffect></IonRippleEffect>
                </div>

                <div className='daySelectButton ion-activatable' onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}>
                  <img src="assets/calendar-outline 1.svg" alt="calendar" />
                </div>

                <div className='rightButton ion-activatable ' onClick={async () => goNextOrPrev('next')}>
                  <img src='assets/rightArrow.svg' />
                  <IonRippleEffect></IonRippleEffect>
                </div>
              </div>
            </div>
          </div>
          {<Meal value={meals[day]} />}
          <PopularMeal />
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

