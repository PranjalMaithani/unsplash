import { useImageLazyLoad } from "../utils";
import { resizedHeight } from "../utils/masonry.js";
import { Blurhash } from "react-blurhash";
import { useState } from "react";
import { Modal } from "./Modal";

export function Image({ image, IMAGE_WIDTH }) {
  const [isVisible, imageRef] = useImageLazyLoad();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      className="image"
      ref={imageRef}
      style={{
        position: "relative",
        height: resizedHeight(image.width, image.height, IMAGE_WIDTH),
      }}
      onClick={() => {
        setIsModalOpen(true);
        document.body.style.overflow = "hidden";
      }}
    >
      {isVisible && (
        <img
          src={image.urls.regular}
          className="unsplashImage"
          style={{
            maxWidth: IMAGE_WIDTH,
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 5,
          }}
          alt={image.description || image.alt_description}
        />
      )}
      <Blurhash
        alt={image.description || image.alt_description}
        hash={image.blur_hash}
        className="unsplashImage blurHash"
        style={{
          width: "100%",
          maxWidth: IMAGE_WIDTH,
          position: "absolute",
          left: 0,
          top: 0,
          zIndex: 2,
        }}
        height={resizedHeight(image.width, image.height, IMAGE_WIDTH)}
        resolutionX={32}
        resolutionY={32}
        punch={1}
      />
      {isModalOpen && (
        <Modal
          image={image}
          disableModal={() => {
            setIsModalOpen(false);
            document.body.style.overflow = "auto";
          }}
        />
      )}
    </div>
  );
}
