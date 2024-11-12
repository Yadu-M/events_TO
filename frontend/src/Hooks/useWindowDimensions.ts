import { useEffect, useState } from "react";

export const useWindowDimensions = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const [newHeight, setNewHeight] = useState<number>(height);
  const [widthWidth, setNewWidth] = useState<number>(width);

  useEffect(() => {
    const updateWindowDimensions = () => {
      setNewHeight(window.innerHeight);
      setNewWidth(window.innerWidth);
    };
    window.addEventListener("resize", updateWindowDimensions);

    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  return {
    height: newHeight,
    width: widthWidth,
  };
};
