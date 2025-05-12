
import * as admin from "firebase-admin";
import {updateDailyMissions} from "./updateDailyMissions";
import {updateWeeklyMissions} from "./updateWeeklyMissions";

admin.initializeApp();

exports.updateDailyMissions = updateDailyMissions;
exports.updateWeeklyMissions = updateWeeklyMissions;
