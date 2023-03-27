import React from "react";
import { shallow, mount } from "enzyme";
import toJson from "enzyme-to-json";
// import { render } from '@testing-library/react';
import App from "./App";

let assignMock = jest.fn();

delete window.location;
window.location = { assign: assignMock };

afterEach(() => {
  assignMock.mockClear();
})

it("renders without crashing", () => {
  shallow(<App />);
});

it("renders landing page", () => {
  const wrapper = shallow(<App />);
  const message = (
    <div className="dropdown-item vertical-center-5">
      Checking authenticity...
    </div>
  );
  expect(wrapper.contains(message)).toEqual(true);
});

// test('renders learn react link', () => {
//   const { getByText } = render(<App />);
//   const linkElement = getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
