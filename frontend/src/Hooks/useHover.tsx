import { RefObject, useEffect, useState } from "react";

export const useHover = <T extends HTMLElement>(ref: RefObject<T>) => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const handeMouseEnter = () => {
      setIsHovered(true);
    };
    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    return () => {
      node.removeEventListener("mouseenter", handeMouseEnter);
      node.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref]);

  return isHovered;
};
