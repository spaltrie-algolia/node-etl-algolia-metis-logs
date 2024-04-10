
import { getCsvFile } from './extract.js';
import { transformItem } from './transform.js';
import { writeXlsx } from './load.js'
const spacePad = (num, places) => String(num).padStart(places, ' ')

const FILES = [
   './sources/extract-2024-04-04T17_59_53.297Z.csv',
];

const orchestrateEtlPipeline = async () => {
   try {

      let objectIDs = new Map(); // HashMap to identify SKU non unique across files

      // Reset the index
      //await clearIndex();

      let file = FILES[0];
      // EXTRACT 
      const items = await getCsvFile(file);

      // TRANSFORM
      const results = items.map(v => transformItem(v));

      let minDate, maxDate;

      let map = {};
      let appIDs = new Set();

      // Build Set: per AppId
      results.map(item => {
         if (!item.appID) return;
         const eventDateBucket15MinS = item.eventDateBucket15Min.toISOString();
         if (!minDate || minDate > item.eventDateBucket15Min) {
            minDate = item.eventDateBucket15Min;
         }
         if (!maxDate || maxDate <= item.eventDateBucket15Min) {
            maxDate = item.eventDateBucket15Min;
         }
         appIDs.add(item.appID);
         if (!map[item.appID]) {
            map[item.appID] = {}
         }
         // if (!map[item.appID][item.jobID]) {
         //    map[item.appID][item.jobID] = {}
         // }
         // if (!map[item.appID][item.jobID][eventDateBucket15MinS]) {
         //    map[item.appID][item.jobID][eventDateBucket15MinS] = item.durationInSec;
         // }
         // if (map[item.appID][item.jobID][eventDateBucket15MinS] > item.durationInSec) {
         //    map[item.appID][item.jobID][eventDateBucket15MinS] = item.durationInSec;
         // }
         if (!map[item.appID][eventDateBucket15MinS]) {
            map[item.appID][eventDateBucket15MinS] = item.durationInSec;
         }
         if (map[item.appID][eventDateBucket15MinS] > item.durationInSec) {
            map[item.appID][eventDateBucket15MinS] = item.durationInSec;
         }

      });
      console.log(map)

      // Build the Timeline
      for (let t = minDate; t < maxDate; t = new Date(t.getTime() + 15 * 60 * 1000)) { // Step of 15 mins
         const tS = t.toISOString();
         for (let a of appIDs) {
            if (!map[a][tS]) map[a][tS] = 0;
         }
      }
      console.log(map)
      writeXlsx(map);

   } catch (error) {
      console.error(error);
   }
};

orchestrateEtlPipeline();