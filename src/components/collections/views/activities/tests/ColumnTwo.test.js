import React from "react";
import { shallow } from "enzyme";
import ColumnTwo from "../ColumnTwo";

const activityTwoProps = {
  history: {
    location: {
      pathname: "/collection-activities/",
      search: "",
      hash: "",
      state: null,
      key: "zgfeb7",
    },
  },
};

let wrapped = shallow(<ColumnTwo {...activityTwoProps}></ColumnTwo>);

describe("ColumnTwo", () => {
  it("should render the ColumnTwo Component correctly", () => {
    expect(wrapped).toMatchSnapshot();
  });
});
