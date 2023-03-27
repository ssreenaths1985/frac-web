import React from "react";
import { shallow } from "enzyme";
import ColumnThree from "../ColumnThree";

const competenciesThreeProps = {
  history: {
    location: {
      pathname: "/collection-competencies/",
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
    pathname: "/collection-competencies/",
    search: "",
    hash: "",
    state: { id: 0 },
    key: "zgfeb7",
  },
};

let wrapped = shallow(
  <ColumnThree {...competenciesThreeProps} {...prevProps}></ColumnThree>
);

describe("ColumnThree", () => {
  it("should render the ColumnThree Component correctly", () => {
    expect(wrapped).toMatchSnapshot();
  });
});
