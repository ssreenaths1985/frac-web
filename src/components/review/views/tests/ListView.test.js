import React from "react";
import { shallow } from "enzyme";
import ListView from '../ListView';

const listViewProps = {
    reviewData: {
        unverified: 0
    }
}

let wrapped = shallow(<ListView {...listViewProps}></ListView>);

it('Test Review container List view', () => {
    expect(wrapped).toMatchSnapshot();
})