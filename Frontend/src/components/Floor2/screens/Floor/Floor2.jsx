import React, { useState, useEffect } from "react";
import { CircleStatus } from "../../../Floor1/icons/Property1Status/CircleStatus.jsx";
import wall_1 from "../../static/img/wall-1.svg";
import wall from "../../static/img/wall.svg";
import wall_2 from "../../static/img/wall-2.svg";
import wall_3 from "../../static/img/wall-3.svg";
import wall_4 from "../../static/img/wall-4.svg";
import wall_5 from "../../static/img/wall-5.svg";
import wall_7 from "../../static/img/wall-7.svg";
import wall_8 from "../../static/img/wall-8.svg";
import wall_10 from "../../static/img/wall-10.svg";
import wall5_1 from "../../static/img/wall5-1.svg";
import wall7_1 from "../../static/img/wall7-1.svg";
import wall7_2 from "../../static/img/wall7-2.svg";
import wall8_1 from "../../static/img/wall8-1.svg";
import wall10_1 from "../../static/img/wall10-1.svg";
import "../../../Floor1/screens/Floor1/styles.css";
import { useSearchContext } from "../../../../contexts/SearchContext";
import * as apiClient from "../../../../api-client.js";
import BookingSideBar from "../../../BookingSideBar.jsx";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAppContext } from "../../../../contexts/AppContext.jsx";
import LoadingSpinner from "../../../LoadingSpinner.jsx";
import BookingSideBarCroom from "../../../BookingSideBarCroom.jsx";
const Floor2 = () => {
  const [deskDetails, setDeskDetails] = useState(null);
  const [clickedDeskId, setClickedDeskId] = useState(null);
  const [clickedCroomId, setClickedCroomId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [croomDetails, setCroomDetails] = useState(null);
  const [showModalCroom, setShowModalCroom] = useState(false);
  const navigate = useNavigate();
  const searchContext = useSearchContext();
  const [deskBookingStatuses, setDeskBookingStatuses] = useState({});
  const { showToast } = useAppContext();
  useEffect(() => {
    // const croomId = "660a7bd61ecd903d915debab";
    // const fetchCroomDetails = async () => {
    //   try {
    //     const croomData = await apiClient.fetchCroomById(croomId);
    //     setCroomDetails(croomData);
    //   } catch (error) {
    //     console.error("Error fetching conference room details:", error.message);
    //   }
    // };
    const fetchDesksAndCheckBookingStatus = async () => {
      setIsLoading(true);

      const deskIds = [
        "65fae2b38459d17e640a0777", //19
        "65fae2d18459d17e640a078c", //20
        "65fc19c8bc635c964d6f88b9", //21
        "66093cacd6f08499051b8335", //22
        "66093cacd6f08499051b8336", //23
        "66093cacd6f08499051b8337", //24
        "66093cacd6f08499051b8338", //25
        "66093cacd6f08499051b8339", //26
        "66093cacd6f08499051b833a", //27
        "66093cacd6f08499051b833b", //28
        "66093cacd6f08499051b833c", //29
        "66093cacd6f08499051b833d", //30
        "66093cacd6f08499051b833e", //31
        "66093cacd6f08499051b833f", //32
        "66093cacd6f08499051b8340", //33
        "66093cacd6f08499051b8341", //34
        "66183ce549cd0d6a09f96586", //35
      ];
      let statuses = {};

      for (const deskId of deskIds) {
        try {
          const deskDetails = await apiClient.fetchDeskById(deskId);
          const requestedCheckIn = new Date(searchContext.checkIn).setHours(
            0,
            0,
            0,
            0
          );
          const requestedCheckOut = new Date(searchContext.checkOut).setHours(
            0,
            0,
            0,
            0
          );

          const isBooked = deskDetails.bookings.some((booking) => {
            const bookingStart = new Date(booking.checkIn).setHours(0, 0, 0, 0);
            const bookingEnd = new Date(booking.checkOut).setHours(0, 0, 0, 0);
            return (
              requestedCheckIn <= bookingEnd &&
              requestedCheckOut >= bookingStart
            );
          });

          statuses[deskId] = isBooked;
        } catch (error) {
          console.error("Error fetching desk details:", error.message);
        }
      }

      setDeskBookingStatuses(statuses);
      setIsLoading(false);
    };

    fetchDesksAndCheckBookingStatus();
    // fetchCroomDetails();
  }, [searchContext.checkIn, searchContext.checkOut]); // Add other dependencies as necessary
  useEffect(() => {
    const searchForDesk = async () => {
      if (searchContext.deskNumber) {
        try {
          const searchParams = {
            deskNumber: searchContext.deskNumber,
            checkIn: searchContext.checkIn.toISOString(),
            checkOut: searchContext.checkOut.toISOString(),
            floor: searchContext.floor.toString(),
          };
          const { data } = await apiClient.searchDesks(searchParams);
          if (data && data.length === 1) {
            // Found exactly one desk, navigate to its detail view
            navigate(`/detail/desk/${data[0]._id}`);
            setDeskDetails(data[0]);
            setCroomDetails(null);
            if (clickedDeskId !== data[0]._id) {
              // Reset clickedDeskId if the searched desk is different
              setClickedDeskId(null);
            }
          } else {
            setDeskDetails(null);
            setCroomDetails(null);
            showToast({
              message: "Desk number does not exist",
              type: "ERROR",
            });
            // Reset clickedDeskId as no desk matches the search
            setClickedDeskId(null);
          }
        } catch (error) {
          console.error("Error searching for desks:", error.message);
          setDeskDetails(null);
          setCroomDetails(null);
          // Consider resetting clickedDeskId in case of error too
          setClickedDeskId(null);
        }
      }
    };

    searchForDesk();
  }, [
    searchContext.deskNumber,
    searchContext.checkIn,
    searchContext.checkOut,
    searchContext.floor,
  ]);

  const handleDeskClick = async (deskId) => {
    console.log(`Desk clicked: ${deskId}`); // Debug log

    try {
      const deskDetailsData = await apiClient.fetchDeskById(deskId);
      setDeskDetails(deskDetailsData);
      setClickedDeskId(deskId);
      setCroomDetails(null);
      setClickedCroomId(null);
      // Clear search context or reset desk number in search context
      searchContext.saveSearchValues(
        "",
        searchContext.checkIn,
        searchContext.checkOut,
        searchContext.floor
      );
    } catch (error) {
      console.error("Error fetching desk details:", error.message);
    }
  };

  const handleCroomClick = async (croomId) => {
    try {
      const croomDetailsData = await apiClient.fetchCroomById(croomId);
      setCroomDetails(croomDetailsData);
      setClickedCroomId(croomId);
      setShowModalCroom(true);
      setDeskDetails(null);
      setClickedDeskId(null);
    } catch (error) {
      console.error("Error fetching desk details:", error.message);
    }
  };
  const closeModal = (actionSource) => {
    if (actionSource === "closeIcon") {
      setDeskDetails(null);
      setClickedDeskId(null);
      setClickedCroomId(null);
      setCroomDetails(null);
      searchContext.saveSearchValues(
        "",
        new Date(),
        new Date(),
        searchContext.floor
      );
      // searchContext.clearSearch();
      navigate("/search");
    } else if (actionSource === "booking") {
      setDeskDetails(null);
      setCroomDetails(null);
      searchContext.saveSearchValues(
        searchContext.deskNumber,
        new Date(),
        new Date(),
        searchContext.floor
      );
      setClickedDeskId(null);
      setClickedCroomId(null);
      navigate("/search");
    } else {
      navigate("/search");
      setClickedDeskId(null);
      setClickedCroomId(null);
      setDeskDetails(null);
      setCroomDetails(null);
    }
  };
  return (
    <div className="bg-white flex flex-row justify-center w-full">
      {isLoading && (
        <div className="absolute z-10 inset-0 bg-black bg-opacity-25 flex justify-center items-center">
          <LoadingSpinner />
        </div>
      )}
      <div className="bg-white w-[1328px] h-[740px]">
        <div className="relative w-[1280px] h-[683px] top-[21px] left-[48px]">
          <div className="absolute w-[122px] h-[115px] top-[530px] left-[1158px]">
            <div className="absolute w-[114px] h-[90px] top-[12px] left-[-11px] bg-[#f1f0f0] rounded-[25px] rotate-[90.63deg]" />
            <Link to={`/detail/desk/65fae2b38459d17e640a0777`}>
              <CircleStatus
                className="!absolute !w-[49px] !h-[53px] !top-[33px] !left-[73px]"
                onClick={() => handleDeskClick("65fae2b38459d17e640a0777")}
                booked={deskBookingStatuses["65fae2b38459d17e640a0777"]}
                isHighlighted={
                  clickedDeskId === "65fae2b38459d17e640a0777" ||
                  searchContext.deskNumber === "19"
                }
              />
            </Link>
          </div>
          <div className="absolute w-[114px] h-[121px] top-[190px] left-[292px]">
            <div className="absolute w-[114px] h-[90px] top-0 left-0 bg-[#f1f0f0] rounded-[25px] rotate-[179.93deg]" />
            <Link to={`/detail/desk/65fae2d18459d17e640a078c`}>
              <CircleStatus
                className="!absolute !w-[52px] !h-[48px] !top-[73px] !left-[32px]"
                onClick={() => handleDeskClick("65fae2d18459d17e640a078c")}
                booked={deskBookingStatuses["65fae2d18459d17e640a078c"]}
                isHighlighted={
                  clickedDeskId === "65fae2d18459d17e640a078c" ||
                  searchContext.deskNumber === "20"
                }
              />
            </Link>
          </div>
          <div className="absolute w-[114px] h-[121px] top-[190px] left-[428px]">
            <div className="absolute w-[114px] h-[90px] top-0 left-0 bg-[#f1f0f0] rounded-[25px] rotate-[179.93deg]" />
            <Link to={`/detail/desk/65fc19c8bc635c964d6f88b9`}>
              <CircleStatus
                className="!absolute !w-[52px] !h-[48px] !top-[73px] !left-[30px]"
                onClick={() => handleDeskClick("65fc19c8bc635c964d6f88b9")}
                booked={deskBookingStatuses["65fc19c8bc635c964d6f88b9"]}
                isHighlighted={
                  clickedDeskId === "65fc19c8bc635c964d6f88b9" ||
                  searchContext.deskNumber === "21"
                }
              />
            </Link>
          </div>
          <div className="absolute w-[114px] h-[121px] top-[190px] left-[555px]">
            <div className="absolute w-[114px] h-[90px] top-0 left-0 bg-[#f1f0f0] rounded-[25px] rotate-[179.93deg]" />
            <Link to={`/detail/desk/66093cacd6f08499051b8335`}>
              <CircleStatus
                className="!absolute !w-[52px] !h-[48px] !top-[73px] !left-[30px]"
                onClick={() => handleDeskClick("66093cacd6f08499051b8335")}
                booked={deskBookingStatuses["66093cacd6f08499051b8335"]}
                isHighlighted={
                  clickedDeskId === "66093cacd6f08499051b8335" ||
                  searchContext.deskNumber === "22"
                }
              />
            </Link>
          </div>
          <div className="absolute w-[114px] h-[121px] top-[190px] left-[691px]">
            <div className="absolute w-[114px] h-[90px] top-0 left-0 bg-[#f1f0f0] rounded-[25px] rotate-[179.93deg]" />
            <Link to={`/detail/desk/66093cacd6f08499051b8336`}>
              <CircleStatus
                className="!absolute !w-[52px] !h-[48px] !top-[73px] !left-[30px]"
                onClick={() => handleDeskClick("66093cacd6f08499051b8336")}
                booked={deskBookingStatuses["66093cacd6f08499051b8336"]}
                isHighlighted={
                  clickedDeskId === "66093cacd6f08499051b8336" ||
                  searchContext.deskNumber === "23"
                }
              />
            </Link>
          </div>
          <div className="absolute w-[114px] h-[114px] top-[70px] left-[428px]">
            <div className="absolute w-[114px] h-[90px] top-[24px] left-0 bg-[#f1f0f0] rounded-[25px] rotate-[179.93deg]" />
            <Link to={`/detail/desk/66093cacd6f08499051b8338`}>
              <CircleStatus
                className="!absolute !w-[52px] !h-[48px] !top-0 !left-[30px]"
                onClick={() => handleDeskClick("66093cacd6f08499051b8338")}
                booked={deskBookingStatuses["66093cacd6f08499051b8338"]}
                isHighlighted={
                  clickedDeskId === "66093cacd6f08499051b8338" ||
                  searchContext.deskNumber === "25"
                }
              />
            </Link>
          </div>
          <div className="absolute w-[114px] h-[113px] top-[70px] left-[559px]">
            <div className="absolute w-[114px] h-[90px] top-[23px] left-0 bg-[#f1f0f0] rounded-[25px] rotate-[179.93deg]" />
            <Link to={`/detail/desk/66093cacd6f08499051b8339`}>
              <CircleStatus
                className="!absolute !w-[52px] !h-[48px] !top-0 !left-[25px]"
                onClick={() => handleDeskClick("66093cacd6f08499051b8339")}
                booked={deskBookingStatuses["66093cacd6f08499051b8339"]}
                isHighlighted={
                  clickedDeskId === "66093cacd6f08499051b8339" ||
                  searchContext.deskNumber === "26"
                }
              />
            </Link>
          </div>
          <div className="absolute w-[114px] h-[113px] top-[70px] left-[691px]">
            <div className="absolute w-[114px] h-[90px] top-[23px] left-0 bg-[#f1f0f0] rounded-[25px] rotate-[179.93deg]" />
            <Link to={`/detail/desk/66093cacd6f08499051b833a`}>
              <CircleStatus
                className="!absolute !w-[52px] !h-[48px] !top-0 !left-[30px]"
                onClick={() => handleDeskClick("66093cacd6f08499051b833a")}
                booked={deskBookingStatuses["66093cacd6f08499051b833a"]}
                isHighlighted={
                  clickedDeskId === "66093cacd6f08499051b833a" ||
                  searchContext.deskNumber === "27"
                }
              />
            </Link>
          </div>
          <div className="absolute w-[114px] h-[114px] top-[70px] left-[291px]">
            <div className="absolute w-[114px] h-[91px] top-[23px] left-0 bg-[#f1f0f0] rounded-[25px] rotate-[179.93deg]" />
            <Link to={`/detail/desk/66093cacd6f08499051b8337`}>
              <CircleStatus
                className="!absolute !w-[52px] !h-[48px] !top-0 !left-[33px]"
                onClick={() => handleDeskClick("66093cacd6f08499051b8337")}
                booked={deskBookingStatuses["66093cacd6f08499051b8337"]}
                isHighlighted={
                  clickedDeskId === "66093cacd6f08499051b8337" ||
                  searchContext.deskNumber === "24"
                }
              />
            </Link>
          </div>
          <div
            className="absolute w-[692px] h-[199px] top-[484px] left-[588px]"
            style={{ pointerEvents: "none" }}
          >
            <div className="absolute w-[263px] top-[138px] left-0 [font-family:'Inter',Helvetica] font-normal text-[#f1f0f0] text-[36px] text-center tracking-[0] leading-[normal]">
              ENTRANCE
            </div>
            <img
              className="w-[441px] top-[188px] left-[251px] absolute h-[10px]"
              alt="Wall"
              src={wall5_1}
            />
            <img
              className="h-[189px] top-[7px] left-[549px] absolute w-[5px]"
              alt="Wall"
              src={wall7_1}
            />
            <img
              className="h-[199px] top-0 left-[246px] absolute w-[5px]"
              alt="Wall"
              src={wall7_2}
            />
          </div>
          <img
            className="absolute w-[1042px] h-[10px] top-0 left-[238px]"
            alt="Wall"
            src={wall}
          />
          <img
            className="absolute w-[11px] h-[87px] top-0 left-[235px]"
            alt="Wall"
            src={wall_2}
          />
          <img
            className="absolute w-[235px] h-[10px] top-[78px] left-[10px]"
            alt="Wall"
            src={wall_3}
          />
          <img
            className="absolute w-[103px] h-[604px] top-[78px] left-0"
            alt="Wall"
            src={wall_4}
          />
          <img
            className="w-[496px] top-[673px] left-[92px] absolute h-[10px]"
            alt="Wall"
            src={wall_5}
          />
          <img
            className="absolute w-[47px] h-[274px] top-[407px] left-[244px]"
            alt="Wall"
            src={wall_10}
          />
          <img
            className="absolute w-[198px] h-[5px] top-[327px] left-[40px]"
            alt="Wall"
            src={wall_1}
          />
          <img
            className="absolute w-[36px] h-[199px] top-[134px] left-[203px]"
            alt="Wall"
            src={wall10_1}
          />
          <div className="top-[143px] left-[23px] rotate-[-98.78deg] absolute w-[200px] h-[145px] bg-[#f1f0f0] rounded-[300px]" />
          {/* conference room 3 */}
          <Link to={`/detail/croom/660ad34f1ecd903d915dedb5`}>
            <CircleStatus
              className="!absolute !w-[48px] !h-[52px] !top-[96px] !left-[80px]"
              onClick={() => handleCroomClick("660ad34f1ecd903d915dedb5")}
              isHighlighted={clickedCroomId === "660ad34f1ecd903d915dedb5"}
            />
          </Link>
          <div className="top-[462px] left-[67px] rotate-[-98.78deg] absolute w-[200px] h-[145px] bg-[#f1f0f0] rounded-[300px]" />
          {/* conference room 4 */}
          {/* className="!absolute !w-[48px] !h-[52px] !top-[415px] !left-[124px]" */}
          <Link to={`/detail/croom/66183dfe49cd0d6a09f967eb`}>
            <CircleStatus
              className="!absolute !w-[48px] !h-[52px] !top-[415px] !left-[124px]"
              onClick={() => handleCroomClick("66183dfe49cd0d6a09f967eb")}
              isHighlighted={clickedCroomId === "66183dfe49cd0d6a09f967eb"}
            />
          </Link>
          <div className="absolute w-[141px] h-[371px] top-[78px] left-[1139px]">
            <img
              className="h-[371px] top-0 left-px absolute w-[5px]"
              alt="Wall"
              src={wall_7}
            />
            <img
              className="w-[141px] top-[366px] left-0 absolute h-[5px]"
              alt="Wall"
              src={wall_8}
            />
          </div>
          <img
            className="w-[252px] top-[479px] left-[838px] absolute h-[5px]"
            alt="Wall"
            src={wall8_1}
          />
          <div className="absolute w-[114px] h-[121px] top-[481px] left-[303px]">
            <div className="absolute w-[114px] h-[90px] top-0 left-0 bg-[#f1f0f0] rounded-[25px] rotate-[179.93deg]" />
            <Link to={`/detail/desk/66093cacd6f08499051b833b`}>
              <CircleStatus
                className="!absolute !w-[52px] !h-[48px] !top-[73px] !left-[32px]"
                onClick={() => handleDeskClick("66093cacd6f08499051b833b")}
                booked={deskBookingStatuses["66093cacd6f08499051b833b"]}
                isHighlighted={
                  clickedDeskId === "66093cacd6f08499051b833b" ||
                  searchContext.deskNumber === "28"
                }
              />
            </Link>
          </div>
          <div className="absolute w-[114px] h-[121px] top-[481px] left-[439px]">
            <div className="absolute w-[114px] h-[90px] top-0 left-0 bg-[#f1f0f0] rounded-[25px] rotate-[179.93deg]" />
            <Link to={`/detail/desk/66093cacd6f08499051b833c`}>
              <CircleStatus
                className="!absolute !w-[52px] !h-[48px] !top-[73px] !left-[30px]"
                onClick={() => handleDeskClick("66093cacd6f08499051b833c")}
                booked={deskBookingStatuses["66093cacd6f08499051b833c"]}
                isHighlighted={
                  clickedDeskId === "66093cacd6f08499051b833c" ||
                  searchContext.deskNumber === "29"
                }
              />
            </Link>
          </div>
          <div className="absolute w-[114px] h-[121px] top-[481px] left-[566px]">
            <div className="absolute w-[114px] h-[90px] top-0 left-0 bg-[#f1f0f0] rounded-[25px] rotate-[179.93deg]" />
            <Link to={`/detail/desk/66093cacd6f08499051b833d`}>
              <CircleStatus
                className="!absolute !w-[52px] !h-[48px] !top-[73px] !left-[30px]"
                onClick={() => handleDeskClick("66093cacd6f08499051b833d")}
                booked={deskBookingStatuses["66093cacd6f08499051b833d"]}
                isHighlighted={
                  clickedDeskId === "66093cacd6f08499051b833d" ||
                  searchContext.deskNumber === "30"
                }
              />
            </Link>
          </div>
          <div className="absolute w-[114px] h-[121px] top-[481px] left-[702px]">
            <div className="absolute w-[114px] h-[90px] top-0 left-0 bg-[#f1f0f0] rounded-[25px] rotate-[179.93deg]" />
            <Link to={`/detail/desk/66093cacd6f08499051b833e`}>
              <CircleStatus
                className="!absolute !w-[52px] !h-[48px] !top-[73px] !left-[30px]"
                onClick={() => handleDeskClick("66093cacd6f08499051b833e")}
                booked={deskBookingStatuses["66093cacd6f08499051b833e"]}
                isHighlighted={
                  clickedDeskId === "66093cacd6f08499051b833e" ||
                  searchContext.deskNumber === "31"
                }
              />
            </Link>
          </div>
          <div className="absolute w-[114px] h-[114px] top-[361px] left-[439px]">
            <div className="absolute w-[114px] h-[90px] top-[24px] left-0 bg-[#f1f0f0] rounded-[25px] rotate-[179.93deg]" />
            <Link to={`/detail/desk/66093cacd6f08499051b8340`}>
              <CircleStatus
                className="!absolute !w-[52px] !h-[48px] !top-0 !left-[30px]"
                onClick={() => handleDeskClick("66093cacd6f08499051b8340")}
                booked={deskBookingStatuses["66093cacd6f08499051b8340"]}
                isHighlighted={
                  clickedDeskId === "66093cacd6f08499051b8340" ||
                  searchContext.deskNumber === "33"
                }
              />
            </Link>
          </div>
          <div className="absolute w-[114px] h-[113px] top-[361px] left-[570px]">
            <div className="absolute w-[114px] h-[90px] top-[23px] left-0 bg-[#f1f0f0] rounded-[25px] rotate-[179.93deg]" />
            <Link to={`/detail/desk/66093cacd6f08499051b8341`}>
              <CircleStatus
                className="!absolute !w-[52px] !h-[48px] !top-0 !left-[25px]"
                onClick={() => handleDeskClick("66093cacd6f08499051b8341")}
                booked={deskBookingStatuses["66093cacd6f08499051b8341"]}
                isHighlighted={
                  clickedDeskId === "66093cacd6f08499051b8341" ||
                  searchContext.deskNumber === "34"
                }
              />
            </Link>
          </div>
          <div className="absolute w-[114px] h-[113px] top-[361px] left-[702px]">
            <div className="absolute w-[114px] h-[90px] top-[23px] left-0 bg-[#f1f0f0] rounded-[25px] rotate-[179.93deg]" />
            <Link to={`/detail/desk/66183ce549cd0d6a09f96586`}>
              <CircleStatus
                className="!absolute !w-[52px] !h-[48px] !top-0 !left-[30px]"
                onClick={() => handleDeskClick("66183ce549cd0d6a09f96586")}
                booked={deskBookingStatuses["66183ce549cd0d6a09f96586"]}
                isHighlighted={
                  clickedDeskId === "66183ce549cd0d6a09f96586" ||
                  searchContext.deskNumber === "35"
                }
              />
            </Link>
          </div>
          <div className="absolute w-[114px] h-[114px] top-[361px] left-[302px]">
            <div className="absolute w-[114px] h-[91px] top-[23px] left-0 bg-[#f1f0f0] rounded-[25px] rotate-[179.93deg]" />
            <Link to={`/detail/desk/66093cacd6f08499051b833e`}>
              <CircleStatus
                className="!absolute !w-[52px] !h-[48px] !top-0 !left-[33px]"
                onClick={() => handleDeskClick("66093cacd6f08499051b833f")}
                booked={deskBookingStatuses["66093cacd6f08499051b833f"]}
                isHighlighted={
                  clickedDeskId === "66093cacd6f08499051b833f" ||
                  searchContext.deskNumber === "32"
                }
              />
            </Link>
          </div>
          <div className="absolute w-[226px] h-[151px] top-[504px] left-[873px]">
            <div className="top-[3px] left-[2px] rotate-[-1.63deg] absolute w-[200px] h-[145px] bg-[#f1f0f0] rounded-[300px]" />
            {/* conference room 2*/}
            <Link to={`/detail/croom/660acec71ecd903d915deca4`}>
              <CircleStatus
                className="!absolute !w-[58px] !h-[54px] !top-[41px] !left-[169px]"
                onClick={() => handleCroomClick("660acec71ecd903d915deca4")}
                isHighlighted={clickedCroomId === "660acec71ecd903d915deca4"}
              />
            </Link>
          </div>
        </div>
      </div>
      {deskDetails && (
        <BookingSideBar desk={deskDetails} closeModal={closeModal} />
      )}
      {croomDetails && (
        <BookingSideBarCroom croom={croomDetails} closeModal={closeModal} />
      )}
    </div>
  );
};

export default Floor2;
