import React from "react";
import { shallow } from "enzyme";
import ColumnTwo from "../ColumnTwo";

const competenciesTwoProps = {
  history: {
    location: {
      pathname: "/collection-competencies/",
      search: "",
      hash: "",
      state: null,
      key: "zgfeb7",
    },
  },
};

let wrapped = shallow(<ColumnTwo {...competenciesTwoProps}></ColumnTwo>);

describe("ColumnTwo", () => {
  it("should render the ColumnTwo Component correctly", () => {
    expect(wrapped).toMatchSnapshot();
  });
});
