import React from "react";
import { NavLink } from "react-router-dom";
// import Notify from "../../../helpers/notify";
import { APP } from "../../../constants";
import ColumnFour from "./ColumnFour";

const conditionsSelected = [
  {
    id: 0,
    value: "Completed ‘Drafting competencies’",
  },
  {
    id: 1,
    value: "Average rating > 1",
  },
  {
    id: 2,
    value: "Number of contributions > 5",
  },
  {
    id: 3,
    value: "User of ‘FRACing tool’",
  },
];

const selectedForAccess = [
  {
    id: 0,
    value: "Create activities",
    isActive: true,
  },
  {
    id: 1,
    value: "Send activities for review",
    isActive: true,
  },
];

const allForCreationAccess = [
  {
    id: 2,
    value: "Create competencies",
    isActive: false,
  },
  {
    id: 3,
    value: "Create roles",
    isActive: false,
  },
  {
    id: 4,
    value: "Create activities",
    isActive: true,
  },
  {
    id: 5,
    value: "Create positions",
    isActive: false,
  },
  {
    id: 6,
    value: "Create knowledge resources",
    isActive: false,
  },
];

const allForUpdateAccess = [
  {
    id: 12,
    value: "Update competencies",
    isActive: false,
  },
  {
    id: 13,
    value: "Update roles",
    isActive: true,
  },
  {
    id: 14,
    value: "Update activities",
    isActive: false,
  },
  {
    id: 15,
    value: "Update positions",
    isActive: false,
  },
  {
    id: 16,
    value: "Update knowledge resources",
    isActive: true,
  },
];

