// Takes in an action type ie. mission, scan, points, level, quiz
// Increments by the value passed in
// Checks if the user has completed the enough actions to mark achievement as complete through userStatus
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc, writeBatch, increment, Timestamp } from "@react-native-firebase/firestore";
import { getAuth } from "@react-native-firebase/auth";

export const updateAchievementProgress = async (actionType: string, increment: number) => {
    const user = getAuth().currentUser;
    if (user) {
        const db = getFirestore();
        const userAchievementsRef = collection(db, "users", user.uid, "achievements");
        const achievementsSnapshot = await getDocs(userAchievementsRef);

        const batch = writeBatch(db);

        const promises = achievementsSnapshot.docs.map(async (docSnapshot) => {
            const data = docSnapshot.data();
            const userAchievementRef = doc(db, "users", user.uid, "achievements", docSnapshot.id);
            const { actionAmount, progress, userStatus, rewardAmount, rewardType } = data;

            if (actionType === data.actionType && !userStatus) {
                const newProgress = progress + increment;
                if (newProgress >= actionAmount) {
                    batch.update(userAchievementRef, { progress: actionAmount, userStatus: true, dateAchieved: Timestamp.now() });
                    await handleRewards(user.uid, rewardAmount, rewardType);
                } else {
                    batch.update(userAchievementRef, { progress: newProgress });
                }
            }
        })
        await Promise.all(promises);
        await batch.commit();
    };
}

export const updateMissionProgress = async (actionType: string, increment: number) => {
    const user = getAuth().currentUser;
    if (user) {
        const db = getFirestore();
        const userMissionsRef = collection(db, "users", user.uid, "missions");
        const missionsSnapshot = await getDocs(userMissionsRef);

        const batch = writeBatch(db);

        const promises = missionsSnapshot.docs.map(async (docSnapshot) => {
            const data = docSnapshot.data();
            const userMissionRef = doc(db, "users", user.uid, "missions", docSnapshot.id);
            const { actionAmount, progress, userStatus, rewardAmount, rewardType } = data;

            if (actionType === data.actionType && !userStatus) {
                const newProgress = progress + increment;
                if (newProgress >= actionAmount) {
                    batch.update(userMissionRef, { progress: actionAmount, userStatus: true });
                    await handleRewards(user.uid, rewardAmount, rewardType);
                    await updateAchievementProgress("mission", 1);
                } else {
                    batch.update(userMissionRef, { progress: newProgress });
                }
            }
        })
        await Promise.all(promises);
        await batch.commit();
    };
}

const handleRewards = async (uid: string, rewardAmount: number, rewardType: string) => {
    const db = getFirestore();
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    if (!userData) return;
    const { xp, level } = userData;
    switch (rewardType) {
        case "XP":
            const currentXP = xp || 0;
            const currentLevel = level || 1;
            const requiredXPforNextLevel = 50 * (currentLevel);
            const newXP = currentXP + rewardAmount;
            if (newXP >= requiredXPforNextLevel) {
                const updateXP = newXP - requiredXPforNextLevel;
                updateDoc(userRef, {
                    xp: updateXP,
                    level: increment(1),
                });
                await updateAchievementProgress("level", 1);
            } else if (newXP < requiredXPforNextLevel) {
                updateDoc(userRef, {
                    xp: increment(rewardAmount)
                });
            }
            break;
        case "points":
            await updateDoc(userRef, {
                totalPoints: increment(rewardAmount),
            });
            await updateAchievementProgress("points", rewardAmount);
            await updateMissionProgress("points", rewardAmount);
            break;
        default:
            console.error("Invalid reward type");
    }
}