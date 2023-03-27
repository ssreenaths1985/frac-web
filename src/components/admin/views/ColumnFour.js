import React from "react";
import ConditionsList from "./ConditionsList";
// import { NavLink } from "react-router-dom";
// import Notify from "../../../helpers/notify";
// import { APP } from "../../../constants";

class ColumnFour extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {};
    this.getConditionData = this.getConditionData.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getConditionData = (value) => {
    if (value) {
      this.props.getConditionDataForLevel(value);
    }
  };

  render() {
    return (
      <div
        className="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 bordered custom-full-height-4"
        id="columnFiveMaster"
      >
        <div id="officerColumn4" className="mt-3 ml-3">
          <ul
            className="nav nav-pills mb-3 mt-1 custom-officer-margin"
            id="pills-tab"
            role="tablist"
          >
            <li className="nav-item">
              <a
                className="nav-link active text-center custom-officer-margin tab-text-1"
                id="pills-live-tab"
                data-toggle="pill"
                href="#live-column-six"
                role="tab"
                aria-controls="pills-home"
                aria-selected="true"
              >
                Conditions
              </a>
            </li>
          </ul>
        </div>
        <div className="tab-content m-2" id="pills-tabContent">
          <div
            className="tab-pane fade show active"
            id="live-column-six"
            role="tabpanel"
            aria-labelledby="pills-live-tab"
          >
            <ConditionsList
              {...this.props}
              getConditionData={this.getConditionData}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ColumnFour;
