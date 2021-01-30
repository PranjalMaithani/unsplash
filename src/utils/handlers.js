import { useState, useCallback, useEffect, useRef } from "react";

export const handleKeyDown = (event, confirmAction, cancelAction) => {
  if (event.key === "Escape") cancelAction(event);
  else if (event.key === "Enter") confirmAction(event);
};

export const useScreenResize = (limit) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const [lastRan, setLastRan] = useState(0);
  const postExec = useRef(null);

  //to resize once after the user stops resizing
  const handleResizePost = useCallback(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  }, []);

  const handleResize = useCallback(() => {
    if (Date.now() - lastRan > limit) {
      setLastRan(Date.now());
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
      clearTimeout(postExec.current);
      postExec.current = setTimeout(handleResizePost, limit);
    }
  }, [limit, lastRan, handleResizePost]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return [windowWidth, windowHeight];
};
