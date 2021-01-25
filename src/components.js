import { useImageLazyLoad } from "./utils";
import { resizedHeight } from "./masonry.js";
import { Blurhash } from "react-blurhash";
import { useState, useRef, useEffect } from "react";
import { useResize } from "./utils/handlers";

export function Image({ obj, IMAGE_WIDTH }) {
  const [isVisible, imageRef] = useImageLazyLoad();
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className="image"
      ref={imageRef}
      height={resizedHeight(obj.width, obj.height, IMAGE_WIDTH)}
    >
      {isVisible && (
        <img
          src={obj.urls.regular}
          className="unsplashImage"
          style={{ maxWidth: IMAGE_WIDTH }}
          alt={obj["alt_description"]}
          onLoad={() => {
            setIsLoaded(true);
          }}
        />
      )}
      {(!isLoaded || !isVisible) && (
        <Blurhash
          alt={obj["alt_description"]}
          hash={obj.blur_hash}
          className="unsplashImage blurHash"
          style={{ width: "100%", maxWidth: IMAGE_WIDTH }}
          height={resizedHeight(obj.width, obj.height, IMAGE_WIDTH)}
          resolutionX={32}
          resolutionY={32}
          punch={1}
        />
      )}
    </div>
  );
}

export function ContainerGrid({ currentArray, imageWidth, gridGap }) {
  const [currentWidth, setCurrentWidth] = useState(416);
  const gridRef = useRef();
  let screenWidth = useResize(1000);

  useEffect(() => {
    if (gridRef.current) {
      console.log("getting width");
      setCurrentWidth(
        gridRef.current.clientWidth / currentArray.length - gridGap
      ); //for fullscreen = 1320/3 => 440 => 440 - 26 = 416
    }
  }, [gridGap, screenWidth, currentArray]);

  return (
    <div className="grid" style={{ gap: gridGap }} ref={gridRef}>
      {currentArray.map((column, index) => {
        return (
          <div className="container" key={index}>
            {column.map((object) => {
              return (
                <Image
                  key={object.id}
                  obj={object}
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
