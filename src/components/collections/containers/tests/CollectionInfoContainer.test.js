import React from "react";
import { shallow } from "enzyme";
import CollectionContainer from "../CollectionContainer";
const message = "No collections selected";

const collectionContainerProps = {
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

let wrapped = shallow(<CollectionContainer {...collectionContainerProps}></CollectionContainer>);

describe("CollectionContainer", () => {
  it("should render the CollectionContainer Component correctly", () => {
    expect(wrapped).toMatchSnapshot();
  });
  it("renders the CollectionContainer children", () => {
    expect(wrapped.find("h1").text()).toEqual(message);
  });
});
