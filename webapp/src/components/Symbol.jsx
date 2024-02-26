import React from "react";

const Symbol = ({ src, size, angle, position }) => {
  const symbolStyle = {
    position: "absolute",
    width: `${size}px`,
    height: `${size}px`,
    transform: `rotate(${angle}deg)`,
    top: `${position.top}px`,
    left: `${position.left}px`,
  };

  return <img src={src} style={symbolStyle} alt="symbol" />;
};

export default Symbol;
