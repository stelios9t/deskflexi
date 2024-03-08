import React from "react";

export const CircleStatus = ({ className, onClick, isHighlighted = false }) => {
  const highlightClass = isHighlighted ? "highlighted" : "";

  return (
    <svg
      className={`${className} property1status ${highlightClass}`}
      fill="none"
      height="52"
      viewBox="0 0 48 52"
      width="48"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <path
        d="M45 26C45 38.9332 35.3764 49 24 49C12.6236 49 3 38.9332 3 26C3 13.0668 12.6236 3 24 3C35.3764 3 45 13.0668 45 26Z"
        fill={isHighlighted ? "#237025" : "#00D509"}
        stroke="white"
        strokeWidth="6"
      />
    </svg>
  );
};
