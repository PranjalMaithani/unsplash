import styled from "styled-components";
import ReactDOM from "react-dom";
import { fetchPhotosSearch, fetchPhotoTags } from "../utils/fetchData";
import { useState, useEffect, useRef } from "react";
import { ContainerGrid } from "./Grid";
import data from "../utils/data";
import { createModal, useClickOutside } from "../utils/lib";

const screenWidths = [
  data.TWO_COLUMNS_SCREEN_WIDTH,
  data.THREE_COLUMNS_SCREEN_WIDTH,
];

const imageWidths = [data.RELATED_WIDTH_2COLUMNS, data.RELATED_WIDTH_3COLUMNS];

const tagsToString = (tags, isLandingPage) => {
  let string = "";

  if (!isLandingPage) {
    let count = 0;
    for (const tag of tags) {
      if (count < 3) {
        string += tag.title + " ";
        count++;
      }
    }
    return string;
  } else {
    for (const tag of tags) {
      if (tag.type && tag.type === "landing_page") {
        string += tag.title + " ";
      }
    }
    return string;
  }
};

const ModalOuter = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 55;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
`;

const ModalInner = styled.div`
  border-radius: 3px;
  border-style: none;
  outline: none;
  overflow-y: scroll;
  background-color: white;
  height: auto;
  width: 75vw;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ImageZoomedOut = {
  padding: "10px 16px",
  margin: "0 auto",
};

const ImageZoomedIn = {
  padding: "0",
  margin: "0",
  overflow: "hidden",
};

const ModalImage = ({ image, clickCallback, isLarge }) => {
  if (isLarge) {
    return (
      <img
        src={image.urls.full}
        alt={image.alt_description}
        onClick={clickCallback}
        style={{ width: "100%" }}
      />
    );
  } else {
    return (
      <img
        src={image.urls.regular}
        alt={image.alt_description}
        onClick={clickCallback}
        style={{ maxHeight: "80vh", width: "100%", minHeight: "333px" }}
      />
    );
  }
};

export const Modal = ({ disableModal, image }) => {
  const modalId = "modal-root";
  createModal(modalId);

  const [isLargeImage, setIsLargeImage] = useState(false);
  const [photosArray, setPhotoArray] = useState([]); //for related images in a modal

  useEffect(() => {
    const getPhotos = async (image) => {
      let tagString;
      let photos;
      if (image.tags !== undefined) {
        tagString = tagsToString(image.tags, false);
        photos = await fetchPhotosSearch(1, tagString, false);
      } else {
        const tags = await fetchPhotoTags(image);
        tagString = tagsToString(tags, true);
        photos = await fetchPhotosSearch(1, tagString, true);
      }

      setPhotoArray(photos);
    };

    getPhotos(image);
  }, [image]);

  useEffect(() => {
    const cancelAllActions = (event) => {
      if (event.key === "Escape") {
        disableModal();
      }
    };

    document.addEventListener("keydown", cancelAllActions);
    return () => {
      document.removeEventListener("keydown", cancelAllActions);
    };
  }, [disableModal]);

  const imageModalRef = useRef();
  useClickOutside(imageModalRef, disableModal);

  return ReactDOM.createPortal(
    <ModalOuter>
      <ModalInner ref={imageModalRef}>
        <div style={isLargeImage ? ImageZoomedIn : ImageZoomedOut}>
          <ModalImage
            image={image}
            clickCallback={() => {
              setIsLargeImage(!isLargeImage);
            }}
            isLarge={isLargeImage}
          />
        </div>
        <ContainerGrid
          photosArray={photosArray}
          screenWidths={screenWidths}
          imageWidths={imageWidths}
          minColumns={2}
          rowGap={data.ROW_GAP}
          columnGap={data.COLUMN_GAP}
        />
      </ModalInner>
    </ModalOuter>,
    document.getElementById(modalId)
  );
};
