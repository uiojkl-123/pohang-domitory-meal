import { firestore } from "firebase-admin";
import { currentMonth, nextMonth } from "./dayUtils";
import { db } from "./firebase";

export const rankScheduleFunc = async () => {
    const mealsCollection = await db.collection('meals')
        .where(firestore.FieldPath.documentId(), '>=', currentMonth)
        .where(firestore.FieldPath.documentId(), '<', nextMonth)
        .get();

    let breakfastLikeRank: { breakfast: string, like: number }[] = [];
    let dinnerLikeRank: { dinner: string, like: number }[] = [];

    console.log('mealsCollection', mealsCollection.docs);


    await Promise.all(mealsCollection.docs.map(async (mealDoc) => {

        const meal = mealDoc.data() as { breakfast: string[] | undefined, dinner: string[] | undefined };

        console.log('meal', meal);

        if (!meal.breakfast) { return; }
        if (!meal.dinner) { return; }


        const mealId = mealDoc.id;
        const mealRef = db.collection('meals').doc(mealId);

        const breakfastLikeCollection = await mealRef.collection('breakfastLike').get();
        const dinnerLikeCollection = await mealRef.collection('dinnerLike').get();

        const breakfastLike = breakfastLikeCollection.docs.map((doc) => doc.data().like);
        const dinnerLike = dinnerLikeCollection.docs.map((doc) => doc.data().like);

        console.log('breakfastLike', breakfastLike);
        console.log('dinnerLike', dinnerLike);

        const breakfastIndexes = breakfastLike.map((like) => {
            return like.at(-1)
        })

        const dinnerIndexes = dinnerLike.map((like) => {
            return like.at(-1)
        })
        console.log('breakfastIndexes', breakfastIndexes);
        console.log('dinnerIndexes', dinnerIndexes);

        const breakfastLikes = meal.breakfast.map((breakfast, index) => {
            return {
                breakfast,
                like: breakfastIndexes.filter((breakfastIndex) => breakfastIndex === String(index)).length
            }
        })


        const dinnerLikes = meal.dinner.map((dinner, index) => {
            return {
                dinner,
                like: dinnerIndexes.filter((dinnerIndex) => dinnerIndex === String(index)).length
            }
        })

        console.log('breakfastLikes', breakfastLikes);
        console.log('dinnerLikes', dinnerLikes);

        const breakfastRank = breakfastLikes.sort((a, b) => b.like - a.like);
        const dinnerRank = dinnerLikes.sort((a, b) => b.like - a.like);

        breakfastLikeRank = breakfastLikeRank.concat(breakfastRank);
        dinnerLikeRank = dinnerLikeRank.concat(dinnerRank);
    }))

    const breakfastRank = breakfastLikeRank.sort((a, b) => b.like - a.like);
    const dinnerRank = dinnerLikeRank.sort((a, b) => b.like - a.like);

    await db.collection('rank').doc(currentMonth).set({
        breakfast: breakfastRank.map((rank) => rank).slice(0, 3),
    }, { merge: true })



    await db.collection('rank').doc(currentMonth).set({
        dinner: dinnerRank.map((rank) => rank).slice(0, 3),
    }, { merge: true })
}