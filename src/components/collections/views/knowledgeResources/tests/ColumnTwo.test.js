import React from "react";
import { shallow } from "enzyme";
import ColumnTwo from "../ColumnTwo";

const krTwoProps = {
  history: {
    location: {
      pathname: "/collection-knowledge-resources/",
      search: "",
      hash: "",
      state: null,
      key: "zgfeb7",
    },
  },
};

let wrapped = shallow(<ColumnTwo {...krTwoProps}></ColumnTwo>);

describe("ColumnTwo", () => {
  it("should render the ColumnTwo Component correctly", () => {
    expect(wrapped).toMatchSnapshot();
  });
});
