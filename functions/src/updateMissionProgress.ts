// Takes in an action type ie. scan, quiz
// Increments by the value passed in
// Checks if the user has completed the enough actions to mark achievement as complete through userStatus
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { updateAchievementProgress } from "./updateAchievementProgress";

export const updateMissionProgress = async (actionType: string, increment: number) => {
    const user = auth().currentUser;
    if (user) {
        const userMissionsRef = firestore().collection("users").doc(user.uid).collection("missions");
        const missionsSnapshot = await userMissionsRef.get();

        const batch = firestore().batch();
        missionsSnapshot.forEach(async (doc) => {
            const data = doc.data();
            const userMissionRef = userMissionsRef.doc(doc.id);
            const actionAmount = data.actionAmount;
            const progress: number = data.progress;
            const userStatus = data.userStatus;

            if (actionType === data.actionType && !userStatus) {
                const newProgress = progress + increment;
                if (newProgress >= actionAmount && !userStatus) {
                    batch.update(userMissionRef, { progress: actionAmount, userStatus: true });
                    await handleRewards(user.uid, data.rewardAmount, data.rewardType);
                    await updateAchievementProgress("mission", 1);
                } else {
                    batch.update(userMissionRef, { progress: newProgress });
                }
            }
        })
        await batch.commit();
    };
}

const handleRewards = async (uid: string, rewardAmount: number, rewardType: string) => {
    const userRef = firestore().collection("users").doc(uid);
    const userDoc = await userRef.get();
    const userData = userDoc.data();
    if (!userData) return;
    const { xp, totalPoints, level } = userData;
    switch (rewardType) {
        case "XP":
            const currentXP = xp || 0;
            const currentLevel = level || 1;
            const requiredXPforNextLevel = 50 * (currentLevel);
            const newXP = currentXP + rewardAmount;
            if (newXP >= requiredXPforNextLevel) {
                const updateXP = newXP - requiredXPforNextLevel;
                userRef.update({
                    xp: updateXP,
                    level: firestore.FieldValue.increment(1),
                });
                await updateAchievementProgress("level", 1);
            } else if (newXP < requiredXPforNextLevel) {
                userRef.update({
                    xp: firestore.FieldValue.increment(rewardAmount)
                });
            }
            break;
        case "points":
            await userRef.update({ totalPoints: totalPoints + rewardAmount });
            await updateAchievementProgress("points", rewardAmount);
            await updateMissionProgress("points", rewardAmount);
            break;
        default:
            console.error("Invalid reward type");
    }
}