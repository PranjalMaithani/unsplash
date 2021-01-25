import { useImageLazyLoad } from "./utils";
import { resizedHeight } from "./masonry.js";
import { Blurhash } from "react-blurhash";
import { useState, useRef, useEffect } from "react";
import { useResize } from "./utils/handlers";

export function Image({ obj, IMAGE_WIDTH }) {
  const [isVisible, imageRef] = useImageLazyLoad();

  return (
    <div
      className="image"
      ref={imageRef}
      style={{
        position: "relative",
        height: resizedHeight(obj.width, obj.height, IMAGE_WIDTH),
      }}
    >
      {isVisible && (
        <img
          src={obj.urls.regular}
          className="unsplashImage"
          style={{
            maxWidth: IMAGE_WIDTH,
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 5,
          }}
          alt={obj["alt_description"]}
        />
      )}
      <Blurhash
        alt={obj["alt_description"]}
        hash={obj.blur_hash}
        className="unsplashImage blurHash"
        style={{
          width: "100%",
          maxWidth: IMAGE_WIDTH,
          position: "absolute",
          left: 0,
          top: 0,
          zIndex: 2,
        }}
        height={resizedHeight(obj.width, obj.height, IMAGE_WIDTH)}
        resolutionX={32}
        resolutionY={32}
        punch={1}
      />
    </div>
  );
}

export function ContainerGrid({ currentArray, maxImageWidth, gridGap }) {
  const [currentWidth, setCurrentWidth] = useState(maxImageWidth);
  const gridRef = useRef();
  let screenWidth = useResize(100);

  useEffect(() => {
    if (gridRef.current) {
      setCurrentWidth(
        gridRef.current.clientWidth / currentArray.length - gridGap
      ); //for fullscreen = 1320/3 => 440 => 440 - 26 = 416
    }
  }, [gridGap, screenWidth, currentArray, maxImageWidth]);

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
