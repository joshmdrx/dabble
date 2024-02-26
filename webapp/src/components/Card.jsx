import React from "react";
import Symbol from "./Symbol";
import { imageLookup } from "../utils/dobble";

const Card = ({ srcs, onClick }) => {
  const symbols = [];
  const cardSize = 300; // Diameter of the card
  const margin = 20; // Margin to prevent symbols from touching the edge of the card
  const symbolSize = 40; // Fixed size for simplicity, adjust as needed
  const imagePath = "/";

  // Predefined positions for symbols
  const positions = [
    { left: cardSize / 2 - symbolSize / 20, top: margin }, // Top center
    { left: cardSize / 3 - symbolSize / 2, top: cardSize / 4 }, // Upper left
    { left: (2 * cardSize) / 3 - symbolSize, top: cardSize / 3 }, // Upper right
    { left: margin, top: cardSize / 2 - symbolSize / 2 }, // Middle left
    {
      left: cardSize - margin - symbolSize,
      top: cardSize / 2 - symbolSize / 2,
    }, // Middle right
    {
      left: cardSize / 3,
      top: (3 * cardSize) / 4.5 - symbolSize,
    }, // Lower left
    {
      left: (2 * cardSize) / 3 - symbolSize / 2,
      top: (3 * cardSize) / 4 - symbolSize,
    }, // Lower right
    // {
    //   left: cardSize / 2 - symbolSize / 2,
    //   top: cardSize - margin - symbolSize,
    // }, // Bottom center
    {
      left: cardSize / 2 - symbolSize,
      top: cardSize - margin - symbolSize * 1.25,
    }, // Bottom center
  ];

  positions.forEach((position, i) => {
    const rotation = Math.random() * 360; // Random rotation
    const size = Math.random() * (80 - 50) + 30; // Random size between 30px and 60px
    const url = `${imagePath}${imageLookup[srcs[i]]}`;
    console.log(url);

    symbols.push(
      <Symbol
        key={i}
        src={url} // Replace with your image paths
        size={size}
        angle={rotation}
        position={position}
        onClick={onClick}
      />
    );
  });

  const cardStyle = {
    width: `${cardSize}px`,
    height: `${cardSize}px`,
    borderRadius: "50%",
    backgroundColor: "white",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return <div style={cardStyle}>{symbols}</div>;
};

// const url = `https://picsum.photos/200`;
export default Card;
