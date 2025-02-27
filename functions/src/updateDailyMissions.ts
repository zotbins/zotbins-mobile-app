const functions = require("firebase-functions");
const admin = require("firebase-admin");

exports.updateDailyMissions = functions.pubsub.schedule("every day 00:00").onRun(async () => {
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
    activeMissions.forEach((mission: any)  => {
        const missionRef = db.collection("missions").doc(mission.id);
        updatedDocIds.push(mission.id);
        batch.update(missionRef, { status: true });
    });
    await batch.commit();

    console.log("Daily missions updated");
    console.log("Updated missions IDs: ", updatedDocIds);
    return null;
}
);