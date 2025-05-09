import * as admin from 'firebase-admin';
import { onSchedule } from "firebase-functions/v2/scheduler";

const updateDailyMissionsLogic = async () => {
    const db = admin.firestore();
    try {
        // get all missions with type "daily"
        const missions = await db.collection("missions").where("type", "==", "daily").get();

        if (missions.empty) {
            console.log("No daily missions found.");
            return;
        }

        const batch = db.batch();
        // set all missions to have status false
        missions.forEach((mission: any) => {
            batch.update(mission.ref, { status: false });
        });

        // choose 3 random daily missions to make active
        const missionNames: string[] = [];
        const randomMissions = missions.docs.sort(() => Math.random() - 0.5).slice(0, 3);
        randomMissions.forEach((mission: any) => {
            batch.update(mission.ref, { status: true });
            missionNames.push(mission.data().title);
        });
        await batch.commit();
        
        console.log("Daily missions updated");
        console.log("Active daily missions: ", missionNames);
    } catch (error) {
        console.error("Error updating daily missions: ", error);
    }
    return;
};

export const updateDailyMissions = onSchedule(
  {
    schedule: '0 0 * * *',    // every day at midnight UTC
    timeZone: 'America/Los_Angeles',
    region:   'us-west1',
  },
  updateDailyMissionsLogic
);
