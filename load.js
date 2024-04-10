import writeXlsxFile from 'write-excel-file/node';
import dotenv from 'dotenv';

dotenv.config();

async function writeXlsx(map) {
   console.log(map);

   const schema = [
      {
         column: 'appID',
         type: String,
         value: item => item.appID
      },
      {
         column: 'Event Date (15min)',
         type: Date,
         format: 'dd-mmm-yyyy HH:mm:ss',
         value: item => item.eventDateBucket15Min
      },
      {
         column: 'Pending Age (Hours)',
         type: Number,
         format: '#,##0.0',
         value: item => item.durationInHours
      }
   ];

   const objects = [];
   for (const appID in map) {
      for (const eventDateBucket15Min in map[appID]) {
         const durationInSec = map[appID][eventDateBucket15Min]
         objects.push({
            'appID': appID,
            'eventDateBucket15Min': new Date(eventDateBucket15Min),
            'durationInHours': (Math.round(durationInSec / 3600 * 10) / 10)
         });
      }
   }

   await writeXlsxFile(objects, {
      schema,
      filePath: './results/results.xlsx'
   })
}

export { writeXlsx }; 