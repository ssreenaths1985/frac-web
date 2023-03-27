import React from "react";
import { DashboardService } from "../../../services/dashboard.service";
import Notify from "../../../helpers/notify";

/**
 * DashboardDepartments renders list of departments for the admin
 */

class DashboardDepartments extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      allDeptData: [],
      searchText: "",
      selectedSort: "Sort by ID",
    };
    this.getAllDepts = this.getAllDepts.bind(this);
    this.searchDept = this.searchDept.bind(this);
    this.onSearchFieldChange = this.onSearchFieldChange.bind(this);
    this.sortValues = this.sortValues.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.getAllDepts();
  }

  // Function to get the list of all MDO available in the system
  getAllDepts = () => {
    DashboardService.getAllDepartments().then((response) => {
      if (
        response &&
        response.status === 200 &&
        response.data.result &&
        response.data.result.response &&
        response.data.result.response.content
      ) {
        this.setState({
          allDeptData: response.data.result.response.content,
        });
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  // Function which perfroms the sorting on department list
  sortValues = () => {
    if (this.state.selectedSort === "Sort by name") {
      let sortedValue = this.state.allDeptData.sort((a, b) =>
        a.orgName.toString().localeCompare(b.orgName.toString)
      );
      this.setState({
        allDeptData: sortedValue,
      });
    } else {
      this.getAllDepts();
    }
  };

  // Function detects the department search
  onSearchFieldChange = (e) => {
    e.preventDefault();
    if (e.target.value.length < 1) {
      this.getAllDepts();
      this.setState({
        searchText: "",
      });
    } else {
      this.setState({
        searchText: e.target.value,
      });
    }
  };

  // Function performs the department search operation
  searchDept = () => {
    DashboardService.searchDepartment(this.state.searchText).then(
      (response) => {
        if (
          response &&
          response.status === 200 &&
          response.data.result &&
          response.data.result.response &&
          response.data.result.response.content
        ) {
          this.setState({
            allDeptData: response.data.result.response.content,
          });
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      }
    );
  };

  componentWillUnmount() {
    this._isMounted = false;
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    return (
      <React.Fragment>
        <div className="col-12 custom-body-bg pb-3 pl-xs-0 pl-sm-0 pl-md-5 pl-lg-5 pl-xl-5">
          {/* Heading */}
          <h1 className="dashboard-heading-2 pt-5 pl-xs-0 pl-sm-0 pl-md-3 pl-lg-3 pl-xl-3 ml-xs-0 ml-sm-0 ml-md-3 ml-lg-3 ml-xl-3">
            All MDO
          </h1>

          {/* Row contains the search input and sort feature */}
          <div className="row pt-3 pb-1">
            <div className="col-xs-12 col-sm-12 col-md-7 col-lg-8 col-xl-8">
              <div className="row p-0">
                <div
                  className="col-xs-12 col-sm-12 col-md-5 col-lg-3 col-xl-3 mt-1 ml-xs-0 ml-sm-0 ml-md-3 ml-lg-3 ml-xl-3 pl-xs-0 pl-sm-0 pl-md-4 pl-lg-4 pl-xl-4"
                  id="officerBucketsList"
                >
                  <input
                    type="text"
                    className="form-control custom-search-6 custom-search-bar-4"
                    placeholder="Search..."
                    name="search"
                    value={this.state.searchText}
                    onChange={this.onSearchFieldChange}
                    id="departmentSearch"
                    autoComplete="off"
                  />
                </div>
                <button
                  type="button"
                  className="btn custom-primary-button-2 mr-3 ml-2"
                  onClick={() => {
                    this.searchDept();
                  }}
                >
                  Search
                </button>
              </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-5 col-lg-3 col-xl-3 pr-xs-0 pr-sm-0 pr-md-0 pr-lg-5 pr-xl-5">
              <div className="dropdown float-right mr-2">
                <button
                  className="btn sort-button dropdown-toggle"
                  type="button"
                  id="dropdownMenuSort"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {this.state.selectedSort}
                </button>
                <div
                  className="dropdown-menu custom-dropdown-toggle-menu"
                  aria-labelledby="dropdownMenuSort"
                >
                  {this.state.selectedSort === "Sort by name" && (
                    <label
                      className="dropdown-item"
                      onClick={() => {
                        this.setState(
                          {
                            selectedSort: "Sort by ID",
                          },
                          () => {
                            this.sortValues();
                          }
                        );
                      }}
                    >
                      Sort by ID
                    </label>
                  )}

                  {this.state.selectedSort === "Sort by ID" && (
                    <label
                      className="dropdown-item"
                      onClick={() => {
                        this.setState(
                          {
                            selectedSort: "Sort by name",
                          },
                          () => {
                            this.sortValues();
                          }
                        );
                      }}
                    >
                      Sort by name
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Displays the department list */}
          <div className="row mt-4 pb-5 ml-xs-0 ml-sm-0 ml-md-2 ml-lg-2 ml-xl-2 pl-xs-0 pl-sm-0 pl-md-4 pl-lg-4 pl-xl-4">
            {this.state.allDeptData &&
              this.state.allDeptData.map((value, index) => {
                return (
                  <div
                    className="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 card dashboard-cca-card pointer-style mr-3 ml-3 ml-xs-3 ml-sm-3 ml-md-0 ml-lg-0 ml-xl-0 mb-3"
                    key={value.id}
                  >
                    <div className="ml-0 mt-2 pt-1 pl-2">
                      <h1 className="pt-3">
                        {value.orgName}
                        <span>
                          <br />
                          <label className="custom-sub-heading-1 pb-2 pt-1">
                            {value.id}
                          </label>
                        </span>
                      </h1>
                    </div>
                  </div>
                );
              })}
            {this.state.allDeptData.length <= 0 && <p>No results found</p>}
          </div>
          <footer className="custom-footer version-label mb-3 mt-3">v11</footer>
        </div>
      </React.Fragment>
    );
  }
}

export default DashboardDepartments;
