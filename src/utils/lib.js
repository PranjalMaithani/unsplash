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
      if (innerRef.current && !innerRef.current.contains(event.target)) {
        callback(event);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [callback, innerRef]);
}
