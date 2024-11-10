import { useRef } from "react";
import { useHover } from "../Hooks/useHover";
import "./style.css";

export const Popup = () => {
  const popupRef = useRef<HTMLDivElement>(null);
  const isHover = useHover(popupRef);

  return (
    <div ref={popupRef} className="popup">
      <h1>Popup</h1>
    </div>
  );
};
