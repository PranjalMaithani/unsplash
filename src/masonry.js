export function previewHeight(image, imageWidth) {
    return (image.height / image.width) * imageWidth;
}

export function masonryColumns({ photosArray, numberOfColumns, columnHeight, IMAGE_WIDTH, ROW_GAP }) {
    if (!photosArray.length)
        return;

    let allColumns = Array.from(Array(numberOfColumns), () => []);

    let current = 0;
    let currentImage = photosArray[current];
    let remainingHeightBudget = Array(numberOfColumns).fill(columnHeight);
    /* eslint-disable */
    while (photosArray[current] && remainingHeightBudget.some(num => num > previewHeight(currentImage, IMAGE_WIDTH))) {
        allColumns.forEach((column, index) => {
            if (currentImage) {
                let height = previewHeight(currentImage, IMAGE_WIDTH);
                if (remainingHeightBudget[index] > height) {
                    column.push(currentImage);
                    remainingHeightBudget[index] -= (height + ROW_GAP);
                    current++;
                    currentImage = photosArray[current];
                }
            }

        });
    }
    /* eslint-enable */
    return (allColumns);
}

export default masonryColumns;