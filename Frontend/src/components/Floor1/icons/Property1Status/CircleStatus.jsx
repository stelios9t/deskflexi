export const CircleStatus = ({
  className,
  onClick,
  isHighlighted = false,
  booked = false,
  bookedByCurrentUser = false, // New prop
}) => {
  const fillColor = bookedByCurrentUser
    ? "#0000FF" // Blue for desks booked by the current user
    : booked
    ? "#FF0000" // Red for desks booked by others
    : isHighlighted
    ? "#237025" // Green for available desks
    : "#00D509"; // Default color

  const classes = `${className} property1status ${
    isHighlighted ? "highlighted" : ""
  }`;

  return (
    <svg
      className={classes}
      fill="none"
      height="52"
      viewBox="0 0 48 52"
      width="48"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <path
        d="M45 26C45 38.9332 35.3764 49 24 49C12.6236 49 3 38.9332 3 26C3 13.0668 12.6236 3 24 3C35.3764 3 45 13.0668 45 26Z"
        fill={fillColor} // Use the dynamic fill color based on booking status
        stroke="white"
        strokeWidth="6"
      />
    </svg>
  );
};
