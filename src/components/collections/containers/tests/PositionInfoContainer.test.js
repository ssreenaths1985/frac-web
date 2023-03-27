import React from "react";
import { shallow } from "enzyme";
import PositionInfoContainer from "../PositionInfoContainer";
const message = "No position selected";

const positionInfoContainerProps = {
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

let wrapped = shallow(<PositionInfoContainer {...positionInfoContainerProps}></PositionInfoContainer>);

describe("PositionInfoContainer", () => {
  it("should render the PositionInfoContainer Component correctly", () => {
    expect(wrapped).toMatchSnapshot();
  });
  it("renders the PositionInfoContainer children", () => {
    expect(wrapped.find("h1").text()).toEqual(message);
  });
});
