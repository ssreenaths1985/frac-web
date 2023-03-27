import React from "react";
import { shallow } from "enzyme";
import KnowledgeInfoContainer from "../KnowledgeInfoContainer";
const message = "No knowledge resource selected";

const knowledgeInfoContainerProps = {
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

let wrapped = shallow(<KnowledgeInfoContainer {...knowledgeInfoContainerProps}></KnowledgeInfoContainer>);

describe("KnowledgeInfoContainer", () => {
  it("should render the KnowledgeInfoContainer Component correctly", () => {
    expect(wrapped).toMatchSnapshot();
  });
  it("renders the KnowledgeInfoContainer children", () => {
    expect(wrapped.find("h1").text()).toEqual(message);
  });
});
