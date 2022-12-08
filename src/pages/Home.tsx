import { DatetimeChangeEventDetail, IonButton, IonContent, IonDatetime, IonFooter, IonHeader, IonItem, IonLabel, IonMenu, IonMenuToggle, IonModal, IonPage, IonRippleEffect, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { Meal } from '../components/Meal';
import { PopularMeal } from '../components/PopularMeal';
import { MealStoreType } from '../model/store';
import { getDayMeal } from '../service/meal.service';
import { useMealStore } from '../store/store';
import { dayDiffFromToday, nextDayFromyyyyMMdd, prevDayFromyyyyMMdd, todayyyyyMMdd, yyyyMMddToDate } from '../util/day';
import { dayToKorean } from '../util/dayToKorean';
import { dayDiffToKorean } from '../util/dayDiffToKorean';
import { useErrorPresent } from '../hooks/useErrorPresent';
import './Home.scss';

const Home: React.FC = () => {


  // 🪝 Hooks

  const page = useRef(undefined);
  const [dayFar, setDayFar] = useState<string>('오늘');
  const [presentingElement, setPresentingElement] = useState<HTMLElement | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);

  const { meals, getGlobalDayMeal: getMeal } = useMealStore();

  const { nowDay, setNowDay } = useMealStore()

  const [presentError, dismissPresent] = useErrorPresent()

  // 🔄 Life Cycle

  useEffect(() => {
    setPresentingElement(page.current);
  }, [page.current])

  useEffect(() => {
    getMeal(nowDay);
  }, [])

  useEffect(() => {
    setDayFar(dayDiffToKorean(dayDiffFromToday(nowDay)))
  }, [nowDay])


  // ✋ Handlers

  const isMealExist = (day: string) => {
    return Object.keys(meals).includes(day)
  }

  const goNextOrPrev = async (nextOrPrev: 'next' | 'prev') => {
    const goDay = nextOrPrev === 'next' ? nextDayFromyyyyMMdd(nowDay) : prevDayFromyyyyMMdd(nowDay)
    if (!isMealExist(goDay)) {
      try {
        const goDayMeal = await getDayMeal(goDay);
        const goDaySet = goDayMeal ? goDayMeal : null;
        useMealStore.setState((state: MealStoreType) => { return { meals: { ...state.meals, [goDay]: goDaySet } } })
      } catch (e) {
        console.error(e)
        presentError('오류', '다른 날짜 정보를 불러오는데 문제가 발생했습니다. 잠시 후 다시 시도해주세요.')
      }
    }
    setNowDay(goDay)
  }

  const handleSelectDay = (e: CustomEvent<DatetimeChangeEventDetail>) => {
    const selectedDay = e.detail.value;
    if (selectedDay) {
      const wow = selectedDay as string;
      const yyyyMMdd = wow.slice(0, 10).replace(/-/g, '');
      setNowDay(yyyyMMdd);
      getMeal(yyyyMMdd);
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
            <h1 className='dayKorean'>{dayToKorean(nowDay)}</h1>
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
          {<Meal value={meals[nowDay]} />}
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

