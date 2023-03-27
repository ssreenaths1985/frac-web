import React from "react";
import { NavLink } from "react-router-dom";
// import Notify from "../../../helpers/notify";
import { APP } from "../../../constants";

class OverviewUnFilledView extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      formFilled: false,
    };
    this.sendPublishData = this.sendPublishData.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  sendPublishData = () => {
    if (this.props) {
      this.props.getFilledState(true);
    }
  };

  render() {
    return (
      <div
        className="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 bordered custom-full-height-4 custom-body-bg"
        id="workflowForm"
      >
        <div className="pl-2 mt-4">
          <div className="d-flex justify-content-between flex-row">
            <div className="">
              <NavLink
                className="breadcrumb-1 navlink-style-1"
                to={{
                  pathname: APP.WORKFLOWS.DASHBOARD,
                }}
              >
                Workflows
              </NavLink>

              <span className="material-icons breadcrumb-icon-1">
                arrow_forward_ios
              </span>
              <label className="breadcrumb-1">
                {this.props && this.props.title}
              </label>
            </div>
            <div className="">
              <button
                type="button"
                className="btn publish-button-1"
                onClick={() => this.sendPublishData()}
              >
                Publish
              </button>
            </div>
          </div>
          <div className="mt-4">
            <h1>{this.props && this.props.title}</h1>
            <h2 className="mt-3">Description</h2>
            <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 p-0">
              <textarea
                className="form-control mt-2"
                id="description"
                rows="5"
                placeholder="Write an overview..."
              ></textarea>
            </div>
            <h1 className="mt-5">Levels</h1>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 level-graphical-box-1 mt-4">
              <div className="pt-4 pl-3">
                <label>No level found</label>
                <p>
                  A minimum of one level is required to publish the workflow
                </p>
                <button
                  type="button"
                  className="btn workflow-button-1 mt-2 mb-0 mb-xs-3 mb-sm-3 mb-md-4 mb-lg-4 mb-xl-4"
                  onClick={() =>
                    this.props.history.push({
                      pathname: `${APP.WORKFLOWS.LEVEL}/${
                        this.props && this.props.title.toLowerCase()
                      }/0`,
                      state: { id: 0 },
                    })
                  }
                >
                  Create new level
                </button>
              </div>
            </div>
            <h1 className="mt-5">Officers</h1>
            <label className="description-1 mt-2">
              Define levels to see eligible officers here
            </label>
          </div>
        </div>
      </div>
    );
  }
}

export default OverviewUnFilledView;
