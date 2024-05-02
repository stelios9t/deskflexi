import React, { useState, useEffect } from "react";
import { CircleStatus } from "../../icons/Property1Status";
import wall from "../../static/img/wall.svg";
import wall1 from "../../static/img/wall-1.svg";
import wall2 from "../../static/img/wall-2.svg";
import wall3 from "../../static/img/wall-3.svg";
import wall4 from "../../static/img/wall-4.svg";
import wall5 from "../../static/img/wall-5.svg";
import wall7 from "../../static/img/wall-7.svg";
import wall8 from "../../static/img/wall-8.svg";
import wall9 from "../../static/img/wall-9.svg";
import wall10 from "../../static/img/wall-10.svg";
import wall7_1 from "../../static/img/wall7-1.svg";
import wall7_2 from "../../static/img/wall7-2.svg";
import wall8_1 from "../../static/img/wall8-1.svg";
import wall8_2 from "../../static/img/wall8-2.svg";
import wall10_1 from "../../static/img/wall10-1.svg";
import wall10_2 from "../../static/img/wall10-2.svg";
import wall1_1 from "../../static/img/wall1-1.svg";
import { useSearchContext } from "../../../../contexts/SearchContext";
import "./styles.css";
import * as apiClient from "../../../../api-client.js";
import BookingSideBar from "../../../BookingSideBar.jsx";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAppContext } from "../../../../contexts/AppContext.jsx";
import LoadingSpinner from "../../../LoadingSpinner.jsx";
import BookingSideBarCroom from "../../../BookingSideBarCroom.jsx";

