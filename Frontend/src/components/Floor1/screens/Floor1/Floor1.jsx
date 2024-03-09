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

const Floor1 = () => {
  const [deskDetails, setDeskDetails] = useState(null);
  const [clickedDeskId, setClickedDeskId] = useState(null);
  const navigate = useNavigate();
  const searchContext = useSearchContext();
  const { showToast } = useAppContext();
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
            navigate(`/detail/${data[0]._id}`);
            setDeskDetails(data[0]);
          } else {
            setDeskDetails(null);
            showToast({
              message: "Desk number does not exists",
              type: "ERROR",
            });
          }
        } catch (error) {
          console.error("Error searching for desks:", error.message);
          setDeskDetails(null);
        }
      } else {
        setDeskDetails(null);
      }
    };

    searchForDesk();
  }, [
    searchContext.deskNumber,
    searchContext.checkIn,
    searchContext.checkOut,
    searchContext.floor,
    navigate,
  ]);

  const handleDeskClick = async (deskId) => {
    try {
      const deskDetailsData = await apiClient.fetchDeskById(deskId);
      setDeskDetails(deskDetailsData);
      setClickedDeskId(deskId);
    } catch (error) {
      console.error("Error fetching desk details:", error.message);
    }
  };
  const closeModal = () => {
    setDeskDetails(null);
    searchContext.clearSearch();
    setClickedDeskId(null);

    navigate("/search");
  };
  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-[1328px] h-[740px]">
        <div className="relative w-[1280px] h-[682px] top-[21px] left-[48px]">
          <div className="absolute w-[248px] h-[115px] top-[49px] left-[318px]">
            <div className="absolute w-[114px] h-[90px] top-[13px] left-[19px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <Link to={`/detail/65a07f48115b7831f3159bd8`}>
              <CircleStatus
                onClick={() => handleDeskClick("65a07f48115b7831f3159bd8")}
                className="!absolute !w-[48px] !h-[53px] !top-[33px] !left-0"
                isHighlighted={
                  clickedDeskId === "65a07f48115b7831f3159bd8" ||
                  searchContext.deskNumber === "1"
                }
              />
            </Link>
            <div className="absolute w-[114px] h-[91px] top-[12px] left-[116px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <CircleStatus
              onClick={() => handleDeskClick("65a081a3115b7831f3159bda")}
              className="!absolute !w-[48px] !h-[53px] !top-[28px] !left-[193px]"
              isHighlighted={
                clickedDeskId === "65a081a3115b7831f3159bda" ||
                searchContext.deskNumber === "2"
              }
            />
          </div>
          <div className="absolute w-[241px] h-[115px] top-[185px] left-[318px]">
            <div className="absolute w-[114px] h-[90px] top-[13px] left-[19px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <CircleStatus className="!absolute !w-[48px] !h-[53px] !top-[31px] !left-0" />
            <div className="absolute w-[114px] h-[91px] top-[12px] left-[116px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <CircleStatus className="!absolute !w-[48px] !h-[53px] !top-[31px] !left-[193px]" />
          </div>
          <div className="absolute w-[241px] h-[115px] top-[312px] left-[318px]">
            <div className="absolute w-[114px] h-[90px] top-[13px] left-[19px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <div className="absolute w-[114px] h-[91px] top-[12px] left-[116px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <CircleStatus className="!absolute !w-[48px] !h-[52px] !top-[31px] !left-[193px]" />
            <CircleStatus className="!absolute !w-[48px] !h-[53px] !top-[31px] !left-0" />
          </div>
          <div className="absolute w-[241px] h-[115px] top-[448px] left-[318px]">
            <div className="absolute w-[114px] h-[90px] top-[13px] left-[19px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <CircleStatus className="!absolute !w-[48px] !h-[52px] !top-[31px] !left-0" />
            <div className="absolute w-[114px] h-[91px] top-[12px] left-[116px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <CircleStatus className="!absolute !w-[48px] !h-[52px] !top-[31px] !left-[193px]" />
          </div>
          <div className="absolute w-[241px] h-[115px] top-[50px] left-[610px]">
            <div className="absolute w-[114px] h-[90px] top-[13px] left-[19px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <CircleStatus className="!absolute !w-[48px] !h-[53px] !top-[33px] !left-0" />
            <div className="absolute w-[114px] h-[91px] top-[12px] left-[116px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <CircleStatus className="!absolute !w-[48px] !h-[53px] !top-[33px] !left-[193px]" />
          </div>
          <div className="absolute w-[241px] h-[114px] top-[187px] left-[610px]">
            <div className="absolute w-[114px] h-[90px] top-[12px] left-[19px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <CircleStatus className="!absolute !w-[48px] !h-[53px] !top-[30px] !left-0" />
            <div className="absolute w-[114px] h-[90px] top-[12px] left-[115px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <CircleStatus className="!absolute !w-[48px] !h-[53px] !top-[30px] !left-[193px]" />
          </div>
          <div className="absolute w-[241px] h-[118px] top-[314px] left-[610px]">
            <div className="absolute w-[114px] h-[90px] top-[12px] left-[19px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <div className="absolute w-[114px] h-[90px] top-[16px] left-[116px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <CircleStatus className="!absolute !w-[48px] !h-[53px] !top-[29px] !left-[193px]" />
            <CircleStatus className="!absolute !w-[48px] !h-[53px] !top-[30px] !left-0" />
          </div>
          <div className="absolute w-[241px] h-[114px] top-[450px] left-[610px]">
            <div className="absolute w-[114px] h-[90px] top-[12px] left-[19px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <div className="absolute w-[114px] h-[90px] top-[12px] left-[116px] bg-[#f1f0f0] rounded-[25px] -rotate-90" />
            <CircleStatus className="!absolute !w-[48px] !h-[52px] !top-[30px] !left-0" />
            <CircleStatus className="!absolute !w-[48px] !h-[52px] !top-[30px] !left-[193px]" />
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
          <CircleStatus className="!absolute !w-[48px] !h-[52px] !top-[96px] !left-[80px]" />
          <div className="absolute w-[114px] h-[90px] top-[353px] left-[119px] bg-[#f1f0f0] rounded-[25px] rotate-[-98.78deg]" />
          <CircleStatus className="!absolute !w-[59px] !h-[55px] !top-[370px] !left-[94px]" />

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
            <CircleStatus className="!absolute !w-[59px] !h-[55px] !top-[46px] !left-0" />
          </div>
        </div>
      </div>
      {deskDetails && (
        <BookingSideBar desk={deskDetails} closeModal={closeModal} />
      )}
    </div>
  );
};

export default Floor1;
