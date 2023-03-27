import React from "react";
import { shallow } from "enzyme";
import Preview from '../Preview';

let wrapped = shallow(<Preview></Preview>);

it('Test Review container node preview', () => {
    expect(wrapped).toMatchSnapshot();
})