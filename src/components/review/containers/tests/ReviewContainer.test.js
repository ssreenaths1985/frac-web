import React from "react";
import { shallow } from "enzyme";
import ReviewContainer from '../ReviewContainer';


const reviewContainerProps = {
    history: {
        location: {
            pathname: "/review"
        },
    },
}
let wrapped = shallow(<ReviewContainer {...reviewContainerProps}></ReviewContainer>);

it('Test Review Container', () => {
    expect(wrapped).toMatchSnapshot();
})