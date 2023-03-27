import React from "react";
import { shallow } from "enzyme";
import ColumnOne from '../ColumnOne';

let wrapped = shallow(<ColumnOne></ColumnOne>);

it('Test Review container collections filter', () => {
    expect(wrapped).toMatchSnapshot();
})