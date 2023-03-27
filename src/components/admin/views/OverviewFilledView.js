import React from "react";
import { NavLink } from "react-router-dom";
// import Notify from "../../../helpers/notify";
import { APP } from "../../../constants";

const levels = [
  {
    key: "Level 1",
    value: "34 officers",
  },
  {
    key: "Level 2",
    value: "12 officers",
  },
  {
    key: "Level 3",
    value: "8 officers",
  },
];

const officersList = [
  {
    name: "Officer name",
    isActive: true,
    kind: "Automatically added",
    addedOn: "13-04-2021 11:40 AM",
    mdo: "ISTM",
    levels: "Level 2",
  },
  {
    name: "Officer name",
    isActive: true,
    kind: "Automatically added",
    addedOn: "13-04-2021 11:40 AM",
    mdo: "ISTM",
    levels: "Level 2",
  },
  {
    name: "Officer name",
    isActive: true,
    kind: "Manually added",
    addedOn: "13-04-2021 11:40 AM",
    mdo: "ISTM",
    levels: "Level 2",
  },
  {
    name: "Officer name",
    isActive: true,
    kind: "Manually added",
    addedOn: "13-04-2021 11:40 AM",
    mdo: "ISTM",
    levels: "Level 2, Level 3",
  },
];

class OverviewFilledView extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      formFilled: true,
    };
    this.sendUnPublishData = this.sendUnPublishData.bind();
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  sendUnPublishData = () => {
    if (this.props) {
      this.props.getFilledState(false);
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
                className="btn unpublish-button-1"
                onClick={() => this.sendUnPublishData()}
              >
                Unpublish
              </button>
            </div>
          </div>
          <div className="mt-4" id="filledState">
            <div className="mb-5">
              <h1>{this.props && this.props.title}</h1>
              <p className="mt-3">
                Nam dapibus nisl vitae elit fringilla rutrum. Aenean
                sollicitudin, erat a elementum rutrum, neque sem pretium metus,
                quis mollis nisl nunc et massa. Vestibulum sed metus in lorem
                tristique ullamcorper id vitae erat.
              </p>
              <button type="button" className="btn edit-button-1">
                Edit
              </button>
            </div>
            <div className="mb-5">
              <h1>Levels</h1>
              <button
                type="button"
                className="btn workflow-button-1 mt-3 mb-1"
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
              <div className="row col-12 mt-4">
                {levels.map((i, j) => {
                  return (
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 level-box-1 mr-4 mt-0 mt-xs-2 mt-sm-2 mt-md-2 mt-lg-0 mt-xl-0">
                      <div className="d-flex flex-row">
                        <div className="level-indicator-box-1"></div>
                        <div className="d-flex flex-column pl-3">
                          <label>{i.key}</label>
                          <p>{i.value}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="" id="officersSection">
              <h1>Officers</h1>
              <div className="row col-12 pb-0">
                <div className="col-3 mt-4 p-0 mr-3" id="officerBucketsList">
                  <input
                    type="text"
                    style={{ width: "110%", paddingLeft: "1.75rem" }}
                    className="form-control mb-3 custom-search-5 custom-search-bar-2 form-control-4"
                    placeholder="Search..."
                    name="search"
                    id="officerMappedSearch"
                    autoComplete="off"
                  />
                </div>
                <div className="col-5 ml-5 pl-2 mt-4 pt-1">
                  <p className="officers-filter-1">All officers</p>
                </div>
              </div>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">Officer</th>
                    <th scope="col">Active?</th>
                    <th scope="col">Kind</th>
                    <th scope="col">Added on</th>
                    <th scope="col">MDO</th>
                    <th scope="col">Levels</th>
                  </tr>
                </thead>
                <tbody>
                  {officersList.map((y, u) => {
                    return (
                      <tr>
                        <th scope="row">
                          <div className="d-flex flex-row">
                            <div className="officer-profile-circle-1">
                              <div className="officer-profile-circle-text-1">
                                TA
                              </div>
                            </div>
                            <div className="pl-2">{y.name}</div>
                          </div>
                        </th>
                        {y.isActive ? (
                          <td>
                            <span className="material-icons check-box-1">
                              check_box
                            </span>
                          </td>
                        ) : (
                          <td>
                            <span className="material-icons check-box-1">
                              check_box_outline_blank
                            </span>
                          </td>
                        )}
                        <td>{y.kind}</td>
                        <td>{y.addedOn}</td>
                        <td>{y.mdo}</td>
                        <td>{y.levels}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OverviewFilledView;
