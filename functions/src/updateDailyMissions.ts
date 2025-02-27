import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

admin.initializeApp();

const updateDailyMissionsLogic = async () => {
    const db = admin.firestore();
    // get all missions with type "daily" and status is active
    const missions = await db.collection("missions").where("type", "==", "daily").where("status", "==", true).get();
    const batch = db.batch();
    // set all missions to have status false
    missions.forEach((mission: any) => {
        batch.update(mission.ref, { status: false });
    });

    const updatedDocIds: string[] = [];
    // choose 3 random daily missions to make active
    const dailyMissions = missions.docs.map((mission: any) => mission.data());
    const activeMissions = dailyMissions.sort(() => 0.5 - Math.random()).slice(0, 3);
    activeMissions.forEach((mission: any) => {
        const missionRef = db.collection("missions").doc(mission.id);
        updatedDocIds.push(mission.id);
        batch.update(missionRef, { status: true });
    });
    await batch.commit();

    console.log("Daily missions updated");
    console.log("Updated missions IDs: ", updatedDocIds);
    return null;
};

export const updateDailyMissions = functions.pubsub.schedule("every day 00:00").onRun(updateDailyMissionsLogic);

// HTTP function to test daily missions update
export const testUpdateDailyMissions = functions.https.onRequest(async (req, res) => {
    await updateDailyMissionsLogic();
    res.send("Daily missions updated");
});