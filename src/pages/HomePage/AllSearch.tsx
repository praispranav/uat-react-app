import * as React from "react";
import {
  SearchBarWrapper,
  SpanIcon,
  SearchBarInput,
} from "../../styles-components/SearchBar";
import { BiSearchAlt2 } from "react-icons/bi";
import styled, { ThemeContext } from "styled-components";
import { ThemeColorIdentifier } from "../../helper-function/themeColor";
import { Actions, current } from "@reduxjs/toolkit";
import { useHistory } from "react-router-dom";
import { arrayBuffer } from "stream/consumers";

export interface SearchBarTypes {
  filterState: any;
  setSearchBarExpanded: any;
  colorTheme: string;
  searchBarExpanded: boolean;
  actions: any;
}

const Badges = styled.div<any>(
  {
    borderRadius: "20px",
    padding: "0.5rem 1rem 0.5rem 1rem",
    width: "fit-content",
    fontFamily: "Poppins",
    fontWeight: "600",
    transition: "All 0.3s",
    fontSize: "12px",
  },
  (props) => {
    return {
      transition: "All 0.3s",
      color: props.active ? "white" : props.themeColor,
      background: props.active
        ? ThemeColorIdentifier(props.colorTheme)
        : props.theme,
    };
  }
);

function NoDataMessage() {
  const theme = React.useContext(ThemeContext);
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-muted opacity-5 h-100 transition"
      style={{ color: theme.sideSearch.color }}
    >
      No Result Found.
    </div>
  );
}

const ScrollableDiv = styled.div({
  width: "100%",
  overflowX: "scroll",
  overflowY: "hidden",
  cursor: "pointer",
  "&::-webkit-scrollbar": {
    height: "5px",
    display: "none",
  },
  "&::-webkit-scrollbar-track": {
    boxShadow: "inset 0 0 0px grey",
    borderRadius: "10px",
    height: "45px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#c4c4c4",
    borderRadius: "7px",
  },
});

const Hr = styled.div({
  width: "100%",
  height: "1px",
  background: "#DDDDDD",
});

const TYPES = ["All", "Sectors", "States", "Industries", "Stages"];

interface SelectorType {
  label: string;
  type: string;
  onClick?: any;
  obj: any;
  active: any[];
}

function Selector({ label, type, obj, onClick, active }: SelectorType) {
  const activeId = active.findIndex((i) => i === obj.id);
  const theme = React.useContext(ThemeContext);
  return (
    <div
      onClick={() => onClick(obj)}
      style={{ color: theme.sideSearch.color }}
      className={`d-flex justify-content-between transition text-hover ${
        activeId !== -1 ? "text-primary" : ""
      }`}
    >
      <p className="font-500 font-14px transition text-hover">{label}</p>
      <p className="opacity-5 font-14px">{type.toUpperCase()}</p>
    </div>
  );
}

interface KeyValuePair {
  id: string;
  value: string;
}

const VeriticallyScrollableDiv = styled.div({
  minHeight: "100px",
  maxHeight: "400px",
  overflowY: "scroll",
  overflowX: "hidden",
  "&::-webkit-scrollbar": {
    width: "5px",
    display: "none",
  },
  "&::-webkit-scrollbar-track": {
    boxShadow: "inset 0 0 0px grey",
    borderRadius: "10px",
    height: "45px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#c4c4c4",
    borderRadius: "7px",
  },
});

