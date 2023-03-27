import React from "react";
import { MasterService } from "../../../../services/master.service";
import Notify from "../../../../helpers/notify";
import { APP } from "../../../../constants";
import moment from "moment";
import "moment-timezone";
import ActivityLogs from "../common/ActivityLogs";

class ColumnFive extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataTwo: [],
      selectedChildType: "",
      selectedParentType: "",
      styleClass: "",
      activityLogs: [],
      getId: "",
      getType: "",
    };
    this.getDetails = this.getDetails.bind(this);
    this.getChildNodes = this.getChildNodes.bind(this);
    this.getParentNode = this.getParentNode.bind(this);
    this.searchData2 = this.searchData2.bind(this);
    this.setStyles = this.setStyles.bind(this);
    this.stringTransform = this.stringTransform.bind(this);
    this.getActivityLogs = this.getActivityLogs.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.capitalize = this.capitalize.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.getDetails();
    if (this.props.childType && this.props.childType.length) {
      this.setState(
        {
          selectedChildType: this.props.childType[0],
        },
        () => {
          if (this.props.type !== "COMPETENCIESLEVEL") {
            this.getChildNodes(this.state.selectedChildType);
          }
        }
      );
    } else if (this.props.parentType) {
      this.setState(
        {
          selectedParentType: this.props.parentType[0],
        },
        () => {
          if (this.props.type !== "COMPETENCIESLEVEL") {
            this.getParentNode(this.state.selectedParentType);
          }
        }
      );
    }

    setTimeout(() => {
      if (
        this.props &&
        this.props.history.location &&
        this.props.history.location.state
      ) {
        this.setState(
          {
            getId: this.props.history.location.state.id,
            getType: this.props.history.location.state.type,
          },
          () => {
            this.getActivityLogs();
          }
        );
      } else {
        this.setState(
          {
            getId: "",
            getType: "",
          },
          () => {
            this.getActivityLogs();
          }
        );
      }
    }, 450);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  searchData2 = () => {
    // Declare variables
    let input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("mappedSearch2");
    filter = input.value.toUpperCase();
    ul = document.getElementById("mappedList2");
    li = ul.getElementsByTagName("div");

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  };

  getDetails = () => {
    if (!this.props.roleId.includes("TEMP")) {
      MasterService.getDataByNodeId(this.props.roleId, this.props.type).then(
        (response) => {
          if (
            response &&
            response.data.statusInfo.statusCode === APP.CODE.SUCCESS
          ) {
            this.setState({
              data: response.data.responseData,
            });
          } else {
            Notify.error(response && response.data.statusInfo.errorMessage);
          }
        }
      );
    }
  };

  getChildNodes = (value) => {
    this.setStyles(value);
    if (!this.props.roleId.includes("TEMP")) {
      MasterService.getChildForParent(this.props.roleId, value).then(
        (response) => {
          if (
            response &&
            response.data.statusInfo.statusCode === APP.CODE.SUCCESS
          ) {
            this.setState({
              dataTwo: response.data.responseData,
            });
          } else {
            Notify.error(response && response.data.statusInfo.errorMessage);
          }
        }
      );
    }
  };

  getParentNode = (value) => {
    this.setStyles(value);
    MasterService.getParentNode(this.props.roleId, value).then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        this.setState({
          dataTwo: response.data.responseData,
        });
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  setStyles = (value) => {
    switch (value) {
      case "ROLE":
        this.setState({
          styleClass: "role-border-1",
        });
        break;
      case "ACTIVITY":
        this.setState({
          styleClass: "activity-border-1",
        });
        break;
      case "COMPETENCY":
        this.setState({
          styleClass: "competency-border-1",
        });
        break;
      case "POSITION":
        this.setState({
          styleClass: "position-border-1",
        });
        break;
      case "KNOWLEDGERESOURCE":
        this.setState({
          styleClass: "kr-border-1",
        });
        break;
      default:
        this.setState({
          styleClass: "",
        });
    }
  };

  stringTransform = (string) => {
    string = string.toLowerCase();
    let resultedString = string.charAt(0).toUpperCase() + string.slice(1);
    switch (resultedString) {
      case "Activity":
        resultedString = "Activities";
        break;
      case "Role":
        resultedString = "Roles";
        break;
      case "Position":
        resultedString = "Positions";
        break;
      case "Competency":
        resultedString = "Competencies";
        break;
      case "Knowledgeresource":
        resultedString = "Knowledge Resources";
        break;
      case "Competencieslevel":
        resultedString = "Competencies Level";
        break;
      default:
        resultedString = "No mappings found";
        break;
    }

    return resultedString;
  };

  getActivityLogs = () => {
    MasterService.getActivityLogs(this.props.roleId, this.props.type).then(
      (response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState({
            activityLogs: response.data.responseData,
          });
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      }
    );
  };

  formatDate = (value) => {
    let fmt = "DD/MM/YYYY HH:mm";
    let formatedDateTime = moment.utc(value);
    let localTimeZone = moment.tz.guess();
    return formatedDateTime.tz(localTimeZone).format(fmt);
  };

  capitalize = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.location.key !== prevProps.location.key) {
      setTimeout(() => {
        this.getDetails();
        this.setState({
          selectedChildType: "",
          selectedParentType: "",
        });
        if (this.props.childType && this.props.childType.length) {
          this.setState(
            {
              selectedChildType: this.props.childType[0],
            },
            () => {
              this.getChildNodes(this.state.selectedChildType);
            }
          );
        } else if (this.props.parentType) {
          this.setState(
            {
              selectedParentType: this.props.parentType[0],
            },
            () => {
              this.getParentNode(this.state.selectedParentType);
            }
          );
        }
      }, 800);
    }

    if (prevProps.roleId !== this.props.roleId) {
      this.getDetails();
      this.setState({
        selectedChildType: "",
        selectedParentType: "",
      });
      if (this.props.childType) {
        this.setState(
          {
            selectedChildType: this.props.childType[0],
          },
          () => {
            this.getChildNodes(this.state.selectedChildType);
          }
        );
      } else if (this.props.parentType) {
        this.setState(
          {
            selectedParentType: this.props.parentType[0],
          },
          () => {
            this.getParentNode(this.state.selectedParentType);
          }
        );
      }

      if (this.props.roleId && this.props.type) {
        this.getActivityLogs();
      }
    }
  }

  render() {
    return (
      <div
        className={`col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 bordered ${this.props.customHeight}`}
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
                id="pills-home-tab"
                data-toggle="pill"
                href="#pills-info"
                role="tab"
                aria-controls="pills-home"
                aria-selected="true"
              >
                Info
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-center custom-officer-margin tab-text-1"
                id="pills-home-tab"
                data-toggle="pill"
                href="#activity-logs-column-five"
                role="tab"
                aria-controls="pills-home"
                aria-selected="true"
              >
                Activity log
              </a>
            </li>
          </ul>
        </div>
        <div className="tab-content m-2" id="pills-tabContent">
          <div
            className="tab-pane fade show active"
            id="pills-info"
            role="tabpanel"
            aria-labelledby="pills-home-tab"
          >
            {this.state.data && (
              <div className="m-2 fadeInUp">
                <div className="mt-3">
                  {this.props.roleId.includes("TEMP") && (
                    <React.Fragment>
                      {this.props.temData &&
                        this.props.temData.map((i, j) => {
                          if (i.id === this.props.roleId) {
                            return (
                              <React.Fragment key={i.id}>
                                <label>{i.id}</label>
                                <h1 className="pt-1">{i.name}</h1>
                                {i.description.split("\n").map((o, q) => (
                                  <p className="pt-1" key={o}>
                                    {(this.props.type && this.props.type === "COMPETENCIESLEVEL")
                                      && <span>&#8226;</span>}
                                    {o}
                                  </p>
                                ))}
                              </React.Fragment>
                            );
                          } else {
                            return null;
                          }
                        })}
                    </React.Fragment>
                  )}
                  {!this.props.roleId.includes("TEMP") && (
                    <React.Fragment>
                      <label>{this.state.data.id}</label>
                      <h1 className="pt-1">{this.state.data.name}</h1>
                      {this.state.data.description &&
                        this.state.data.description.split("\n").map((k, l) => (
                          <p className="pt-1" key={k}>
                            {(this.props.type && this.props.type === "COMPETENCIESLEVEL")
                              && <span>&#8226; </span>}
                            {k}
                          </p>
                        ))}
                    </React.Fragment>
                  )}

                  {this.props.type !== "COMPETENCIESLEVEL" && (
                    <button
                      id="btnOne"
                      type="button"
                      className="btn save-button mb-3 mb-xs-0 mb-sm-0 mb-md-3 mb-lg-0 mb-xl-0 col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 custom-primary-button-3"
                      onClick={() =>
                        this.props.history.push({
                          pathname: this.props.url + this.props.roleId,
                          state: {
                            [this.props.stateDataKey]: false,
                            id: this.props.roleId,
                            type: this.props.type,
                          },
                        })
                      }
                    >
                      {this.props.btnText}
                    </button>
                  )}

                  {this.props.type === "COMPETENCIESLEVEL" && (
                    <button
                      id="btnTwo"
                      type="button"
                      className="btn save-button mb-3 mb-xs-0 mb-sm-0 mb-md-3 mb-lg-0 mb-xl-0 col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-5 mr-2 custom-primary-button-3"
                      data-toggle="modal"
                      data-target="#newCLModal"
                      onClick={() => this.props.getCompetencyLevel()}
                    >
                      {this.props.btnText}
                    </button>
                  )}

                  {this.props.type === "COMPETENCIESLEVEL" && (
                    <button
                      id="btnThree"
                      type="button"
                      className="btn save-button mb-3 mb-xs-0 mb-sm-0 mb-md-3 mb-lg-0 mb-xl-0 col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-5 custom-primary-button-3"
                      data-toggle="modal"
                      data-target="#newSubModal"
                    >
                      {this.props.btnTextSecondary}
                    </button>
                  )}

                  {this.props.selectionFunction && (
                    <button
                      id="btnFour"
                      type="button"
                      className="btn save-button ml-1 mb-3 mb-xs-3 mb-sm-3 mb-md-3 mb-lg-3 mb-xl-0 ml-xs-0 ml-sm-0 ml-md-0 ml-lg-2 ml-lg-0 col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-3 custom-primary-button-3"
                      data-toggle="modal"
                      data-target="#newUnMapModal"
                    >
                      Unmap
                    </button>
                  )}

                  {this.props.type !== "COMPETENCIESLEVEL" && (
                    <React.Fragment>
                      <div className="btn-group col-12 mt-3 p-0">
                        <button
                          id="btnFive"
                          type="button"
                          className="btn mb-3 custom-dropdown-menu-2 col-12"
                        >
                          {(this.state.selectedChildType &&
                            this.stringTransform(
                              this.state.selectedChildType
                            )) ||
                            (this.state.selectedParentType &&
                              this.stringTransform(
                                this.state.selectedParentType
                              ))}
                        </button>
                        <button
                          type="button"
                          id="btnSix"
                          className="btn dropdown-toggle dropdown-toggle-split mb-3 custom-dropdown-toggle-menu"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <span className="sr-only">Toggle Dropdown</span>
                        </button>
                        <div className="dropdown-menu right-dropdown-menu">
                          {/*  {this.props.childType && this.props.childType.length > 0 && (
                      <h1>Child Nodes</h1>
                    )}*/}

                          {this.props.childType &&
                            this.props.childType.map((i, j) => {
                              return (
                                <label
                                  key={i}
                                  id="dropdownOne"
                                  className="dropdown-item col-12"
                                  onClick={() =>
                                    this.setState(
                                      {
                                        selectedChildType: i,
                                        selectedParentType: "",
                                      },
                                      () =>
                                        this.getChildNodes(
                                          this.state.selectedChildType
                                        )
                                    )
                                  }
                                >
                                  {this.stringTransform(i)}
                                </label>
                              );
                            })}

                          {/*  {this.props.parentType &&
                      this.props.parentType.length > 0 && <h1>Parent Nodes</h1>}*/}

                          {this.props.parentType &&
                            this.props.parentType.map((i, j) => {
                              return (
                                <label
                                  key={i}
                                  id="dropdownTwo"
                                  className="dropdown-item col-12"
                                  onClick={() =>
                                    this.setState(
                                      {
                                        selectedParentType: i,
                                        selectedChildType: "",
                                      },
                                      () =>
                                        this.getParentNode(
                                          this.state.selectedParentType
                                        )
                                    )
                                  }
                                >
                                  {this.stringTransform(i)}
                                </label>
                              );
                            })}
                        </div>
                      </div>
                      <div className="col-12 mb-4 p-0 " id="officerBucketsList">
                        <input
                          type="text"
                          className={`form-control mb-4 custom-search-5 ${this.props.searchBarStyle}`}
                          placeholder="Search..."
                          name="search"
                          id="mappedSearch2"
                          onKeyUp={this.searchData2}
                          autoComplete="off"
                        />
                      </div>
                      <div id="mappedList2">
                        {this.state.dataTwo &&
                          this.state.dataTwo.map((value, index) => {
                            return (
                              <div
                                className={`col-12 card mb-3 cca-card  ${this.state.styleClass}`}
                                key={value.id}
                              >
                                <div className="ml-0 mt-2 pt-1 pl-2">
                                  <p className="pt-1 custom-heading-1">
                                    {value.name}
                                  </p>
                                  <p className="custom-sub-heading-1 custom-line-height-1 pb-2">
                                    {value.id}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </div>
            )}
          </div>

          <div
            className="tab-pane fade"
            id="activity-logs-column-five"
            role="tabpanel"
            aria-labelledby="pills-home-tab"
          >
            <ActivityLogs activityLogs={this.state.activityLogs} />
          </div>

          {/* Unmap modal */}
          <div
            className="modal fade fadeInUp"
            id="newUnMapModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="newUnMapModalTitle"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="newUnMapLongTitle">
                    {this.props.type &&
                      "Do you want to unmap this " +
                      this.props.type.toLowerCase() +
                      " ?"}
                  </h5>
                </div>
                <div className="modal-body remove-scroll-x">
                  <p>
                    {this.props.type &&
                      this.props.parentType &&
                      this.props.parentType[0] &&
                      "This " +
                      this.props.type.toLowerCase() +
                      " will be unmapped from the selected " +
                      this.props.parentType[0].toLowerCase() +
                      "."}
                  </p>
                </div>
                <div className="modal-footer">
                  <div className="row">
                    <button
                      type="button"
                      className="btn save-button mr-2 danger-button-1"
                      data-dismiss="modal"
                      onClick={() => {
                        this.props.selectionFunction(this.props.roleId);
                        setTimeout(() => {
                          this.props.unMapFunction();
                        }, 800);
                      }}
                    >
                      Yes, unmap
                    </button>

                    <button
                      type="button"
                      className="btn save-button mr-2 custom-primary-button-3"
                      data-dismiss="modal"
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ColumnFive;
