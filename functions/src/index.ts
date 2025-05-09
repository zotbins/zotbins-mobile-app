
import * as admin from "firebase-admin";
import {updateDailyMissions, testUpdateDailyMissions} from "./updateDailyMissions";
import {updateWeeklyMissions, testUpdateWeeklyMissions} from "./updateWeeklyMissions";

admin.initializeApp();

exports.updateDailyMissions = updateDailyMissions;
exports.updateWeeklyMissions = updateWeeklyMissions;
exports.testUpdateDailyMissions = testUpdateDailyMissions;
exports.testUpdateWeeklyMissions = testUpdateWeeklyMissions;