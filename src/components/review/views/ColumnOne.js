import React from "react";
import { NavLink } from "react-router-dom";
import { APP } from "../../../constants";

class ColumnOne extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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
                pathname: APP.ROUTES_PATH.REVIEW_POSITION,
              }}
            >
              <div
                className={`pl-3 pt-3 mb-2 mr-min-1 ${this.props.history &&
                  this.props.history.location.pathname.match(
                    APP.ROUTES_PATH.REVIEW_POSITION
                  )
                  ? "active-list-selection-1 position-border-1"
                  : "list-selection-1 position-border-1"
                  } `}
              >
                <h3 className={`${this.props.nodeCount
                  && this.props.nodeCount[APP.COLLECTIONS.POSITION] !== 0
                  ? "filter-bold" : ""
                  } `}>Positions
                  {this.props.nodeCount
                    && this.props.nodeCount[APP.COLLECTIONS.POSITION] !== 0 && (
                      <span> ( {this.props.nodeCount[APP.COLLECTIONS.POSITION]} )</span>
                    )}
                </h3>
              </div>
            </NavLink>
            <NavLink
              className=""
              to={{
                pathname: APP.ROUTES_PATH.REVIEW_ROLES,
              }}
            >
              <div
                className={`pl-3 pt-3 mb-2 mr-min-1 ${this.props.history &&
                  this.props.history.location.pathname.match(
                    APP.ROUTES_PATH.REVIEW_ROLES
                  )
                  ? "active-list-selection-1 role-border-1"
                  : "list-selection-1 role-border-1"
                  } `}
              >
                <h3 className={`${this.props.nodeCount
                  && this.props.nodeCount[APP.COLLECTIONS.ROLE] !== 0
                  ? "filter-bold" : ""
                  } `}>Roles
                  {this.props.nodeCount
                    && this.props.nodeCount[APP.COLLECTIONS.ROLE] !== 0 && (
                      <span> ( {this.props.nodeCount[APP.COLLECTIONS.ROLE]} )</span>
                    )}
                </h3>
              </div>
            </NavLink>
            <NavLink
              className=""
              to={{
                pathname: APP.ROUTES_PATH.REVIEW_ACTIVITIES,
              }}
            >
              <div
                className={`pl-3 pt-3 mb-2 mr-min-1 ${this.props.history &&
                  this.props.history.location.pathname.match(
                    APP.ROUTES_PATH.REVIEW_ACTIVITIES
                  )
                  ? "active-list-selection-1 activity-border-1"
                  : "list-selection-1 activity-border-1"
                  } `}
              >
                <h3 className={`${this.props.nodeCount
                  && this.props.nodeCount[APP.COLLECTIONS.ACTIVITY] !== 0
                  ? "filter-bold" : ""
                  } `}>Activities
                  {this.props.nodeCount
                    && this.props.nodeCount[APP.COLLECTIONS.ACTIVITY] !== 0 && (
                      <span> ( {this.props.nodeCount[APP.COLLECTIONS.ACTIVITY]} )</span>
                    )}
                </h3>
              </div>
            </NavLink>
            <NavLink
              className=""
              to={{
                pathname: APP.ROUTES_PATH.REVIEW_COMPETENCY,
              }}
            >
              <div
                className={`pl-3 pt-3 mb-2 mr-min-1 ${this.props.history &&
                  this.props.history.location.pathname.match(
                    APP.ROUTES_PATH.REVIEW_COMPETENCY
                  )
                  ? "active-list-selection-1 competency-border-1"
                  : "list-selection-1 competency-border-1"
                  } `}
              >
                <h3 className={`${this.props.nodeCount
                  && this.props.nodeCount[APP.COLLECTIONS.COMPETENCY] !== 0
                  ? "filter-bold" : ""
                  } `}>Competencies
                  {this.props.nodeCount
                    && this.props.nodeCount[APP.COLLECTIONS.COMPETENCY] !== 0 && (
                      <span> ( {this.props.nodeCount[APP.COLLECTIONS.COMPETENCY]} )</span>
                    )}
                </h3>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    );
  }
}

export default ColumnOne;
