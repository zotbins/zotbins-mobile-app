import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

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
    return null;
};


export const updateDailyMissions = functions.pubsub.schedule("every day 00:00").onRun(updateDailyMissionsLogic);

// HTTP function to test daily missions update
export const testUpdateDailyMissions = functions.https.onRequest(async (req, res) => {
    await updateDailyMissionsLogic();
    res.send("Daily missions updated");
});