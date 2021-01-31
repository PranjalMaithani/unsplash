import Modal from "./Modal";
import {
  createContext,
  useCallback,
  useState,
  useMemo,
  useContext,
} from "react";

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [modalImage, setModalImage] = useState(null);
  const showImage = useCallback((image) => {
    setModalImage(image);
  }, []);

  const disableModal = useCallback(() => {
    setModalImage(null);
  }, []);

  const providerValue = useMemo(() => ({ showImage }), [showImage]);
  return (
    <ModalContext.Provider value={providerValue}>
      {children}
      <Modal image={modalImage} disableModal={disableModal} />
    </ModalContext.Provider>
  );
};

export function useModal() {
  const context = useContext(ModalContext);
  return { showImage: context.showImage };
}
