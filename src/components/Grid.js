import { Image } from "./Image";
import { useState, useRef, useEffect } from "react";
import { useResize } from "../utils/handlers";
import { masonryColumns } from "../utils/masonry";

export function ContainerGrid({
  photosArray,
  rowGap,
  columnGap,
  minColumns,
  maxColumns,
  screenWidths,
  imageWidths,
}) {
  const [maxImageWidth, setMaxImageWidth] = useState(
    imageWidths[imageWidths.length - 1]
  );
  const [currentImageWidth, setCurrentImageWidth] = useState(
    imageWidths[imageWidths.length - 1]
  );
  const [columns, setColumns] = useState([]);
  const [numberOfColumns, setNumberOfColumns] = useState(maxColumns);

  const gridRef = useRef();
  let screenWidth = useResize(100);

  useEffect(() => {
    //setting the number of columns and image width depending on screen width
    //screen widths = at what width of the screen does this kick in?
    //image widths = width of images corresponding to the screen widths
    for (let i = 0; i < screenWidths.length; i++) {
      if (screenWidth < screenWidths[i]) {
        setNumberOfColumns(i + 1);
        setMaxImageWidth(imageWidths[i]);
        break;
      }
      setNumberOfColumns(screenWidths.length - 1);
      setMaxImageWidth(screenWidths[screenWidths.length - 1]);
    }
  }, [screenWidth, imageWidths, screenWidths]);

  //update the columns array on getting new photos or on changing the number of columns
  useEffect(() => {
    if (photosArray.length !== 0) {
      setColumns(
        masonryColumns({
          photosArray,
          numberOfColumns,
          IMAGE_WIDTH: maxImageWidth,
          ROW_GAP: rowGap,
        })
      );
    }
  }, [photosArray, numberOfColumns, rowGap, maxImageWidth]);

  //to ensure the blurhash gets the same width/height as the image (blurhash width/height are specified rigidly by javascript only)
  useEffect(() => {
    if (gridRef.current) {
      const newWidth = gridRef.current.clientWidth / columns.length - columnGap;
      if (newWidth > maxImageWidth) {
        setCurrentImageWidth(maxImageWidth);
      } else {
        setCurrentImageWidth(newWidth); //for fullscreen = 1320/3 => 440 => 440 - 26 = 416
      }
    }
  }, [columnGap, screenWidth, columns, maxImageWidth]);

  return (
    <div className="grid" style={{ gap: columnGap }} ref={gridRef}>
      {columns.map((column, index) => {
        return (
          <div className="container" key={index}>
            {column.map((image) => {
              return (
                <Image
                  key={image.id}
                  image={image}
                  IMAGE_WIDTH={currentImageWidth}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
