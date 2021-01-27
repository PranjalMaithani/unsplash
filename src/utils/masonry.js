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
  IMAGE_WIDTH,
  ROW_GAP,
}) {
  if (!photosArray.length) return;

  let allColumns = Array.from(Array(numberOfColumns), () => []);

  //keeps track of heights of columns, to add image only to the shortest column
  let HeightsArray = Array(numberOfColumns).fill(0);

  let current = 0;
  let currentImage = photosArray[current];
  /* eslint-disable */
  while (photosArray[current]) {
    allColumns.forEach((column, index) => {
      if (currentImage) {
        let shortest = shortestColumnDifference(HeightsArray);
        let height = resizedHeight(
          currentImage.width,
          currentImage.height,
          IMAGE_WIDTH
        );
        if (shortest === index) {
          column.push(currentImage);
          HeightsArray[index] += height;
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
