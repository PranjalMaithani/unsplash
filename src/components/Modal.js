import styled from "styled-components";
import ReactDOM from "react-dom";

import { fetchPhotosSearch, fetchPhotoTags } from "../utils/fetchData";
import { useState, useEffect, useRef } from "react";
import { ContainerGrid } from "./Grid";
import { CreditsHeader } from "./Credits";
import data from "../utils/data";
import { createModal, useClickOutside } from "../utils/lib";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faTimes } from "@fortawesome/free-solid-svg-icons";

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
  width: 75vw;
  margin-top: 30px;
  overflow-y: auto;
  cursor: auto;

  @media (max-width: ${data.FULL_MODAL_SCREEN_WIDTH}) {
    width: 100vw;
    height: 100vh;
    margin-top: 0;
  }
`;

const Heading = styled.h3`
  font-size: 1.2rem;
  padding: 10px;
  padding-left: 25px;
  font-weight: 400;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  outline: none;

  font-size: 1.3rem;
  opacity: 0.8;
  transition: 0.2s;
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;

  color: white;
  @media (max-width: ${data.FULL_MODAL_SCREEN_WIDTH}) {
    color: black;
    opacity: 0.4;
  }

  &:hover {
    opacity: 1;
  }
`;

const ImageZoomedOut = {
  padding: "0 16px",
  margin: "0 auto",
  textAlign: "center",
};

const ImageZoomedIn = {
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
          maxWidth: "100%",
          maxHeight: "80vh",
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

  if (!image) {
    document.body.style.overflow = "auto";
    return null;
  } else {
    document.body.style.overflow = "hidden";
  }

  return ReactDOM.createPortal(
    <ModalOuter>
      <CloseButton
        children={
          <FontAwesomeIcon icon={faTimes} style={{ fontSize: "35px" }} />
        }
        onClick={disableModal}
      />
      <ModalInner ref={imageModalRef}>
        <CreditsHeader image={image} />
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
