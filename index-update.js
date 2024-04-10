import { getJsonFile } from './extract.js';
import { partialUpdate } from './load.js';
import { categoriesArrayToLevels } from './transform.js';
import { bayesianAverage } from './bayesian.js';

const BAYSIAN_M = 4.5;
const BAYSIAN_C = 20; // Low confidence

function transformItem(i) {
   const categoriesCrawl = categoriesArrayToLevels(i.breadcrumb);
   const bA = Math.round(bayesianAverage(i.scoreReviews, i.scoreStars, BAYSIAN_M, BAYSIAN_C) * 4) / 4; // O.25 increment

   return {
      objectID: i.internalId,
      urlCrawl: i.url,
      categoriesCrawl,
      scoreStars: i.scoreStars,
      scoreReviews: i.scoreReviews,
      bayesianAverage: bA,
      flatCategoryCrawl: i.flatCategory,
      breadcrumb: i.breadcrumb,
      titleCrawl: i.title,
      imageCrawl: i.image,
      priceCrawl: i.price,
      currencyCrawl: i.currency,
   };
}

const indexUpdate = async () => {
   try {
      const file = 'sources/crawler_Son_Video_Products.json'
      // EXTRACT 
      const items = await getJsonFile(file);

      // Compute BAYSIAN_M
      // let sum = 0;
      // let nb = 0;
      // items.map(i => {
      //    if (i.scoreStars && i.scoreReviews) {
      //       sum += i.scoreStars;
      //       nb++;
      //    }
      // })
      // return (sum/nb);

      // TRANSFORM
      const results = await items.map(i => transformItem(i));

      //TO DO: LOAD
      await partialUpdate(results);


   } catch (error) {
      console.error(error);
   }
};

indexUpdate();
