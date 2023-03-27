import React from "react";
import { NavLink } from "react-router-dom";
import { APP } from "../../../constants";

class WorkflowDashboard extends React.Component {
  render() {
    return (
      <div
        className="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10 bordered custom-full-height-4 custom-body-bg"
        id="workflows"
      >
        <div className="ml-3 pt-4 mt-3">
          <h1>Published workflows</h1>
          <div className="d-flex flex-row mt-4 mb-5">
            <NavLink
              className="col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 workflow-box-1"
              to={{
                pathname: APP.WORKFLOWS.DETAIL + "/overview-activities",
                state: {
                  type: "ACTIVITY",
                }
              }}
            >
              <div>
                <label className="">Activities</label>
                <p>3 levels</p>
              </div>
            </NavLink>
          </div>
          <h1>Draft</h1>
          <div className="d-flex flex-row mt-4 mb-5">
            <NavLink
              className="col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 workflow-box-1"
              to={{
                pathname: APP.WORKFLOWS.DETAIL + "/overview-positions",
              }}
            >
              <div>
                <label>Positions</label>
                <p>3 levels (draft)</p>
              </div>
            </NavLink>
          </div>
          <h1>Undefined</h1>
          <div className="d-flex flex-row mt-4 mb-5">
            <NavLink
              className="col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 workflow-box-1 mr-5"
              to={{
                pathname: APP.WORKFLOWS.DETAIL + "/overview-roles",
              }}
            >
              <div>
                <label>Roles</label>
                <p>Undefined</p>
              </div>
            </NavLink>
            <NavLink
              className="col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 workflow-box-1"
              to={{
                pathname: APP.WORKFLOWS.DETAIL + "/overview-competencies",
              }}
            >
              <div>
                <label>Competencies</label>
                <p>Undefined</p>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    );
  }
}

export default WorkflowDashboard;
