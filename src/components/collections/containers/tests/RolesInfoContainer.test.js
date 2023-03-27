import React from "react";
import { shallow } from "enzyme";
import RolesInfoContainer from "../RolesInfoContainer";
const message = "No role selected";

const rolesInfoContainerProps = {
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

let wrapped = shallow(
  <RolesInfoContainer {...rolesInfoContainerProps}></RolesInfoContainer>
);

describe("RolesInfoContainer", () => {
  it("should render the RolesInfoContainer Component correctly", () => {
    expect(wrapped).toMatchSnapshot();
  });
  it("renders the RolesInfoContainer children", () => {
    expect(wrapped.find("h1").text()).toEqual(message);
  });
});
