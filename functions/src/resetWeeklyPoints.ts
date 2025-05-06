import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

// Function to reset weekly points
export const resetWeeklyPoints = functions.pubsub
  .schedule("every sunday 00:00") // Reset weekly points every Sunday at midnight LA time
  .timeZone("America/Los_Angeles")
  .onRun(async (context) => {
    // Get all user documents and create a batch
    const userRef = admin.firestore().collection("users");
    const snapshot = await userRef.get();
    const batch = admin.firestore().batch();

    // Reset weekly points for each user
    snapshot.forEach((doc) => {
      batch.update(doc.ref, { weeklyPoints: 0 });
    });

    // Once all updates are prepared, commit the batch
    await batch.commit(); 
    console.log("Weekly points reset for all users");
  });
