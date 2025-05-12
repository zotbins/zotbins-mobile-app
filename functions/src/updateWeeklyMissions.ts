import { onSchedule } from "firebase-functions/v2/scheduler";

import * as admin from 'firebase-admin';

const updateWeeklyMissionsLogic = async () => {
    const db = admin.firestore();
    try {
        // get all missions with type "weekly"
        const missions = await db.collection("missions").where("type", "==", "weekly").get();

        if (missions.empty) {
            console.log("No weekly missions found.");
            return;
        }

        const batch = db.batch();
        // set all missions to have status false
        missions.forEach((mission: any) => {
            batch.update(mission.ref, { status: false });
        });

        // choose 3 random weekly missions to make active
        const missionNames: string[] = [];
        const randomMissions = missions.docs.sort(() => Math.random() - 0.5).slice(0, 3);
        randomMissions.forEach((mission: any) => {
            batch.update(mission.ref, { status: true });
            missionNames.push(mission.data().title);
        });
        await batch.commit();

        console.log("Weekly missions updated");
        console.log("Active weekly missions: ", missionNames);
    } catch (error) {
        console.error("Error updating weekly missions: ", error);
    }
    return;
};

export const updateWeeklyMissions = onSchedule(
  {
    schedule: '0 0 * * 1',    // every Monday at midnight UTC
    timeZone: 'America/Los_Angeles',
    region:   'us-west1',
  },
  updateWeeklyMissionsLogic
);

