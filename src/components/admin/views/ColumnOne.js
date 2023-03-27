import React from "react";
import { NavLink } from "react-router-dom";
// import Notify from "../../../helpers/notify";
import { APP } from "../../../constants";

class ColumnOne extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div
        className="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 bordered custom-full-height-4"
        id="officerColumn1"
      >
        <div className="pl-2 mt-4">
          <div id="mepList">
            <NavLink
              className=""
              to={{
                pathname: APP.WORKFLOWS.DASHBOARD,
                state: {
                  stayOn: false,
                },
              }}
            >
              <div
                className={`pl-3 pt-3 mb-2 mr-min-1 ${
                  this.props.history &&
                  (this.props.history.location.pathname.match(
                    APP.WORKFLOWS.DASHBOARD
                  ) ||
                    this.props.history.location.pathname.match(
                      APP.WORKFLOWS.DETAIL
                    ) ||
                    this.props.history.location.pathname.match(
                      APP.WORKFLOWS.LEVEL
                    ))
                    ? "active-list-selection-1 workflow-border-1 "
                    : "list-selection-1"
                } `}
              >
                <h3>Workflows</h3>
              </div>
            </NavLink>
            <NavLink
              className=""
              to={{
                pathname: APP.WORKFLOWS.PEOPLE,
                state: {
                  stayOn: false,
                },
              }}
            >
              <div
                className={`pl-3 pt-3 mb-2 mr-min-1 ${
                  this.props.history &&
                  this.props.history.location.pathname.match(
                    APP.WORKFLOWS.PEOPLE
                  )
                    ? "active-list-selection-1 workflow-border-1 "
                    : "list-selection-1"
                } `}
              >
                <h3>People</h3>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    );
  }
}

export default ColumnOne;
