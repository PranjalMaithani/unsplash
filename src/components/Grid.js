import { Image } from "./Image";
import { useState, useRef, useEffect } from "react";
import { useResize } from "../utils/handlers";

export function ContainerGrid({ currentArray, maxImageWidth, gridGap }) {
  const [currentWidth, setCurrentWidth] = useState(maxImageWidth);
  const gridRef = useRef();
  let screenWidth = useResize(100);

  useEffect(() => {
    if (gridRef.current) {
      const newWidth =
        gridRef.current.clientWidth / currentArray.length - gridGap;
      if (newWidth > maxImageWidth) {
        setCurrentWidth(maxImageWidth);
      } else {
        setCurrentWidth(newWidth); //for fullscreen = 1320/3 => 440 => 440 - 26 = 416
      }
    }
  }, [gridGap, screenWidth, currentArray, maxImageWidth]);

  return (
    <div className="grid" style={{ gap: gridGap }} ref={gridRef}>
      {currentArray.map((column, index) => {
        return (
          <div className="container" key={index}>
            {column.map((image) => {
              return (
                <Image
                  key={image.id}
                  image={image}
                  IMAGE_WIDTH={currentWidth}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
