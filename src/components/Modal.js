import styled from "styled-components";
import ReactDOM from "react-dom";
import { fetchPhotosSearch, fetchPhotoTags } from "../utils/fetchData";
import { useState, useEffect, useRef } from "react";
import { ContainerGrid } from "./Grid";
import data from "../utils/data";
import { createModal, useClickOutside } from "../utils/lib";
import { useScreenResize } from "../utils/handlers";

const screenWidths = [
  data.SCREEN_WIDTH_RELATED_2COLUMNS,
  data.SCREEN_WIDTH_RELATED_3COLUMNS,
];

const imageWidths = [data.RELATED_WIDTH_2COLUMNS, data.RELATED_WIDTH_3COLUMNS];

const tagsToString = (tags, isLandingPage) => {
  if (!tags) {
    return "";
  }

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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 55;
  overflow: auto;
  display: flex;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  cursor: zoom-out;
`;

const ModalInner = styled.div`
  border-radius: 3px;
  border-style: none;
  outline: none;
  background-color: white;
  width: ${(props) => (props.screenWidth > 865 ? "75vw" : "100vw")};
  margin-top: 30px;
  overflow-y: auto;
  cursor: auto;
`;

const Heading = styled.h3`
  font-size: 1.5rem;
  text-align: center;
  font-weight: 400;
  letter-spacing: 1px;
`;

const ImageZoomedOut = {
  padding: "10px 16px",
  margin: "0 auto",
  textAlign: "center",
};

const ImageZoomedIn = {
  padding: "10px 0",
  margin: "0",
  overflow: "hidden",
  height: "auto",
};

const ModalImage = ({ image, clickCallback, isLarge }) => {
  if (isLarge) {
    return (
      <img
        src={image.urls.full}
        alt={image.alt_description}
        onClick={clickCallback}
        style={{ width: "100%", cursor: "zoom-out" }}
      />
    );
  } else {
    return (
      <img
        src={image.urls.regular}
        alt={image.alt_description}
        onClick={clickCallback}
        style={{
          maxHeight: "80vh",
          minHeight: "333px",
          cursor: "zoom-in",
        }}
      />
    );
  }
};

const Modal = ({ image, disableModal }) => {
  const modalId = "modal-root";
  createModal(modalId);

  const [isLargeImage, setIsLargeImage] = useState(false);
  const [photosArray, setPhotoArray] = useState([]); //for related images in a modal

  useEffect(() => {
    const getRelatedPhotos = async (image) => {
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

    if (image) {
      getRelatedPhotos(image);
    }
    setPhotoArray([]);
    setIsLargeImage(false);
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
  let [screenWidth] = useScreenResize(100);

  if (!image) {
    document.body.style.overflow = "auto";
    return null;
  } else {
    document.body.style.overflow = "hidden";
  }

  return ReactDOM.createPortal(
    <ModalOuter>
      <ModalInner ref={imageModalRef} screenWidth={screenWidth}>
        <div style={isLargeImage ? ImageZoomedIn : ImageZoomedOut}>
          <ModalImage
            image={image}
            clickCallback={() => {
              setIsLargeImage(!isLargeImage);
            }}
            isLarge={isLargeImage}
          />
        </div>
        <Heading>Related Images</Heading>
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

export default Modal;
