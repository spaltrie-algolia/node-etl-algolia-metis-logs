
function categoriesArrayToLevels(array) {
   return array.reduce(function (acc, cur, i) {
      if (i > 0) {
         cur = acc['lvl' + (i - 1)] + ' > ' + cur;
      }
      acc['lvl' + i] = cur;
      return acc;
   }, {});
}

const pathCategoriesToLevels = (pathCategories) => {
   if (!pathCategories) return null;

   const array = pathCategories.split(' > ');


   const objLevels = categoriesArrayToLevels(array);

   return objLevels;
}

function transformItem(item) {
   item['createdAt'] = new Date(item['@attributes.createdAt'] ? item['@attributes.createdAt'].replaceAll('"', '') : '');
   delete item['@attributes.createdAt'];
   item['eventDate'] = new Date(item['Date'] ? item['Date'].replaceAll('"', '') : '');
   delete item['Date'];
   item['planID'] = item['@attributes.planID'];
   delete item['@attributes.planID'];
   item['shardID'] = item['@attributes.shardID'] ? item['@attributes.shardID'].replaceAll('"', '') : '';
   delete item['@attributes.shardID'];
   item['shardType'] = item['@attributes.shardType'] ? item['@attributes.shardType'].replaceAll('"', '') : '';
   delete item['@attributes.shardType'];
   item['appID'] = item['attributes.appID'] ? item['attributes.appID'].replaceAll('"', '') : '';
   delete item['attributes.appID'];
   item['indexName'] = item['attributes.indexName'] ? item['attributes.indexName'].replaceAll('"', '') : '';
   delete item['attributes.indexName'];
   item['jobID'] = item['attributes.jobID'];
   delete item['attributes.jobID'];
   item['message'] = item['Message'];
   delete item['Message'];
   item['durationFromMessage'] = item['message'].replace('oldest pending job is ', '');
   item['durationInSec'] = Math.round((item['eventDate'].getTime() - item['createdAt'].getTime()) / 1000);
   item['attributes'] = JSON.parse(item['attributes']).attributes;

   const p = 15 * 60 * 1000; // Round a date to the nearest 15min Bucket
   item['eventDateBucket15Min'] = new Date(Math.round(item['eventDate'].getTime() / p) * p);

   return item;
}

export { transformItem, categoriesArrayToLevels }; 