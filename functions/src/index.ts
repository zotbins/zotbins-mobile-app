
const admin = require("firebase-admin");
const updateDailyMissions = require("./updateDailyMissions");

admin.initializeApp();

exports.updateDailyMissions = updateDailyMissions;