import React from "react";
import { MasterService } from "../../../../services/master.service";
import Notify from "../../../../helpers/notify";
import { APP } from "../../../../constants";
import { capitalize } from "lodash";

/**
 * Custom filter component for Positions,
 * Roles and Activities
 */

class CustomFilters extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      selectedFilterBy: "Status",
      selectedFilterList: [],
      customFliterList: ["UNVERIFIED", "VERIFIED", "REJECTED", "DRAFT"],
      allFilterData: [],
      selectedSourceList: [],
      sourceList: [],
    };
    this.customToggle = this.customToggle.bind(this);
    this.applyCustomFilter = this.applyCustomFilter.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.getSourceList();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getSourceList() {
    if (this.props.type) {
      MasterService.getSourceList(this.props.type).then((response) => {
        if (response && response.data.statusInfo.statusCode === APP.CODE.SUCCESS) {
          this.setState({
            sourceList: response.data.responseData,
          });
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });
    }
  }

  customToggle = (name) => {
    // Enable multiple selection from the list in the modal
    if (this.state.selectedFilterList.length) {
      this.state.selectedFilterList.map((k, l) => {
        this.setState((prevState) => ({
          selectedFilterList: [k.name, ...prevState.selectedFilterList],
        }));
        return null;
      });
    }
    this.setState(
      {
        selectedFilterList: [...this.state.selectedFilterList, name],
      },
      () => {
        this.state.selectedFilterList.forEach((i, j) => {
          if (
            this.state.selectedFilterList.indexOf(i) !== j &&
            this.state.selectedFilterList.includes(name)
          ) {
            if (this.state.selectedFilterList.indexOf(name) > -1) {
              this.state.selectedFilterList.splice(
                this.state.selectedFilterList.indexOf(name),
                1
              );
              this.state.selectedFilterList.splice(
                this.state.selectedFilterList.indexOf(i),
                1
              );
            }
            this.setState({
              selectedFilterList: this.state.selectedFilterList,
            });
          }
        });
      }
    );
    if (this.state.selectedFilterList.length === 1) {
      this.props.filteredData();
    }
  };


  selectionToggleSource = (name) => {
    // Enable multiple selection from the list in the modal
    if (this.state.selectedSourceList.length) {
      this.state.selectedSourceList.map((k, l) => {
        this.setState((prevState) => ({
          selectedSourceList: [k.name, ...prevState.selectedSourceList],
        }));
        return null;
      });
    }
    this.setState(
      {
        selectedSourceList: [...this.state.selectedSourceList, name],
      },
      () => {
        this.state.selectedSourceList.forEach((i, j) => {
          if (
            this.state.selectedSourceList.indexOf(i) !== j &&
            this.state.selectedSourceList.includes(name)
          ) {
            if (this.state.selectedSourceList.indexOf(name) > -1) {
              this.state.selectedSourceList.splice(
                this.state.selectedSourceList.indexOf(name),
                1
              );
              this.state.selectedSourceList.splice(
                this.state.selectedSourceList.indexOf(i),
                1
              );
            }
            this.setState({
              selectedSourceList: this.state.selectedSourceList,
            });
          }
        });
      }
    );

    if (
      this.state.selectedSourceList.length === 1
    ) {
      this.props.filteredData();
    }

  }

  applyCustomFilter = () => {
    let payload;
    let filterApplied = false;
    if (this.state.selectedFilterList.length && this.props.type) {
      if (this.props.type === "POSITION") {
        filterApplied = true;
        payload = {
          type: this.props.type,
          department: this.props.dept,
          filters: [
            {
              field: "status",
              values: this.state.selectedFilterList,
            },
          ],
        };
      } else {
        filterApplied = true;
        payload = {
          type: this.props.type,
          filters: [
            {
              field: "status",
              values: this.state.selectedFilterList,
            },
          ],
        };
      }
    }
    // adding source filters
    if (this.state.selectedSourceList && this.state.selectedSourceList.length) {
      filterApplied = true;
      if (!payload || !payload.filters) {
        if (this.props.type === "POSITION") {
          payload = {
            type: this.props.type,
            department: this.props.dept,
            filters: []
          }
        } else {
          payload = {
            type: this.props.type,
            filters: []
          }
        }
      }
      payload.filters.push({
        field: "source",
        values: this.state.selectedSourceList,
      })
    }

    if (!filterApplied && this.props) {
      this.props.filteredData();
    }
    if (payload) {
      MasterService.filterNodes(payload).then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState(
            {
              allFilterData: response.data.responseData,
            },
            () => {
              if (this.props) {
                this.props.updateData(this.state.allFilterData);
              }
            }
          );
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });
    }
  };

  searchCustomFilters = () => {
    let input, filter, ul, li, i, txtValue;
    input = document.getElementById("customFilterSearch");
    filter = input.value.toUpperCase();
    ul = document.getElementById("searchListFilter");
    li = ul.getElementsByTagName("p");

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      txtValue = li[i].innerHTML;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
        ul.getElementsByTagName("input")[i].style.display = "";
      } else {
        li[i].style.display = "none";
        ul.getElementsByTagName("input")[i].style.display = "none";
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isNew !== this.props.isNew) {
      this.setState(
        {
          selectedFilterList: "",
        },
        () => {
          this.props.filteredData();
        }
      );
    }
  }

  render() {
    return (
      <React.Fragment>
        <div
          className="pointer-style"
          data-toggle="modal"
          data-target="#newFilterModal"
        >
          {(this.state.selectedFilterList.length > 0 ||
            this.state.selectedSourceList.length > 0) && (
              <p className="filter-1 bold-font-1">
                {"Filter applied(" + (this.state.selectedFilterList.length + this.state.selectedSourceList.length) + ")"}
              </p>
            )}
          {(!this.state.selectedFilterList.length > 0 &&
            !this.state.selectedSourceList.length) && (
              <p className="filter-1">Filter</p>
            )}
        </div>

        <div
          className="modal fade fadeInUp"
          id="newFilterModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="newFilterModalTitle"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            role="document"
          >
            <div className="modal-content">
              <div className="row ml-0 w-100">
                {/* Column one */}
                <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 pt-2">
                  <div className="modal-header">
                    <h5 className="modal-title" id="newFilterModalLongTitle">
                      Filter by
                    </h5>
                  </div>

                  <div className="pl-3 pt-3">
                    {this.state.selectedFilterList.length > 0 && (
                      <h4
                        className={`pointer-style bb-1 ${this.state.selectedFilterBy === "Status"
                          ? "active-list-selection-3"
                          : "list-selection-5"
                          } `}
                        onClick={() =>
                          this.setState({
                            selectedFilterBy: "Status",
                          })
                        }
                      >
                        {"Status" +
                          " (" +
                          this.state.selectedFilterList.length +
                          ")"}
                      </h4>
                    )}

                    {this.state.selectedFilterList.length === 0 && (
                      <h4
                        className={`pointer-style bb-1 ${this.state.selectedFilterBy === "Status"
                          ? "active-list-selection-3"
                          : "list-selection-5"
                          } `}
                        onClick={() =>
                          this.setState({
                            selectedFilterBy: "Status",
                          })
                        }
                      >
                        Status
                      </h4>
                    )}
                    <h4
                      className={`pointer-style bb-1 ${this.state.selectedFilterBy === "Source"
                        ? "active-list-selection-3"
                        : "list-selection-5"
                        } `}
                      onClick={() =>
                        this.setState({
                          selectedFilterBy: "Source",
                        })
                      }>
                      {(this.state.selectedSourceList && this.state.selectedSourceList.length > 0)
                        ? ("Source (" + this.state.selectedSourceList.length + ")")
                        : "Source"}
                    </h4>
                  </div>
                  <div className="modal-body remove-scroll-x"></div>
                </div>

                {/* Column two */}
                <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 custom-content-background pt-2">
                  {this.state.selectedFilterBy === "Source" && (
                    <div className="modal-header">
                      <div
                        className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 p-0"
                        id="officerBucketsList"
                      >
                        <input
                          type="text"
                          className="form-control mb-2 custom-search-7"
                          placeholder="Search..."
                          aria-label="Search"
                          id="customFilterSearch"
                          onKeyUp={this.searchCustomFilters}
                          aria-describedby="basic-addon1"
                        />
                      </div>
                    </div>
                  )}

                  <div className="modal-body remove-scroll-x pt-0">
                    {this.state.selectedFilterBy === "Status" && (
                      <div className="ml-4 mt-5">
                        <div id="customListFilter">
                          {this.state.customFliterList &&
                            this.state.customFliterList.map((i, j) => {
                              return (
                                <div
                                  className="row custom-search-checkbox-1"
                                  key={i}
                                >
                                  {this.state.selectedFilterList.includes(
                                    i
                                  ) && (
                                      <input
                                        checked
                                        type="checkbox"
                                        className="mr-3 custom-search-checkbox-1 mt-1"
                                        onChange={() => this.customToggle(i)}
                                      />
                                    )}
                                  {!this.state.selectedFilterList.includes(
                                    i
                                  ) && (
                                      <input
                                        type="checkbox"
                                        className="mr-3 custom-search-checkbox- mt-1"
                                        onChange={() => this.customToggle(i)}
                                      />
                                    )}

                                  <p
                                    className="filter-check-list pointer-style"
                                    onClick={() => this.customToggle(i)}
                                  >
                                    {capitalize(i)}
                                  </p>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                    {this.state.selectedFilterBy === "Source" && (
                      <React.Fragment>
                        <div className="ml-4">
                          <div id="searchListFilter">
                            {this.state.sourceList &&
                              this.state.sourceList.map((i, j) => {
                                return (
                                  <div
                                    className="row custom-search-checkbox-1"
                                    key={i}
                                  >
                                    {this.state.selectedSourceList.includes(
                                      i
                                    ) && (
                                        <input
                                          checked
                                          type="checkbox"
                                          className="mr-3 custom-search-checkbox-1 mt-1"
                                          onChange={() =>
                                            this.selectionToggleSource(i)
                                          }
                                        />
                                      )}
                                    {!this.state.selectedSourceList.includes(
                                      i
                                    ) && (
                                        <input
                                          type="checkbox"
                                          className="mr-3 custom-search-checkbox-1 mt-1"
                                          onChange={() =>
                                            this.selectionToggleSource(i)
                                          }
                                        />
                                      )}
                                    <p
                                      className="filter-check-list pointer-style"
                                      onClick={() =>
                                        this.selectionToggleSource(i)
                                      }
                                    >
                                      {i}
                                    </p>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <div className="row">
                  {(this.state.selectedFilterList.length > 0 ||
                    this.state.selectedSourceList.length > 0) && (
                      <button
                        type="button"
                        className="btn save-button mr-2 custom-primary-button-3"
                        data-dismiss="modal"
                        onClick={() =>
                          this.setState(
                            {
                              selectedFilterList: "",
                              selectedSourceList: ""
                            },
                            () => {
                              this.props.filteredData();
                            }
                          )
                        }
                      >
                        Clear all filters
                      </button>
                    )}

                  <button
                    type="button"
                    className="btn save-button mr-2 custom-primary-button-3"
                    data-dismiss="modal"
                  >
                    Close
                  </button>

                  {(this.state.selectedFilterList.length > 0 ||
                    this.state.selectedSourceList.length > 0) && (
                      <button
                        type="button"
                        className="btn save-button mr-2 custom-primary-button height-1"
                        onClick={() => this.applyCustomFilter()}
                        data-dismiss="modal"
                      >
                        Apply
                      </button>
                    )}

                  {/* {(this.state.selectedCAList.length > 0 ||
                    this.state.selectedTypeList.length > 0) && (
                    <button
                      type="button"
                      className="btn save-button mr-2 custom-primary-button"
                      onClick={() => this.applyFilter()}
                      data-dismiss="modal"
                    >
                      Apply
                    </button>
                  )}

                  {!this.state.selectedCAList.length > 0 &&
                    !this.state.selectedTypeList.length > 0 && (
                      <button
                        type="button"
                        className="btn save-button mr-2 custom-primary-button-disabled"
                        disabled
                      >
                        Apply
                      </button>
                    )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default CustomFilters;
