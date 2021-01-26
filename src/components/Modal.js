import styled from "styled-components";
import ReactDOM from "react-dom";
import { createModal, useClickOutside } from "../utils/lib";
import { useState, useEffect, useRef } from "react";

const ModalOuter = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
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
  height: 1500px;
  width: 75vw;
  display: flex;
  justify-content: center;
`;

const ImageZoomedOut = {
  padding: "10px 16px",
  margin: "0 auto",
};

const ImageZoomedIn = {
  padding: "0",
  margin: "0",
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
        style={{ width: 400 }}
      />
    );
  }
};

export const Modal = ({ disableModal, image }) => {
  const modalId = "modal-root";
  createModal(modalId);

  const [isLargeImage, setIsLargeImage] = useState(false);

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
      </ModalInner>
    </ModalOuter>,
    document.getElementById(modalId)
  );
};