export default function SearchBar({
  searchBarExpanded,
  actions,
  filterState,
  colorTheme,
  setSearchBarExpanded,
}: SearchBarTypes) {
  const {
    handleSectorClick,
    onApplySector,
    handleStagesClick,
    onApplyStages,
    handleIndustryClick,
    onApplyIndustry,
    setAppliedFilters,
    appliedFilters,
  } = actions;
  const [searchText, setSearchText] = React.useState<string>("");
  const [activeFilterType, setActiveFilterType] = React.useState<string>(
    TYPES[0]
  );
  const history = useHistory();
  const theme = React.useContext(ThemeContext);
  const [allTypeDisplayLimit, setAllTypeDisplayLimit] = React.useState(3);

  const applyState = (state: any) =>
    history.push(`/?id=${state.id}&state=${state.value}`);

  const applyStages = (stage: any) =>
    setAppliedFilters((prev: any) => {
      const currentStages = [...prev.stages];
      const index = findIndex(currentStages, stage.id);
      if (index === -1) currentStages.push(stage.id);
      else currentStages.splice(index, 1);
      return { ...prev, stages: currentStages };
    });

  const findIndex = (array: any[], id: string) =>
    array.findIndex((i: any) => i === id);

  const applySector = (sector: any) =>
    setAppliedFilters((prev: any) => {
      const currentSectors = [...prev.sectors];
      const index = findIndex(currentSectors, sector.id);
      if (index === -1) currentSectors.push(sector.id);
      else currentSectors.splice(index, 1);
      return { ...prev, sectors: currentSectors };
    });

  const applyIndustry = (industry: any) =>
    setAppliedFilters((prev: any) => {
      const currentIndustries = [...prev.industries];
      const index = findIndex(currentIndustries, industry.id);
      if (index === -1) currentIndustries.push(industry.id);
      else currentIndustries.splice(index, 1);
      return { ...prev, industries: currentIndustries };
    });

  const handleSearchTextChange = (changeEvent: any) => {
    const value = changeEvent.target.value;
    setSearchBarExpanded(value.length > 0);
    setSearchText(value);
  };

  const states = filterState.states
    .filter(
      (i: KeyValuePair) =>
        i.value.toLowerCase().includes(searchText.toLowerCase()) ||
        i.id == searchText
    )
    .slice(0, allTypeDisplayLimit)
    .sort((a: KeyValuePair, b: KeyValuePair) => a.value.localeCompare(b.value));

  const sectors = filterState.sectors
    .filter(
      (i: KeyValuePair) =>
        i.value.toLowerCase().includes(searchText.toLowerCase()) ||
        i.id == searchText
    )
    .slice(0, allTypeDisplayLimit)
    .sort((a: KeyValuePair, b: KeyValuePair) => a.value.localeCompare(b.value));

  const industries = filterState.industries
    .filter(
      (i: KeyValuePair) =>
        i.value.toLowerCase().includes(searchText.toLowerCase()) ||
        i.id == searchText
    )
    .slice(0, allTypeDisplayLimit)
    .sort((a: KeyValuePair, b: KeyValuePair) => a.value.localeCompare(b.value));
  const stages = filterState.stages
    .filter(
      (i: KeyValuePair) =>
        i.value.toLowerCase().includes(searchText.toLowerCase()) ||
        i.id == searchText
    )
    .slice(0, allTypeDisplayLimit)
    .sort((a: KeyValuePair, b: KeyValuePair) => a.value.localeCompare(b.value));

  const handleTabClick = (name: string) => {
    if (name === "All") setAllTypeDisplayLimit(3);
    else setAllTypeDisplayLimit(filterState[name.toLowerCase()].length);
    setActiveFilterType(name);
  };

  const showMoreData = () => setAllTypeDisplayLimit((prev) => prev + 3);
  return (
    <div
      className="row search-bar-row"
      style={{
        boxShadow: "0px 0px 10px rgb(193 193 193 / 25%)",
        background: theme.sideSearch.background,
      }}
    >
      <SearchBarWrapper className="rounded h-100 d-flex mx-0 px-0 search-bar">
        <SpanIcon
          className="btn shadow-none border-0 m-0 pe-1 ps-4 "
          id="search-addon"
        >
          <BiSearchAlt2 size={17.06} style={{ marginBottom: "3px" }} />
        </SpanIcon>
        <SearchBarInput
          type="search"
          value={searchText}
          className="form-control ps-2"
          placeholder="Search"
          aria-label="Search"
          aria-describedby="search-addon"
          onChange={handleSearchTextChange}
        />
      </SearchBarWrapper>
      {searchBarExpanded ? (
        <ScrollableDiv
          className="d-inline-flex p-3 py-2"
          style={{ background: theme.sideSearch.background }}
        >
          {TYPES.map((name) => (
            <Badges
              theme={theme.sideSearch.background}
              themeColor={theme.sideSearch.color}
              colorTheme={colorTheme}
              onClick={() => handleTabClick(name)}
              active={activeFilterType === name}
            >
              {name}
            </Badges>
          ))}
        </ScrollableDiv>
      ) : (
        <></>
      )}
      {searchBarExpanded ? (
        <div className="px-3">
          <Hr />
        </div>
      ) : (
        <></>
      )}
      {searchBarExpanded && activeFilterType === TYPES[0] ? (
        <VeriticallyScrollableDiv
          className="px-3"
          style={{ background: theme.sideSearch.background }}
        >
          <div
            className="pt-3"
            style={{ background: theme.sideSearch.background }}
          >
            {states.map((i: any) => (
              <Selector
                obj={i}
                label={i.value}
                active={appliedFilters.states}
                onClick={applyState}
                type="State"
                key={i.id}
              />
            ))}
          </div>

          {states.length === 0 ? <></> : <Hr />}
          <div
            className="pt-3"
            style={{ background: theme.sideSearch.background }}
          >
            {sectors.map((i: any) => (
              <Selector
                obj={i}
                label={i.value}
                active={appliedFilters.sectors}
                onClick={applySector}
                type="Sectors"
                key={i.id}
              />
            ))}
          </div>
          {sectors.length === 0 ? <></> : <Hr />}
          <div
            className="pt-3"
            style={{ background: theme.sideSearch.background }}
          >
            {industries.map((i: any) => (
              <Selector
                obj={i}
                label={i.value}
                active={appliedFilters.industries}
                onClick={applyIndustry}
                type="Industries"
                key={i.id}
              />
            ))}
          </div>
          {states.length > allTypeDisplayLimit || sectors.length > allTypeDisplayLimit || industries.length > allTypeDisplayLimit ? (
            <p
              className="text-primary cursor-pointer text-center font-600 font-12px font-Mont"
              onClick={showMoreData}
            >
              View More
            </p>
          ) : (
            <></>
          )}
        </VeriticallyScrollableDiv>
      ) : (
        <></>
      )}

      {searchBarExpanded && activeFilterType === "Sectors" ? (
        <VeriticallyScrollableDiv className="pt-3 px-3">
          {sectors.length === 0 ? <NoDataMessage /> : <></>}
          {sectors.map((i: any) => (
            <Selector
              obj={i}
              label={i.value}
              active={appliedFilters.sectors}
              onClick={applySector}
              type=""
              key={i.id}
            />
          ))}
        </VeriticallyScrollableDiv>
      ) : (
        <></>
      )}

      {searchBarExpanded && activeFilterType === "States" ? (
        <VeriticallyScrollableDiv
          className="pt-3 px-3"
          style={{ background: theme.sideSearch.background }}
        >
          {states.length === 0 ? <NoDataMessage /> : <></>}
          {states.map((i: any) => (
            <Selector
              obj={i}
              active={appliedFilters.states}
              onClick={applyState}
              label={i.value}
              type=""
              key={i.id}
            />
          ))}
        </VeriticallyScrollableDiv>
      ) : (
        <></>
      )}

      {searchBarExpanded && activeFilterType === "Industries" ? (
        <VeriticallyScrollableDiv
          className="pt-3 px-3"
          style={{ background: theme.sideSearch.background }}
        >
          {industries.length === 0 ? <NoDataMessage /> : <></>}
          {industries.map((i: any) => (
            <Selector
              obj={i}
              label={i.value}
              type=""
              active={appliedFilters.industries}
              onClick={applyIndustry}
              key={i.id}
            />
          ))}
        </VeriticallyScrollableDiv>
      ) : (
        <></>
      )}
      {searchBarExpanded && activeFilterType === "Stages" ? (
        <VeriticallyScrollableDiv
          className="pt-3 px-3"
          style={{ background: theme.sideSearch.background }}
        >
          {stages.length === 0 ? <NoDataMessage /> : <></>}
          {stages.map((i: any) => (
            <Selector
              obj={i}
              label={i.value}
              onClick={applyStages}
              type=""
              active={appliedFilters.stages}
              key={i.id}
            />
          ))}
        </VeriticallyScrollableDiv>
      ) : (
        <></>
      )}
    </div>
  );
}
