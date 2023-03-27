import React from "react";
import { shallow } from "enzyme";
import ActivitiesInfoContainer from "../ActivitiesInfoContainer";
const message = "No activity selected";

const activitiesInfoContainerProps = {
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

let wrapped = shallow(<ActivitiesInfoContainer {...activitiesInfoContainerProps}></ActivitiesInfoContainer>);

describe("ActivitiesInfoContainer", () => {
  it("should render the ActivitiesInfoContainer Component correctly", () => {
    expect(wrapped).toMatchSnapshot();
  });
  it("renders the ActivitiesInfoContainer children", () => {
    expect(wrapped.find("h1").text()).toEqual(message);
  });
});
