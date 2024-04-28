import { CronJob } from "cron";
import { getPrices } from "./services/getPrices.js";

const job = new CronJob(
  "*/15 * * * *", // cronTime every minute 15 of each hour
  async () => {
    await getPrices();
  }, // onTick
  () => {
    console.log("cron comple at " + new Date().toDateString());
  }, // onComplete
  true, // start
);
