import { useEffect } from "react";

export function createModal(divId) {
  const checkElement = document.getElementById(divId);
  if (!checkElement) {
    let element = document.createElement("div");
    element.setAttribute("id", divId);
    document.body.appendChild(element);
  }
}

export function useClickOutside(innerRef, callback) {
  useEffect(() => {
    const handleClickOutside = (event) => {
      event.stopPropagation();
      if (
        innerRef.current &&
        !innerRef.current.contains(event.target) &&
        event.target.contains(innerRef.current)
      ) {
        callback(event);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [callback, innerRef]);
}

export const removeDulpicateImages = (prevPhotos, nextPhotos) => {
  if (!nextPhotos) {
    return [];
  }
  const filteredPhotos = nextPhotos.filter((current) => {
    return !prevPhotos.some((checkPhoto) => checkPhoto.id === current.id);
  });
  return [...prevPhotos, ...filteredPhotos];
};
