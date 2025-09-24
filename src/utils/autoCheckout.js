const cron = require('node-cron');
const moment = require('moment-timezone');
const LogUser = require('../model/loguserSchema'); // adjust the path as needed

// Run every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  try {
    console.log("Running auto-checkout job...");

    // Get current time in Asia/Kolkata timezone
    const currentTime = moment().tz("Asia/Kolkata");

    // Find users with inTime set and no outTime
    const pendingLogs = await LogUser.find({
      inTime: { $ne: null },
      outTime: null
    });

    for (const log of pendingLogs) {
      const inTimeMoment = moment.tz(log.inTime, "YYYY-MM-DD HH:mm:ss", "Asia/Kolkata");

      const diffInHours = currentTime.diff(inTimeMoment, 'hours', true);

      if (diffInHours >= 9) {
        const totalHours = diffInHours.toFixed(2);

        // Auto-checkout the user
        log.outTime = currentTime.format('YYYY-MM-DD HH:mm:ss');
        log.totalHours = totalHours;
        await log.save();

        console.log(`User ${log.userId} auto-checked out after ${totalHours} hrs`);
      }
    }
  } catch (error) {
    console.error("Auto-checkout failed:", error.message);
  }
});
