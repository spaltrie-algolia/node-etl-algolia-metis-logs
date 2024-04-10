//const fs = require('fs');
import fs from 'fs'
//let csvToJson = require('convert-csv-to-json');
import csvToJson from 'convert-csv-to-json';

async function getJsonFile(jsonFile) {
   const rawdata = await fs.readFileSync(jsonFile);
   return JSON.parse(rawdata);
}

async function getCsvFile(csvFile) {
   let json = csvToJson
      .supportQuotedField(true)
      .fieldDelimiter(',')
      .getJsonFromCsv(csvFile);
   return json;
}

//module.exports = { getJsonFile };
export { getJsonFile, getCsvFile }; 