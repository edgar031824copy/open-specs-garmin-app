/**
 * Manual verification script for task 2.1
 * Run: ts-node src/scripts/test-garmin.ts
 * Set GARMIN_EMAIL and GARMIN_PASSWORD in .env first
 */
/**
 * Manual verification script for task 2.1
 * Run: ts-node src/scripts/test-garmin.ts
 * Set GARMIN_EMAIL and GARMIN_PASSWORD in .env first
 */
import "dotenv/config";
import { getActivitiesForDate } from "../lib/garmin";

const testDate = new Date();
testDate.setDate(testDate.getDate() - 2);

getActivitiesForDate(testDate)
  .then((activities) => {
    console.log(`Activities on ${testDate.toISOString().split("T")[0]}:`);
    console.log(JSON.stringify(activities, null, 2));
  })
  .catch((err) => {
    console.error("Error:", err.message);
  });