const allForDeleteAccess = [
  {
    id: 7,
    value: "Delete competencies",
    isActive: true,
  },
  {
    id: 8,
    value: "Delete roles",
    isActive: false,
  },
  {
    id: 9,
    value: "Delete activities",
    isActive: false,
  },
  {
    id: 10,
    value: "Delete positions",
    isActive: true,
  },
  {
    id: 11,
    value: "Delete knowledge resources",
    isActive: false,
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

class CreateLevel extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      enableThumbNail: false,
      selectedTab: "",
      conditions: false,
    };
    this.loadThumbNail = this.loadThumbNail.bind(this);
    this.clearThumbNail = this.clearThumbNail.bind(this);
    this.sendUnPublishData = this.sendUnPublishData.bind(this);
    this.getConditionDataForLevel = this.getConditionDataForLevel.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getConditionDataForLevel = (value) => {
    if (value) {
      this.setState({
        conditions: true,
      });
    }
  };

  loadThumbNail = (event) => {
    event.preventDefault();

    let reader = new FileReader();

    reader.onload = () => {
      this.setState(
        {
          enableThumbNail: true,
        },
        () => {
          let output = document.getElementById("levelThumbnail");
          output.src = reader.result;
        }
      );
    };

    if (event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  clearThumbNail = (e) => {
    e.preventDefault();

    let output = document.getElementById("levelThumbnail");
    output.src = "null";
    this.setState({
      enableThumbNail: false,
    });
  };

  sendUnPublishData = () => {
    if (this.props) {
      this.props.getFilledState(false);
    }
  };

  render() {
    return (
      <>
        <div
          className={`col-xs-12 col-sm-12 bordered custom-full-height-4 custom-body-bg ${
            this.state.selectedTab === "" ||
            this.state.selectedTab === "Conditions"
              ? "col-md-6 col-lg-6 col-xl-6"
              : "col-md-8 col-lg-8 col-xl-8"
          }`}
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
                <button type="button" className="btn publish-button-1" disabled>
                  Publish
                </button>
              </div>
            </div>
            <div className="mt-4">
              <div className="row">
                <span className="ml-2 pl-1">
                  <div className="level-indicator-box-2"></div>
                </span>
                <div className="col-7">
                  <h1>Levels</h1>
                  <p className="pills-workflow-labels">
                    Nam dapibus nisl vitae elit fringilla rutrum. Aenean
                    sollicitudin, erat a elementum rutrum, neque sem pretium
                    metus, quis mollis nisl nunc et massa. Vestibulum sed metus
                    in lorem tristique ullamcorper id vitae erat.
                  </p>
                  <button
                    type="button"
                    className="btn edit-button-1"
                    onClick={() => this.sendUnPublishData()}
                  >
                    Edit
                  </button>
                </div>
              </div>

              <div id="workflowTabs" className="mt-5 ml-3">
                <ul
                  className="nav nav-pills mb-3 mt-1 custom-officer-margin"
                  id="pills-tab"
                  role="tablist"
                >
                  <li className="nav-item">
                    <a
                      className="nav-link active text-center custom-officer-margin"
                      id="pills-home-tab"
                      data-toggle="pill"
                      href="#pills-conditions"
                      role="tab"
                      aria-controls="pills-home"
                      aria-selected="true"
                      onClick={() =>
                        this.setState({
                          selectedTab: "Conditions",
                        })
                      }
                    >
                      Conditions
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link text-center custom-officer-margin"
                      id="pills-home-tab"
                      data-toggle="pill"
                      href="#pills-access"
                      role="tab"
                      aria-controls="pills-home"
                      aria-selected="true"
                      onClick={() =>
                        this.setState({
                          selectedTab: "Access",
                        })
                      }
                    >
                      Access
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link text-center custom-officer-margin"
                      id="pills-home-tab"
                      data-toggle="pill"
                      href="#pills-officers"
                      role="tab"
                      aria-controls="pills-home"
                      aria-selected="true"
                      onClick={() =>
                        this.setState({
                          selectedTab: "Officers",
                        })
                      }
                    >
                      Officers
                    </a>
                  </li>
                </ul>
              </div>
              <div className="tab-content m-2" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="pills-conditions"
                  role="tabpanel"
                  aria-labelledby="pills-home-tab"
                >
                  {!this.state.conditions && (
                    <div className="col-12">
                      <div
                        className="d-none d-sm-block mt-5"
                        id="emptyStateAdminLevel"
                      >
                        <center>
                          <h1 className="pb-2">No conditions added</h1>
                          <p className="col-4 pb-2">
                            Search on the right side panel to add a condition
                          </p>
                          <img
                            src="/img/empty/condtions_empty.png"
                            alt="empty list"
                          ></img>
                        </center>
                      </div>
                    </div>
                  )}

                  {this.state.conditions && (
                    <>
                      <div className="col-12 pl-2 mt-4">
                        <div className="row mt-3 p-0">
                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-5 col-xl-5 p-0 mr-3">
                            <div className="hightlighter-1">
                              <div className="d-flex flex-row pt-3 pl-3 pr-3">
                                <div className="p-0">
                                  <img
                                    src="/img/loader/lightbulb_black_24dp.svg"
                                    className="highlighter-image-1"
                                    alt="level bulb"
                                  />
                                </div>
                                <p className="">
                                  Search on the right side panel to add a
                                  condition
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 p-0">
                            <div className="hightlighter-1">
                              <div className="d-flex flex-row pt-3 pl-3 pr-2">
                                <div className="p-0">
                                  <img
                                    src="/img/loader/lightbulb_black_24dp.svg"
                                    className="highlighter-image-1"
                                    alt="level bulb"
                                  />
                                </div>
                                <p className="">
                                  The conditions on the top of the list override
                                  the ones below
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 mt-4">
                        {conditionsSelected.map((i, j) => {
                          return (
                            <div
                              className="col-12 condition-row-1 mb-2 row"
                              key={j}
                            >
                              <span
                                style={{ height: "0rem", cursor: "grabbing" }}
                              >
                                <img
                                  className="pr-2 drag-icon-1"
                                  src="/img/level/drag_handle_black_24dp.svg"
                                  alt="drag level"
                                />
                              </span>
                              {i.value}
                              <span
                                style={{
                                  height: "0rem",
                                  position: "absolute",
                                  right: "0",
                                  paddingRight: "0.85rem",
                                  cursor: "pointer",
                                }}
                              >
                                <img
                                  className="pr-2 drag-icon-1"
                                  src="/img/level/more_horiz_black_24dp.svg"
                                  alt="more details"
                                />
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
                <div
                  className="tab-pane fade show"
                  id="pills-access"
                  role="tabpanel"
                  aria-labelledby="pills-home-tab"
                >
                  <div className="col-12 mt-4 pt-1 pl-2">
                    <div className="">
                      <h1 className="admin-tab-heading-1">Added(2)</h1>
                      <div className="pt-3">
                        {selectedForAccess.map((o, p) => {
                          return (
                            <>
                              <p className="admin-tab-paragraph-1" key={p}>
                                {o.isActive ? (
                                  <span className="material-icons check-box-2 pr-2">
                                    check_box
                                  </span>
                                ) : (
                                  <span className="material-icons check-box-2 pr-2">
                                    check_box_outline_blank
                                  </span>
                                )}
                                {o.value}
                              </p>
                            </>
                          );
                        })}
                      </div>
                    </div>
                    <div className="mt-4 pt-1">
                      <h1 className="admin-tab-heading-1">Added(43)</h1>
                      <div
                        className="col-3 mt-4 p-0 mr-3"
                        id="officerBucketsList"
                      >
                        <input
                          type="text"
                          style={{ width: "110%", paddingLeft: "1.75rem" }}
                          className="form-control mb-3 custom-search-5 custom-search-bar-2 form-control-4"
                          placeholder="Search..."
                          name="search"
                          id="officerMappedSearch2"
                          autoComplete="off"
                        />
                      </div>
                      <div className="pt-2">
                        <h2 className="admin-tab-heading-2 pb-3">Creation</h2>
                        {allForCreationAccess.map((o, p) => {
                          return (
                            <>
                              <p className="admin-tab-paragraph-1" key={p}>
                                {o.isActive ? (
                                  <span className="material-icons check-box-2 pr-2">
                                    check_box
                                  </span>
                                ) : (
                                  <span className="material-icons check-box-2-disabled pr-2">
                                    check_box_outline_blank
                                  </span>
                                )}
                                {o.value}
                              </p>
                            </>
                          );
                        })}
                      </div>
                      <div className="pt-2">
                        <h2 className="admin-tab-heading-2 pb-3">Update</h2>
                        {allForUpdateAccess.map((o, p) => {
                          return (
                            <>
                              <p className="admin-tab-paragraph-1">
                                {o.isActive ? (
                                  <span className="material-icons check-box-2 pr-2">
                                    check_box
                                  </span>
                                ) : (
                                  <span className="material-icons check-box-2-disabled pr-2">
                                    check_box_outline_blank
                                  </span>
                                )}
                                {o.value}
                              </p>
                            </>
                          );
                        })}
                      </div>
                      <div className="pt-2">
                        <h2 className="admin-tab-heading-2 pb-3">Deletion</h2>
                        {allForDeleteAccess.map((o, p) => {
                          return (
                            <>
                              <p className="admin-tab-paragraph-1" key={p}>
                                {o.isActive ? (
                                  <span className="material-icons check-box-2 pr-2">
                                    check_box
                                  </span>
                                ) : (
                                  <span className="material-icons check-box-2-disabled pr-2">
                                    check_box_outline_blank
                                  </span>
                                )}
                                {o.value}
                              </p>
                            </>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade show"
                  id="pills-officers"
                  role="tabpanel"
                  aria-labelledby="pills-home-tab"
                >
                  {/* <p className="pills-workflow-labels">
                    Officers can be defined after the level is created
                  </p> */}
                  <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 p-0 pt-2 mb-4 pb-1">
                    <div className="hightlighter-1">
                      <div className="d-flex flex-row pt-3 pl-3 pr-2">
                        <div className="p-0">
                          <img
                            src="/img/loader/lightbulb_black_24dp.svg"
                            className="highlighter-image-1"
                            alt="level bulb"
                          />
                        </div>
                        <p className="">
                          This is populated based on the conditions defined
                        </p>
                      </div>
                    </div>
                  </div>
                  <button type="button" className="btn unpublish-button-1">
                    Add an officer manually
                  </button>
                  <div className="row col-12 pb-0">
                    <div
                      className="col-3 mt-4 p-0 mr-3"
                      id="officerBucketsList"
                    >
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
                  <table className="table table-striped" id="officersSection">
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
                          <tr key={u}>
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
        </div>

        {(this.state.selectedTab === "" ||
          this.state.selectedTab === "Conditions") && (
          <ColumnFour
            getConditionDataForLevel={this.getConditionDataForLevel}
          />
        )}
      </>
    );
  }
}

export default CreateLevel;
