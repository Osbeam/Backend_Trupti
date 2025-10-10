const cron = require("node-cron");
const moment = require("moment-timezone");
const LogUser = require("../model/loguserSchema"); // Adjust path



// Runs every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  try {
    console.log("Running auto checkout cron job...");

    // Find users who have checked in but not checked out
    const pendingCheckouts = await LogUser.find({
      outTime: null,
    });
    
    for (const log of pendingCheckouts) {
      const inTime = moment.tz(log.inTime, "YYYY-MM-DD HH:mm:ss", "Asia/Kolkata");
      const currentTime = moment().tz("Asia/Kolkata");

      const hoursDiff = currentTime.diff(inTime, "hours", true);

      // If 9 hours or more passed, auto checkout
      if (hoursDiff >= 9) {
        const outTime = inTime.clone().add(9, "hours");
        const totalDuration = moment.duration(outTime.diff(inTime));
        const totalHours = `${Math.floor(totalDuration.asHours())}h ${totalDuration.minutes()}m`;

        await LogUser.findByIdAndUpdate(log._id, {
          outTime: outTime.format("YYYY-MM-DD HH:mm:ss"),
          totalHours,
        });

        console.log(`User ${log.userId} auto-checked out at ${outTime.format("YYYY-MM-DD HH:mm:ss")}`);
      }
    }
  } catch (error) {
    console.error("Cron job error:", error);
  }
});

