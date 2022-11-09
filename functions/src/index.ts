import * as functions from "firebase-functions";
import { rankScheduleFunc } from "./rankSchedule";

export const everyHourRankSchedule = functions
    .region('asia-northeast3')
    .pubsub.schedule('every 1 hours')
    .timeZone("Asia/Seoul").onRun(async () => {
        try {
            await rankScheduleFunc();
        } catch (e) {
            console.error(e)
        }
    })

export const rankRun = functions
    .region('asia-northeast3')
    .https.onCall(async () => {
        await rankScheduleFunc()
    })
