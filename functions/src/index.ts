
import * as admin from "firebase-admin";
import {updateDailyMissions, testUpdateDailyMissions} from "./updateDailyMissions";

admin.initializeApp();

exports.updateDailyMissions = updateDailyMissions;
exports.testUpdateDailyMissions = testUpdateDailyMissions;