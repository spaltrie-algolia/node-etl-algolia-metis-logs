const bayesianAverage = (product_ratings_count, product_ratings_average, m, C) => {
   return (product_ratings_count * product_ratings_average + m * C) / (product_ratings_count + C)
}

export { bayesianAverage }; 