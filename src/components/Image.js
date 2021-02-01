import { useImageLazyLoad } from "../utils";
import { resizedHeight } from "../utils/masonry.js";
import { Blurhash } from "react-blurhash";
import { useModal } from "./useModal";
import styled from "styled-components";

const Vignette = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  opacity: 0;
  transition: 0.2s;
  &:hover {
    opacity: 1;
    background: rgb(0, 0, 0);
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.55) 0%,
      rgba(0, 0, 0, 0.1) 35%,
      rgba(0, 0, 0, 0.1) 67%,
      rgba(0, 0, 0, 0.55) 100%
    );
  }
`;

const CreditsDiv = styled.a`
  text-decoration: none;
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 20px;
  left: 10px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  outline: none;
`;

const CreditsPhoto = styled.img`
  border-radius: 50%;
  margin: 0 10px;
`;

const CreditsName = styled.a`
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  color: white;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
  opacity: 0.8;
  transition: 0.1s;

  &:hover {
    opacity: 1;
  }
`;

const Credits = ({ image }) => {
  const portfolioLink = `https://unsplash.com/@${image.user.username}`;

  if (!image) {
    return null;
  }
  return (
    <CreditsDiv
      href={portfolioLink}
      target="_blank"
      rel="noreferrer noopener"
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <CreditsPhoto
        src={image.user.profile_image.small}
        alt="Photographer profile picture"
      />
      <CreditsName>
        {image.user.first_name +
          " " +
          (image.user.last_name ? image.user.last_name : "")}
      </CreditsName>
    </CreditsDiv>
  );
};

export function Image({ image, IMAGE_WIDTH }) {
  const [isVisible, imageRef] = useImageLazyLoad();
  const modal = useModal();

  return (
    <div
      className="image"
      ref={imageRef}
      style={{
        position: "relative",
        height: resizedHeight(image.width, image.height, IMAGE_WIDTH),
        cursor: "zoom-in",
      }}
      onClick={() => {
        modal.showImage(image);
      }}
    >
      <Vignette>{<Credits image={image} />}</Vignette>
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
    </div>
  );
}