const Floor1 = () => {
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
    const fetchDesksAndCheckBookingStatus = async () => {
      setIsLoading(true);

      const deskIds = [
        "65a07f48115b7831f3159bd8",
        "65a081a3115b7831f3159bda",
        "65a08294887a3d9fbafa757f",
        "65a0835d09608f2807261722",
        "65a0d1727f4b053a98843063",
        "65a9a7f4a1eb2ae59b6a9a7a",
        "65a9a85aa1eb2ae59b6a9a7c",
        "65a9b4f145ab9528aadbb1b3",
        "65aa516fd3936b23cca320e9",
        "65aa6267322f4036e5a32b7b",
        "65c27ca43b5db922c67edaf8",
        "65c3df23ee51fb98ffa81d7e",
        "65c61204135b27229cdbde8d",
        "65d5f3cac19e4599d44374b5",
        "65de12d669d7ce6d86d1e11e",
        "65fae2958459d17e640a076e",
        "65fae2a68459d17e640a0773",
        "65fae2ad8459d17e640a0775",
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
            if (data[0].floor === searchContext.floor) {
              navigate(`/detail/desk/${data[0]._id}`);
              setDeskDetails(data[0]);
              setCroomDetails(null);
              setClickedDeskId(data[0]._id);
            } else {
              showToast({
                message: "No such desk number on this floor",
                type: "ERROR",
              });
              setDeskDetails(null);
              setCroomDetails(null);
              setClickedDeskId(null);
            }
          } else {
            setDeskDetails(null);
            setCroomDetails(null);
            setClickedDeskId(null);
          }
        } catch (error) {
          console.error("Error searching for desks:", error.message);
          setDeskDetails(null);
          setCroomDetails(null);
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
    showToast,
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
        <div className="relative w-[1280px] h-[682px] top-[21px] left-[48px]">
          <div className="absolute w-[248px] h-[115px] top-[49px] left-[318px]">
            <div className="absolute w-[114px] h-[90px] top-[13px] left-[19px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <Link to={`/detail/desk/65a07f48115b7831f3159bd8`}>
              <CircleStatus
                onClick={() => handleDeskClick("65a07f48115b7831f3159bd8")}
                className="!absolute !w-[48px] !h-[53px] !top-[33px] !left-0"
                booked={deskBookingStatuses["65a07f48115b7831f3159bd8"]}
                isHighlighted={
                  clickedDeskId === "65a07f48115b7831f3159bd8" ||
                  searchContext.deskNumber === "1"
                }
              />
            </Link>
            <div className="absolute w-[114px] h-[91px] top-[12px] left-[116px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <Link to={`/detail/desk/65a081a3115b7831f3159bda`}>
              <CircleStatus
                onClick={() => handleDeskClick("65a081a3115b7831f3159bda")}
                className="!absolute !w-[48px] !h-[53px] !top-[28px] !left-[193px]"
                booked={deskBookingStatuses["65a081a3115b7831f3159bda"]}
                isHighlighted={
                  clickedDeskId === "65a081a3115b7831f3159bda" ||
                  searchContext.deskNumber === "2"
                }
              />
            </Link>
          </div>
          <div className="absolute w-[241px] h-[115px] top-[185px] left-[318px]">
            <div className="absolute w-[114px] h-[90px] top-[13px] left-[19px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <Link to={`/detail/desk/65a08294887a3d9fbafa757f`}>
              <CircleStatus
                className="!absolute !w-[48px] !h-[53px] !top-[31px] !left-0"
                isHighlighted={
                  clickedDeskId === "65a08294887a3d9fbafa757f" ||
                  searchContext.deskNumber === "3"
                }
                booked={deskBookingStatuses["65a08294887a3d9fbafa757f"]}
                onClick={() => handleDeskClick("65a08294887a3d9fbafa757f")}
              />
            </Link>
            <div className="absolute w-[114px] h-[91px] top-[12px] left-[116px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />

            <Link to={`/detail/desk/65a0835d09608f2807261722`}>
              <CircleStatus
                className="!absolute !w-[48px] !h-[53px] !top-[31px] !left-[193px]"
                isHighlighted={
                  clickedDeskId === "65a0835d09608f2807261722" ||
                  searchContext.deskNumber === "4"
                }
                booked={deskBookingStatuses["65a0835d09608f2807261722"]}
                onClick={() => handleDeskClick("65a0835d09608f2807261722")}
              />
            </Link>
          </div>
          <div className="absolute w-[241px] h-[115px] top-[312px] left-[318px]">
            <div className="absolute w-[114px] h-[90px] top-[13px] left-[19px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <div className="absolute w-[114px] h-[91px] top-[12px] left-[116px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />

            <Link to={`/detail/desk/65a9a7f4a1eb2ae59b6a9a7a`}>
              <CircleStatus
                className="!absolute !w-[48px] !h-[52px] !top-[31px] !left-[193px]"
                isHighlighted={
                  clickedDeskId === "65a9a7f4a1eb2ae59b6a9a7a" ||
                  searchContext.deskNumber === "6"
                }
                booked={deskBookingStatuses["65a9a7f4a1eb2ae59b6a9a7a"]}
                onClick={() => handleDeskClick("65a9a7f4a1eb2ae59b6a9a7a")}
              />
            </Link>
            <Link to={`/detail/desk/65a0d1727f4b053a98843063`}>
              <CircleStatus
                className="!absolute !w-[48px] !h-[53px] !top-[31px] !left-0"
                isHighlighted={
                  clickedDeskId === "65a0d1727f4b053a98843063" ||
                  searchContext.deskNumber === "5"
                }
                booked={deskBookingStatuses["65a0d1727f4b053a98843063"]}
                onClick={() => handleDeskClick("65a0d1727f4b053a98843063")}
              />
            </Link>
          </div>
          <div className="absolute w-[241px] h-[115px] top-[448px] left-[318px]">
            <div className="absolute w-[114px] h-[90px] top-[13px] left-[19px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />

            <Link to={`/detail/desk/65a9a85aa1eb2ae59b6a9a7c`}>
              <CircleStatus
                className="!absolute !w-[48px] !h-[53px] !top-[31px] !left-0"
                isHighlighted={
                  clickedDeskId === "65a9a85aa1eb2ae59b6a9a7c" ||
                  searchContext.deskNumber === "7"
                }
                booked={deskBookingStatuses["65a9a85aa1eb2ae59b6a9a7c"]}
                onClick={() => handleDeskClick("65a9a85aa1eb2ae59b6a9a7c")}
              />
            </Link>
            <div className="absolute w-[114px] h-[91px] top-[12px] left-[116px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <Link to={`/detail/desk/65a9b4f145ab9528aadbb1b3`}>
              <CircleStatus
                className="!absolute !w-[48px] !h-[52px] !top-[31px] !left-[193px]"
                isHighlighted={
                  clickedDeskId === "65a9b4f145ab9528aadbb1b3" ||
                  searchContext.deskNumber === "8"
                }
                booked={deskBookingStatuses["65a9b4f145ab9528aadbb1b3"]}
                onClick={() => handleDeskClick("65a9b4f145ab9528aadbb1b3")}
              />
            </Link>
          </div>
          <div className="absolute w-[241px] h-[115px] top-[50px] left-[610px]">
            <div className="absolute w-[114px] h-[90px] top-[13px] left-[19px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <Link to={`/detail/desk/65aa516fd3936b23cca320e9`}>
              <CircleStatus
                className="!absolute !w-[48px] !h-[53px] !top-[33px] !left-0"
                isHighlighted={
                  clickedDeskId === "65aa516fd3936b23cca320e9" ||
                  searchContext.deskNumber === "9"
                }
                booked={deskBookingStatuses["65aa516fd3936b23cca320e9"]}
                onClick={() => handleDeskClick("65aa516fd3936b23cca320e9")}
              />
            </Link>
            <div className="absolute w-[114px] h-[91px] top-[12px] left-[116px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <Link to={`/detail/desk/65aa6267322f4036e5a32b7b`}>
              <CircleStatus
                className="!absolute !w-[48px] !h-[53px] !top-[33px] !left-[193px]"
                isHighlighted={
                  clickedDeskId === "65aa6267322f4036e5a32b7b" ||
                  searchContext.deskNumber === "10"
                }
                booked={deskBookingStatuses["65aa6267322f4036e5a32b7b"]}
                onClick={() => handleDeskClick("65aa6267322f4036e5a32b7b")}
              />
            </Link>
          </div>
          <div className="absolute w-[241px] h-[114px] top-[187px] left-[610px]">
            <div className="absolute w-[114px] h-[90px] top-[12px] left-[19px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <Link to={`/detail/desk/65c27ca43b5db922c67edaf8`}>
              <CircleStatus
                className="!absolute !w-[48px] !h-[53px] !top-[30px] !left-0"
                isHighlighted={
                  clickedDeskId === "65c27ca43b5db922c67edaf8" ||
                  searchContext.deskNumber === "11"
                }
                booked={deskBookingStatuses["65c27ca43b5db922c67edaf8"]}
                onClick={() => handleDeskClick("65c27ca43b5db922c67edaf8")}
              />
            </Link>
            <div className="absolute w-[114px] h-[90px] top-[12px] left-[115px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <Link to={`/detail/desk/65c3df23ee51fb98ffa81d7e`}>
              <CircleStatus
                className="!absolute !w-[48px] !h-[53px] !top-[30px] !left-[193px]"
                isHighlighted={
                  clickedDeskId === "65c3df23ee51fb98ffa81d7e" ||
                  searchContext.deskNumber === "12"
                }
                booked={deskBookingStatuses["65c3df23ee51fb98ffa81d7e"]}
                onClick={() => handleDeskClick("65c3df23ee51fb98ffa81d7e")}
              />
            </Link>
          </div>
          <div className="absolute w-[241px] h-[118px] top-[314px] left-[610px]">
            <div className="absolute w-[114px] h-[90px] top-[12px] left-[19px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <div className="absolute w-[114px] h-[90px] top-[16px] left-[116px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <Link to={`/detail/desk/65d5f3cac19e4599d44374b5`}>
              <CircleStatus
                className="!absolute !w-[48px] !h-[53px] !top-[29px] !left-[193px]"
                isHighlighted={
                  clickedDeskId === "65d5f3cac19e4599d44374b5" ||
                  searchContext.deskNumber === "14"
                }
                booked={deskBookingStatuses["65d5f3cac19e4599d44374b5"]}
                onClick={() => handleDeskClick("65d5f3cac19e4599d44374b5")}
              />
            </Link>
            <Link to={`/detail/desk/65c61204135b27229cdbde8d`}>
              <CircleStatus
                className="!absolute !w-[48px] !h-[53px] !top-[30px] !left-0"
                isHighlighted={
                  clickedDeskId === "65c61204135b27229cdbde8d" ||
                  searchContext.deskNumber === "13"
                }
                booked={deskBookingStatuses["65c61204135b27229cdbde8d"]}
                onClick={() => handleDeskClick("65c61204135b27229cdbde8d")}
              />
            </Link>
          </div>
          <div className="absolute w-[241px] h-[114px] top-[450px] left-[610px]">
            <div className="absolute w-[114px] h-[90px] top-[12px] left-[19px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <div className="absolute w-[114px] h-[90px] top-[12px] left-[116px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <Link to={`/detail/desk/65de12d669d7ce6d86d1e11e`}>
              <CircleStatus
                className="!absolute !w-[48px] !h-[52px] !top-[30px] !left-0"
                isHighlighted={
                  clickedDeskId === "65de12d669d7ce6d86d1e11e" ||
                  searchContext.deskNumber === "15"
                }
                booked={deskBookingStatuses["65de12d669d7ce6d86d1e11e"]}
                onClick={() => handleDeskClick("65de12d669d7ce6d86d1e11e")}
              />
            </Link>
            <Link to={`/detail/desk/65fae2958459d17e640a076e`}>
              <CircleStatus
                className="!absolute !w-[48px] !h-[52px] !top-[30px] !left-[193px]"
                isHighlighted={
                  clickedDeskId === "65fae2958459d17e640a076e" ||
                  searchContext.deskNumber === "16"
                }
                booked={deskBookingStatuses["65fae2958459d17e640a076e"]}
                onClick={() => handleDeskClick("65fae2958459d17e640a076e")}
              />
            </Link>
          </div>
          <div className="absolute w-[263px] top-[322px] left-[1103px] rotate-[-90.00deg] [font-family:'Inter',Helvetica] font-normal text-[#f1f0f0] text-[36px] text-center tracking-[0] leading-[normal]">
            ENTRANCE
          </div>

          <img
            className="absolute w-[1042px] h-[10px] top-0 left-[238px]"
            alt="Wall"
            src={wall}
          />
          <img
            className="absolute w-[11px] h-[87px] top-0 left-[235px]"
            alt="Wall"
            src={wall2}
          />
          <img
            className="absolute w-[235px] h-[10px] top-[78px] left-[10px]"
            alt="Wall"
            src={wall3}
          />
          <img
            className="absolute w-[103px] h-[604px] top-[78px] left-0"
            alt="Wall"
            src={wall4}
          />
          <img
            className="absolute w-[1188px] h-[10px] top-[670px] left-[92px]"
            alt="Wall"
            src={wall5}
          />
          <img
            className="absolute w-[195px] h-[5px] top-[475px] left-[71px]"
            alt="Wall"
            src={wall1_1}
          />
          <img
            className="absolute w-[23px] h-[117px] top-[364px] left-[243px]"
            alt="Wall"
            src={wall10_2}
          />
          <img
            className="absolute w-[28px] h-[151px] top-[530px] left-[266px]"
            alt="Wall"
            src={wall10_1}
          />
          <img
            className="absolute w-[198px] h-[5px] top-[327px] left-[40px]"
            alt="Wall"
            src={wall1}
          />
          <img
            className="absolute w-[36px] h-[199px] top-[134px] left-[203px]"
            alt="Wall"
            src={wall10}
          />
          <img
            className="absolute w-[5px] h-[29px] top-[644px] left-[1131px]"
            alt="Wall"
            src={wall9}
          />
          <img
            className="absolute w-[525px] h-[9px] top-[583px] left-[278px]"
            alt="Wall"
            src={wall8}
          />
          <div className="absolute w-[200px] h-[145px] top-[143px] left-[23px] bg-[#f1f0f0] rounded-[300px] rotate-[-98.78deg]" />
          {/* conference room */}
          <Link to={`/detail/croom/660a7bd61ecd903d915debab`}>
            <CircleStatus
              className="!absolute !w-[48px] !h-[52px] !top-[96px] !left-[80px]"
              onClick={() => handleCroomClick("660a7bd61ecd903d915debab")}
              isHighlighted={clickedCroomId === "660a7bd61ecd903d915debab"}
            />
          </Link>
          <div className="absolute w-[114px] h-[90px] top-[353px] left-[119px] bg-[#f1f0f0] rounded-[25px] rotate-[-98.78deg]" />
          <Link to={`/detail/desk/65fae2a68459d17e640a0773`}>
            <CircleStatus
              className="!absolute !w-[59px] !h-[55px] !top-[370px] !left-[94px]"
              isHighlighted={
                clickedDeskId === "65fae2a68459d17e640a0773" ||
                searchContext.deskNumber === "17"
              }
              booked={deskBookingStatuses["65fae2a68459d17e640a0773"]}
              onClick={() => handleDeskClick("65fae2a68459d17e640a0773")}
            />
          </Link>

          <img
            className="absolute w-[5px] h-[106px] top-[500px] left-[1131px]"
            alt="Wall"
            src={wall7_2}
          />
          <img
            className="h-[185px] top-[44px] left-[1139px] absolute w-[5px]"
            alt="Wall"
            src={wall7_1}
          />
          <img
            className="w-[145px] top-[495px] left-[1133px] absolute h-[5px]"
            alt="Wall"
            src={wall8_2}
          />
          <img
            className="w-[134px] top-[224px] left-[1144px] absolute h-[5px]"
            alt="Wall"
            src={wall8_1}
          />
          <img
            className="h-[52px] top-[592px] left-[798px] absolute w-[5px]"
            alt="Wall"
            src={wall7}
          />
          <div className="absolute w-[135px] h-[126px] top-[541px] left-[108px]">
            <div className="absolute w-[114px] h-[90px] top-[18px] left-[25px] bg-[#f1f0f0] rounded-[25px] rotate-[-98.78deg]" />
            <Link to={`/detail/desk/65fae2ad8459d17e640a0775`}>
              <CircleStatus
                className="!absolute !w-[59px] !h-[55px] !top-[46px] !left-0"
                isHighlighted={
                  clickedDeskId === "65fae2ad8459d17e640a0775" ||
                  searchContext.deskNumber === "18"
                }
                booked={deskBookingStatuses["65fae2ad8459d17e640a0775"]}
                onClick={() => handleDeskClick("65fae2ad8459d17e640a0775")}
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

export default Floor1;
