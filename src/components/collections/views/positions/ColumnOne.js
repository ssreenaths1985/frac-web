import React from "react";
import { NavLink } from "react-router-dom";
import { UserService } from "../../../../services/user.service";
import { DashboardService } from "../../../../services/dashboard.service";
import Notify from "../../../../helpers/notify";
import CryptoJS from "crypto-js";
import { APP } from "../../../../constants";

class ColumnOne extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      currentDept: "",
      allDeptData: [],
      roles: "",
      clearSearch: false,
      clearSearchInput: false,
    };
    this.decryptUtility = this.decryptUtility.bind(this);
    this.checkAccess = this.checkAccess.bind(this);
    this.encryptData = this.encryptData.bind(this);
    this.getDepartments = this.getDepartments.bind(this);
    this.searchForDept = this.searchForDept.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.getDepartments();
    this.getAllDepts();
    this.checkAccess();

    document.addEventListener("click", function (e) {
      if (document.getElementById("dropdownForDept")) {
        document
          .getElementById("dropdownForDept")
          .addEventListener("click", function (e) {
            if (e.target.lastChild && e.target.lastChild.id === "deptList") {
              e.stopPropagation();
            } else {
              document.getElementById("deptSearch").value = "";
              let a, b, c, txt;
              b = document.getElementById("deptList");
              a = b.getElementsByTagName("button");

              // Loop through all list items, and hide those who don't match the search query
              for (c = 0; c < a.length; c++) {
                txt = a[c].textContent || a[c].innerText;
                if (txt.toUpperCase().indexOf("") > -1) {
                  a[c].style.display = "";
                } else {
                  a[c].style.display = "none";
                }
              }
            }
          });
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getAllDepts = () => {
    if (localStorage.getItem("wid")) {
      DashboardService.getAllDepartments().then((response) => {
        if (response && response.status === 200 && response.data.result
          && response.data.result.response
          && response.data.result.response.content) {
          this.setState({
            allDeptData: response.data.result.response.content,
          });
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });
    }
  };

  getDepartments = () => {
    if (!localStorage.getItem("department") && localStorage.getItem("wid")) {
      let bytes = CryptoJS.AES.decrypt(
        localStorage.getItem("wid"),
        "igotcheckIndia*"
      );
      UserService.getRoles(bytes.toString(CryptoJS.enc.Utf8)).then((response) => {
        if (response && response.status === 200
          && response.data.result
          && response.data.result.response
          && response.data.result.response.rootOrg
          && response.data.result.response.rootOrg.orgName) {
          if (response.data) {
            this.setState(
              {
                currentDept: response.data.result.response.rootOrg.orgName,
              },
              () => {
                this.encryptData();
              }
            );
          }
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });
    } else {
      this.decryptUtility();
    }
  };

  encryptData = () => {
    let cipherText = CryptoJS.AES.encrypt(
      this.state.currentDept,
      "igotcheckIndia*"
    ).toString();
    localStorage.setItem("department", cipherText);
  };

  decryptUtility = () => {
    if (localStorage.getItem("wid")) {
      let bytes = CryptoJS.AES.decrypt(
        localStorage.getItem("department"),
        "igotcheckIndia*"
      );
      let originalText = bytes.toString(CryptoJS.enc.Utf8);
      this.setState({
        currentDept: originalText,
      });
    }
  };

  checkAccess = () => {
    setTimeout(() => {
      if (localStorage.getItem("stateFromNav")) {
        let bytes = CryptoJS.AES.decrypt(
          localStorage.getItem("stateFromNav"),
          "igotcheckIndia*"
        );
        let originalText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        this.setState({
          roles: originalText,
        });
      }
    }, 300);
  };

  searchForDept = () => {
    // Declare variables
    let input, filter, ul, li, i, txtValue;
    if (!this.state.clearSearchInput) {
      this.setState({
        clearSearch: true,
      });
    } else {
      this.setState({
        clearSearch: false,
        clearSearchInput: false,
      });
    }

    input = document.getElementById("deptSearch");

    if (input.value.length === 0) {
      this.setState({
        clearSearch: false,
        clearSearchInput: false,
      });
    }

    if (!this.state.clearSearchInput) {
      filter = input.value.toUpperCase();
    } else {
      filter = "";
    }

    ul = document.getElementById("deptList");
    li = ul.getElementsByTagName("button");

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      txtValue = li[i].textContent || li[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  };

  render() {
    return (
      <div
        className="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 bordered custom-full-height-4"
        id="officerColumn1"
      >
        <div className="pl-2 mt-4">
          {/* For FRACAdmin role */}
          {this.state.roles &&
            JSON.stringify(this.state.roles).includes("FRAC_ADMIN") && (
              <center>
                <div
                  className="btn-group w-100 p-0"
                  style={{ marginLeft: "-0.5em" }}
                >
                  <button
                    type="button"
                    className="btn mb-3 custom-dropdown-menu-4 col-12"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {this.state.currentDept}
                  </button>
                  <button
                    type="button"
                    className="btn dropdown-toggle dropdown-toggle-split mb-3 custom-dropdown-toggle-menu"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span className="sr-only">Toggle Dropdown</span>
                  </button>
                  <div
                    className="dropdown-menu right-dropdown-menu col-12"
                    role="menu"
                    id="dropdownForDept"
                  >
                    <div className="row col-12 p-0 ml-1">
                      <div className="col-9 " id="officerBucketsList">
                        <input
                          type="text"
                          style={{ width: "133%" }}
                          className="form-control mb-3 custom-search-5"
                          placeholder="Search..."
                          aria-label="Search"
                          id="deptSearch"
                          onKeyUp={this.searchForDept}
                          aria-describedby="basic-addon1"
                          autoComplete="off"
                        />
                      </div>
                      <div className="col-3">
                        {this.state.clearSearch && (
                          <span
                            className="material-icons competency-area-close-button"
                            onClick={() => {
                              this.setState(
                                {
                                  clearSearchInput: true,
                                },
                                () => {
                                  document.getElementById("deptSearch").value =
                                    "";
                                  this.searchForDept();
                                }
                              );
                            }}
                          >
                            close
                          </span>
                        )}
                      </div>
                    </div>

                    <div id="deptList">
                      <button
                        type="button"
                        className="dropdown-item p-1 custom-dropdown-item"
                        onClick={() =>
                          this.setState(
                            {
                              currentDept: "All MDO",
                            },
                            () => {
                              this.encryptData();
                              this.props.getDeptValue(this.state.currentDept);
                            }
                          )
                        }
                      >
                        All MDO
                      </button>
                      {this.state.allDeptData &&
                        this.state.allDeptData.map((value, index) => {
                          return (
                            <button
                              type="button"
                              key={value.orgName + index}
                              className="dropdown-item p-1 custom-dropdown-item"
                              onClick={() =>
                                this.setState(
                                  {
                                    currentDept: value.orgName,
                                  },
                                  () => {
                                    this.encryptData();
                                    this.props.getDeptValue(
                                      this.state.currentDept
                                    );
                                  }
                                )
                              }>
                              {value.orgName}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </center>
            )}

          {/* For non admin roles */}
          {this.state.roles &&
            !JSON.stringify(this.state.roles).includes("FRAC_ADMIN") && (
              <center>
                <div
                  className="btn-group w-100 p-0"
                  style={{ marginLeft: "-0.5em", marginRight: "0.35em" }}
                >
                  <button
                    type="button"
                    className="btn mb-3 custom-dropdown-menu-4 col-12"
                  >
                    {this.state.currentDept}
                  </button>
                </div>
              </center>
            )}

          <div id="mepList">
            {!JSON.stringify(this.state.roles).includes(
              "FRAC_COMPETENCY_MEMBER"
            ) && (
                <>
                  <NavLink
                    className=""
                    to={{
                      pathname: APP.COLLECTIONS_PATH.POSITION,
                      state: {
                        stayOn: false,
                      },
                    }}
                  >
                    <div
                      className={`pl-3 pt-3 mb-2 mr-min-1 ${this.props.history &&
                        this.props.history.location.pathname.match(
                          APP.COLLECTIONS_PATH.POSITION
                        )
                        ? "active-list-selection-1 position-border-1"
                        : "list-selection-1 position-border-1"
                        } `}
                    >
                      <h3>Positions</h3>
                    </div>
                  </NavLink>
                  <NavLink
                    className=""
                    to={{
                      pathname: APP.COLLECTIONS_PATH.ROLE,
                      state: {
                        stayOn: false,
                      },
                    }}
                  >
                    <div
                      className={`pl-3 pt-3 mb-2 mr-min-1 ${this.props.history &&
                        this.props.history.location.pathname.match(
                          APP.COLLECTIONS_PATH.ROLE
                        )
                        ? "active-list-selection-1 role-border-1"
                        : "list-selection-1 role-border-1"
                        } `}
                    >
                      <h3>Roles</h3>
                    </div>
                  </NavLink>

                  <NavLink
                    className=""
                    to={{
                      pathname: APP.COLLECTIONS_PATH.ACTIVITY,
                    }}
                  >
                    <div
                      className={`pl-3 pt-3 mb-2 mr-min-1 ${this.props.history &&
                        this.props.history.location.pathname.match(
                          APP.COLLECTIONS_PATH.ACTIVITY
                        )
                        ? "active-list-selection-1 activity-border-1"
                        : "list-selection-1 activity-border-1"
                        } `}
                    >
                      <h3>Activities</h3>
                    </div>
                  </NavLink>
                </>
              )}

            <NavLink
              className=""
              to={{
                pathname: APP.COLLECTIONS_PATH.COMPETENCY,
                state: {
                  stayOn: false,
                },
              }}
            >
              <div
                className={`pl-3 pt-3 mb-2 mr-min-1 ${this.props.history &&
                  this.props.history.location.pathname.match(
                    APP.COLLECTIONS_PATH.COMPETENCY
                  )
                  ? "active-list-selection-1 competency-border-1"
                  : "list-selection-1 competency-border-1"
                  } `}
              >
                <h3>Competencies</h3>
              </div>
            </NavLink>

            {!JSON.stringify(this.state.roles).includes(
              "FRAC_COMPETENCY_MEMBER"
            ) && (
                <NavLink
                  className=""
                  to={{
                    pathname: APP.COLLECTIONS_PATH.KNOWLEDGE_RESOURCES,
                    state: {
                      stayOn: false,
                    },
                  }}
                >
                  <div
                    className={`pl-3 pt-3 mb-2 mr-min-1 ${this.props.history &&
                      this.props.history.location.pathname.match(
                        APP.COLLECTIONS_PATH.KNOWLEDGE_RESOURCES
                      )
                      ? "active-list-selection-1 kr-border-1"
                      : "list-selection-1 kr-border-1"
                      } `}
                  >
                    <h3>Knowledge Resources</h3>
                  </div>
                </NavLink>
              )}
          </div>
        </div>
      </div>
    );
  }
}

export default ColumnOne;
