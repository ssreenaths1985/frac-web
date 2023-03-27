import React from "react";
import { shallow } from "enzyme";
import CompetenciesInfoContainer from "../CompetenciesInfoContainer";
const message = "No competency selected";

const competenciesInfoContainerProps = {
  history: {
    location: {
      pathname: "/collections",
      search: "",
      hash: "",
      state: null,
      key: "zgfeb7",
    },
  },
  handleClick: () => {
    console.log("click");
  },
};

let wrapped = shallow(<CompetenciesInfoContainer {...competenciesInfoContainerProps}></CompetenciesInfoContainer>);

describe("CompetenciesInfoContainer", () => {
  it("should render the CompetenciesInfoContainer Component correctly", () => {
    expect(wrapped).toMatchSnapshot();
  });
  it("renders the CompetenciesInfoContainer children", () => {
    expect(wrapped.find("h1").text()).toEqual(message);
  });
});
