import * as admin from "firebase-admin";
import {updateDailyMissions, testUpdateDailyMissions} from "./updateDailyMissions";
import {updateWeeklyMissions} from "./updateWeeklyMissions";
import { resetWeeklyPoints } from "./resetWeeklyPoints";

admin.initializeApp();

exports.updateDailyMissions = updateDailyMissions;
exports.updateWeeklyMissions = updateWeeklyMissions;
exports.testUpdateDailyMissions = testUpdateDailyMissions;
exports.resetWeeklyPoints = resetWeeklyPoints;