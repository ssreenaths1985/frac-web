import React from "react";
// import { NavLink } from "react-router-dom";
// import Notify from "../../../helpers/notify";
// import { APP } from "../../../constants";
import OverviewFilledView from "./OverviewFilledView";
import OverviewUnFilledView from "./OverviewUnFilledView";

class ColumnThree extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      formFilled: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getFilledState = (value) => {
    this.setState({
      formFilled: value
    })
  }

  render() {
    return this.state.formFilled ? (
      <OverviewFilledView {...this.props} getFilledState={this.getFilledState}/>
    ) : (
      <OverviewUnFilledView {...this.props} getFilledState={this.getFilledState}/>
    );
  }
}

export default ColumnThree;
