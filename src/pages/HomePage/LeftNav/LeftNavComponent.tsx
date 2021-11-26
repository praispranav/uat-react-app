import { useState } from "react";
import DropDownListComponent from "./DropDownListComponent";
import "../../../scss/HomePageStyles/leftNavComponent.scss";
import { BiSearchAlt2 } from "react-icons/bi";
import { FiChevronDown } from "react-icons/fi";
import { Button } from "../../../styles-components/Button";
import { RoundedBadge } from "../../../styles-components/Badge";
import HomePageApi from "../../../config/homepageApis.json";
import { useQuery } from "../../../hooks/useQuery";
import { MapVariablesArray as IndiaStates } from "../Map/variables";

const INITIAL_SELECTED_STATE = {
  id: "none",
  name: "none",
};

const INITIAL_SELECTED_SECTOR = {
  sector: "",
  industryCount: 0,
  sectorCount: 0,
  totalCount: 0,
};

const INITIAL_SELECTED_STAGES = {
  stateName: "none",
  ideation: 0,
  validation: 0,
  earlyTraction: 0,
  scaling: 0,
  total: 0,
};

const LeftNavComponent = (props: any) => {
  const { setSelectedArea, selectedArea } = props;

  const [selectedState, setSelectedState] = useState<any>(
    INITIAL_SELECTED_STATE
  );
  const [selectedSector, setSelectedSector] = useState<any>(
    INITIAL_SELECTED_SECTOR
  );
  const [selectedStages, setSelectedStages] = useState<any>(
    INITIAL_SELECTED_STAGES
  );
  const [appliedSector, setAppliedSector] = useState<any>({});

  const [fetchSectors, sectorState, sectorLoading] = useQuery("");
  const [fetchStages, stagesState, stagesLoading] = useQuery("");

  const handleStateClick = (state: any) => {
    if (selectedState.id === state.id) {
      setSelectedArea({ id: "india", name: "India" });
      return setSelectedState(INITIAL_SELECTED_STATE);
    }
    setSelectedState(state);
  };

  const generateUrl = (a: string, b: string) => {
    return a + "/" + b.toLowerCase();
  };

  const onApplyState = () => {
    setSelectedArea(selectedState);
    fetchSectors(generateUrl(HomePageApi.sectorByState, selectedState.name));
    fetchStages(generateUrl(HomePageApi.stagesByState, selectedState.name));
  };

  const onApplySector = () => {
    setAppliedSector(selectedSector);
  };

  const oncancleClick = () => {};

  const handleSectorClick = (sectorObj: any) => {
    if (selectedSector.sector === sectorObj.sector) {
      return setSelectedSector(INITIAL_SELECTED_SECTOR);
    }
    setSelectedSector(sectorObj);
  };

  const stateApplied = Boolean(selectedState.id === selectedArea.id);
  const sectorApplied = Boolean(selectedState.id === selectedArea.id);

  return (
    <>
      <div className="left-side-nav-styles">
        <div className="px-2">
          <div className="row search-bar-row">
            <div className="rounded h-100 d-flex mx-0 px-0 search-bar">
              <span
                className="btn shadow-none border-0 m-0 pe-1 ps-4 "
                id="search-addon"
              >
                <BiSearchAlt2 size={17.06} />
              </span>
              <input
                type="search"
                className="form-control ps-2 search-bar-left"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="search-addon"
              />
            </div>
          </div>
          <div className="row mb-3 ps-2 pe-0 py-0 bg-white accordion accordion-flush dropdown-card" id="flush1">
            <div className="border-bottom-filter pt-2">
              <button
                className="btn shadow-none d-flex w-100 mx-0 px-0 align-items-center mt-1 collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapse1"
                aria-expanded="false"
                aria-controls="collapse1"
              >
                <FiChevronDown className="me-2" size={15} />
                States
                {stateApplied && (
                  <RoundedBadge className="ms-auto me-3">1</RoundedBadge>
                )}
                {stateApplied && (
                  <span className="count-text">{IndiaStates.length}</span>
                )}
                {!stateApplied && (
                  <span className="count-text ms-auto">
                    {IndiaStates.length}
                  </span>
                )}
              </button>
              <div className="collapse mt-2" id="collapse1" data-bs-parent="flush1">
                <DropDownListComponent
                  accessor={"name"}
                  data={IndiaStates}
                  loading={false}
                  handleClick={handleStateClick}
                  selectedItem={selectedState.name}
                  handleApplyClick={onApplyState}
                  dropDownId={"#collapse1"}
                  handleClearClick={() =>
                    setSelectedState(INITIAL_SELECTED_STATE)
                  }
                />
              </div>
            </div>
            <div className="border-bottom-filter pt-1">
              <button
                className="btn shadow-none collapsed d-flex w-100 mx-0 px-0 align-items-center mt-1"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapse2"
                aria-expanded="false"
                aria-controls="collapse2"
              >
                <FiChevronDown className="me-2" size={15} />
                Sector
                {selectedStages.stateName === appliedSector.sector && (
                  <RoundedBadge className="ms-auto me-3">1</RoundedBadge>
                )}
                {selectedStages.stateName === appliedSector.sector && (
                  <span className="count-text">{sectorState.length}</span>
                )}
                {!(selectedStages.stateName === appliedSector.sector) && (
                  <span className="count-text ms-auto">
                    {sectorState.length}
                  </span>
                )}
              </button>
              <div className="collapse mt-2" id="collapse2" data-bs-parent="flush1">
                <DropDownListComponent
                  accessor={"sector"}
                  data={sectorState}
                  loading={sectorLoading}
                  selectedItem={selectedSector.sector}
                  handleClick={handleSectorClick}
                  handleApplyClick={onApplySector}
                  dropDownId={"#collapse2"}
                  handleClearClick={() =>
                    setSelectedState(INITIAL_SELECTED_STATE)
                  }
                />
              </div>
            </div>
            <div className="border-bottom-filter pt-1">
              <button
                className="btn shadow-none collapsed d-flex w-100 mx-0 px-0 align-items-center mt-1"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapse3"
                aria-expanded="false"
                aria-controls="collapse3"
              >
                <FiChevronDown className="me-2" size={15} />
                Industry
                {/* {selectedStages.stateName === appliedSector.sector && (
                  <RoundedBadge className="ms-auto me-3">1</RoundedBadge>
                )}
                {selectedStages.stateName === appliedSector.sector && (
                  <span className="count-text">{sectorState.length}</span>
                )} */}
                {/* {!(selectedStages.stateName === appliedSector.sector) && ( */}
                  <span className="count-text ms-auto">
                    {0}
                  </span>
                {/* // )} */}
              </button>
              <div className="collapse mt-2" id="collapse3" data-bs-parent="flush1">
                <DropDownListComponent
                  accessor={"sector"}
                  data={[]}
                  loading={sectorLoading}
                  selectedItem={selectedSector.sector}
                  handleClick={handleSectorClick}
                  handleApplyClick={onApplySector}
                  dropDownId={"#collapse2"}
                  handleClearClick={() =>
                    setSelectedState(INITIAL_SELECTED_STATE)
                  }
                />
              </div>
            </div>
         
            <div className="border-bottom-filter pt-1">
              <button
                className="btn shadow-none d-flex collapsed w-100 mx-0 px-0 align-items-center mt-1"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapse4"
                aria-expanded="false"
                aria-controls="collapse4"
              >
                 <FiChevronDown className="me-2" size={15} />
                Stages
                {selectedStages.stateName === appliedSector.sector && (
                  <RoundedBadge className="ms-auto me-3">1</RoundedBadge>
                )}
                {selectedStages.stateName === appliedSector.sector && (
                  <span className="count-text">{sectorState.length}</span>
                )}
                {!(selectedStages.stateName === appliedSector.sector) && (
                  <span className="count-text ms-auto">
                    {sectorState.length}
                  </span>
                )}
              </button>
              <div className="collapse mt-2" id="collapse4">
                <DropDownListComponent
                  accessor={"stateName"}
                  data={sectorState}
                  loading={stagesLoading}
                  selectedItem={selectedStages.stateName}
                  handleClick={handleSectorClick}
                  handleApplyClick={onApplySector}
                  dropDownId={"#collapse4"}
                  handleClearClick={() =>
                    setSelectedState(INITIAL_SELECTED_STATE)
                  }
                />
              </div>
            </div>
            <div className="border-bottom-filter-last-element pt-1 pb-2">
              <button
                className="btn shadow-none d-flex w-100 collapsed mx-0 px-0 align-items-center"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapse5"
                aria-expanded="false"
                aria-controls="collapse5"
              >
                <FiChevronDown className="me-2" size={15} />
                Winner Badges
                <span className="ms-auto count-text">2</span>
              </button>
              <div className="collapse mt-2" id="collapse5">
                <div className="card card-body">
                  Some placeholder content for the collapse component. This
                  panel is hidden by default but revealed when the user
                  activates the relevant trigger.
                </div>
              </div>
            </div>
          </div>
          <div className="left-nav-bottom-card row bg-white pt-3 ">
            <h6 className="px-0 card-heading-left-bottom">
              {" "}
              VIEW STARTUP ECOSYSTEM INSIGHTS OF INDIA
            </h6>
            <span className="sub-heading px-0 mb-2 font-500">
              You can View Insights of India
            </span>
            <div className="btn-view-project mx-0 px-0">
              <Button>View Insights</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftNavComponent;