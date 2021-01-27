import styled from "styled-components";
import colors from "../styles/colors";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faSearch, faCircleNotch } from "@fortawesome/free-solid-svg-icons";

import { useCallback } from "react";

const HeaderDiv = styled.div`
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background-color: white;
  height: 62px;
  display: flex;
  align-items: center;
  padding: 10px;
  z-index: 11;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 0 1px rgba(1, 0, 0, 0.1);
`;

const Logo = styled.a`
  width: 64px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SearchBarDiv = styled.div`
  width: 100%;
  margin-left: 18px;
`;

const SearchBarForm = styled.form`
  height: 40px;
  border-radius: 24px;
  background-color: ${colors.lightGrey};
  border: 1px solid transparent;
  width: 80%;
  max-width: 500px;
  display: flex;
  align-items: center;
  padding-left: 10px;

  &:hover {
    border-color: ${colors.grey};
  }

  &:focus-within {
    background-color: white;
    border-color: ${colors.grey};
  }
`;

const HeaderRightEnd = styled.div`
  margin-right: 30px;
  justify-self: flex-end;
  font-weight: bold;
  letter-spacing: 15px;
  user-select: none;
`;

const SearchButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border-style: none;
  background: none;
  opacity: 0.6;
  color: ${colors.darkGrey};

  &:hover {
    color: black;
    cursor: pointer;
  }
`;

const SearchInput = styled.input`
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 450;
  width: 100%;
  padding-right: 10px;
  &:focus,
  &:active {
    outline: none;
  }
`;

export const Header = ({ searchCallback, resetData }) => {
  const searchSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const value = event.currentTarget.input.value;
      if (value !== "") {
        searchCallback(value);
      }
    },
    [searchCallback]
  );

  return (
    <HeaderDiv>
      <Logo
        children={
          <FontAwesomeIcon icon={faCircleNotch} style={{ fontSize: "35px" }} />
        }
        onClick={resetData}
      />
      <SearchBarDiv>
        <SearchBarForm
          onSubmit={(event) => {
            searchSubmit(event);
          }}
        >
          <SearchButton
            children={
              <FontAwesomeIcon icon={faSearch} style={{ fontSize: "15px" }} />
            }
            type="submit"
          />
          <SearchInput
            placeholder="Search photos"
            name="input"
            autoComplete="off"
          />
        </SearchBarForm>
      </SearchBarDiv>
      <HeaderRightEnd onClick={resetData}>ONSPLASH</HeaderRightEnd>
    </HeaderDiv>
  );
};
