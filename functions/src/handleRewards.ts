import firestore from "@react-native-firebase/firestore";
import { updateAchievementProgress } from "./updateAchievementProgress";

// badges could also be a reward but have not been implemented yet
export const handleRewards = async (uid: string, rewardAmount: number, rewardType: string) => {
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
                updateAchievementProgress("level", 1);
            } else {
                userRef.update({
                    xp: firestore.FieldValue.increment(rewardAmount)
                });
            }
            break;
        case "points":
            await userRef.update({ totalPoints: totalPoints + rewardAmount });
            break;
        default:
            console.error("Invalid reward type");
    }
}