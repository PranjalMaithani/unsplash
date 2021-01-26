export function resizedHeight(width, height, newWidth) {
  return (newWidth / width) * height;
}

function shortestColumnDifference(columns) {
  const min = [...columns].reduce((a, b) => Math.min(a, b));
  let shortest = columns.findIndex((val) => val === min);
  return shortest;
}

export function masonryColumns({
  photosArray,
  numberOfColumns,
  columnHeight,
  IMAGE_WIDTH,
  ROW_GAP,
}) {
  if (!photosArray.length) return;

  let allColumns = Array.from(Array(numberOfColumns), () => []);

  //keeps track of heights of columns, to add image only to the shortest column
  let HeightsArray = Array(numberOfColumns).fill(0);

  let current = 0;
  let currentImage = photosArray[current];
  let remainingHeightBudget = Array(numberOfColumns).fill(columnHeight);
  /* eslint-disable */
  while (
    photosArray[current] &&
    remainingHeightBudget.some(
      (num) =>
        num >
        resizedHeight(currentImage.width, currentImage.height, IMAGE_WIDTH)
    )
  ) {
    allColumns.forEach((column, index) => {
      if (currentImage) {
        let shortest = shortestColumnDifference(HeightsArray);
        let height = resizedHeight(
          currentImage.width,
          currentImage.height,
          IMAGE_WIDTH
        );
        if (remainingHeightBudget[index] > height && shortest === index) {
          column.push(currentImage);
          HeightsArray[index] += height;
          remainingHeightBudget[index] -= height + ROW_GAP;
          current++;
          currentImage = photosArray[current];
        }
      }
    });
  }
  /* eslint-enable */
  return allColumns;
}

export default masonryColumns;
