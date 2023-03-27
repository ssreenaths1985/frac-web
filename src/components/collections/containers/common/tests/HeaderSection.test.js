import React from "react";
import { shallow } from "enzyme";
import HeaderSection from "../HeaderSection";

const headerProps = {
  history: {
    location: {
      pathname: "/collections",
      search: "",
      hash: "",
      state: null,
      key: "zgfeb7",
    },
  },
};

let wrapped = shallow(<HeaderSection {...headerProps}></HeaderSection>);

describe("HeaderSection", () => {
  it("should render the HeaderSection Component correctly", () => {
    expect(wrapped).toMatchSnapshot();
  });
});
