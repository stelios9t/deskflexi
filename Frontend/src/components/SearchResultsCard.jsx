import React from "react";
import deskIcon from "../images/desk-icon.avif";
import { Link } from "react-router-dom";
const SearchResultsCard = ({ desk }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-8 gap-8">
      <div className="w-full h-[300px]">
        <img
          src={deskIcon}
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="grid grid-rows-[1fr_2fr_1fr]">
        <Link
          to={`/detail/${desk._id}`}
          className="text-2xl font-bold cursor-point"
        >
          {desk.deskNumber}
        </Link>
        <div className="grid grid-cols-2 items-end whitespace-nowrap">
          <div className="felx gap-1 items-center">
            {desk.amenities.slice(0, 3).map((amenity) => {
              <span className="bg-slate-300 p-2 rounded-lg font-bold text-xs whitespace-nowrap">
                {amenity}
              </span>;
            })}
            <span className="text-sm">
              {desk.amenities.length > 3 &&
                `+${desk.amenities.length - 3} more`}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Link
              to={`/detail/${desk._id}`}
              className="bg-black text-white h-full p-2 font-bold text-xl max-w-fit hover:bg-grey-800"
            >
              View More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsCard;
