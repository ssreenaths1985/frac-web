import React from "react";
import { shallow } from "enzyme";
import ColumnThree from "../ColumnThree";

const activityThreeProps = {
  history: {
    location: {
      pathname: "/collection-activities/",
      search: "",
      hash: "",
      state: { id: 0 },
      key: "zgfeb7",
    },
  },
  match: {
    params: { id: 0 },
  },
};

const prevProps = {
  location: {
    pathname: "/collection-activities/",
    search: "",
    hash: "",
    state: { id: 0 },
    key: "zgfeb7",
  },
};

let wrapped = shallow(
  <ColumnThree {...activityThreeProps} {...prevProps}></ColumnThree>
);

describe("ColumnThree", () => {
  it("should render the ColumnThree Component correctly", () => {
    expect(wrapped).toMatchSnapshot();
  });
});
