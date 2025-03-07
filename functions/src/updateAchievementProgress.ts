// Takes in an action type ie. mission, scan, points, level, quiz
// Increments by the value passed in
// Checks if the user has completed the enough actions to mark achievement as complete through userStatus
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { handleRewards } from "./handleRewards";

export const updateAchievementProgress = async (actionType: string, value: number) => {
    const user = auth().currentUser;
    if (user) {
        const userAchievementsRef = firestore().collection("users").doc(user.uid).collection("achievements");
        const achievementsSnapshot = await userAchievementsRef.get();

        const batch = firestore().batch();
        achievementsSnapshot.forEach((doc) => {
            const data = doc.data();
            const userAchievementRef = userAchievementsRef.doc(doc.id);
            const actionAmount = data.actionAmount;
            const progress = data.progress;
            const userStatus = data.userStatus;

            if (actionType === data.actionType && !userStatus) {
                const newProgress = progress + value;
                if (newProgress >= actionAmount && !userStatus) {
                    batch.update(userAchievementRef, { progress: newProgress, userStatus: true });
                    handleRewards(user.uid, data.rewardAmount, data.rewardType);
                } else {
                    batch.update(userAchievementRef, { progress: newProgress });
                }
            }
        })
        await batch.commit();
    };
}