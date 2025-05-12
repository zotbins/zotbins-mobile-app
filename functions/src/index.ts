import * as admin from "firebase-admin";
import {updateDailyMissions, testUpdateDailyMissions} from "./updateDailyMissions";
import { resetWeeklyPoints } from "./resetWeeklyPoints";

admin.initializeApp();

exports.updateDailyMissions = updateDailyMissions;
exports.testUpdateDailyMissions = testUpdateDailyMissions;
exports.resetWeeklyPoints = resetWeeklyPoints;