import React from "react";
import { NavLink } from "react-router-dom";
import { APP } from "../../../constants";
import { MasterService } from "../../../services/master.service";
import Notify from "../../../helpers/notify";
import CheckIcon from "../../../icons/stages/verified.svg";
import UnderReviewIcon from "../../../icons/stages/sent_for_review.svg";
import RejectedIcon from "../../../icons/stages/rejected.svg";
import CryptoJS from "crypto-js";
import { VariableSizeList } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"

const competencyType = [{
  name: "Behavioural",
  selected: false,
  filterType: "Competency type"
}, {
  name: "Domain",
  selected: false,
  filterType: "Competency type"
}, {
  name: "Functional",
  selected: false,
  filterType: "Competency type"
}]

class ListView extends React.Component {
  listRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      showPreview: false,
      status: "unverified",
      selectedFilterBy: "Source",
      selectedFilterCount: { All: 0, Source: 0, Area: 0, Type: 0 },
      roles: "",
      competencyAreaList: [],
    };
    this.statusSelection = this.statusSelection.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.getRoles = this.getRoles.bind(this);
  }

  componentDidMount() {
    this.getRoles();
    this.getCompetencyAreaList();
    this.scrollToSelectedItem();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.type !== this.props.type) {
      if (this.listRef.current) {
        this.listRef.current.scrollToItem(0, "center");
      }
      this.setState(
        {
          selectedFilterBy: "Source",
          selectedFilterCount: { All: 0, Source: 0, Area: 0, Type: 0 },
        },
        () => {
          this.getSourceList();
          this.getCompetencyAreaList();
          competencyType.forEach(element => {
            element.selected = false;
          });
        }
      );

    }
  }

  /**
   * Tab selection
   * @param {*} selectedStatus
   */
  statusSelection = (selectedStatus) => {
    if (selectedStatus) {
      this.setState({
        status: selectedStatus,
      });
    }
  };

  getRoles = () => {
    if (localStorage.getItem("stateFromNav")) {
      let bytes = CryptoJS.AES.decrypt(
        localStorage.getItem("stateFromNav"),
        "igotcheckIndia*"
      );
      let originalTextRoles = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      this.setState(
        {
          roles: originalTextRoles,
        },
        () => {
          this.getSourceList();
        }
      );
    }
  };

  getSourceList() {
    if (this.props.type) {
      MasterService.getSourceList(this.props.type).then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS &&
          response.data.responseData
        ) {
          let sourceFilter = []
          response.data.responseData.forEach(obj => {
            if (obj && obj !== null && obj !== "nill") {
              const sourceObj = {
                name: obj,
                selected: false,
                filterType: "Source"
              }
              sourceFilter.push(sourceObj);
            }
          });
          this.setState({
            sourceList: sourceFilter,
          });
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });
    }
  }

  // Function to get all competency area list
  getCompetencyAreaList = () => {
    MasterService.getNodesByType("COMPETENCYAREA").then((response) => {
      if (response && response.status === 200 && response.data.responseData) {
        let areaList = [];
        response.data.responseData.forEach(obj => {
          if (obj.name && obj.name !== null) {
            obj.selected = false;
            obj.filterType = "Competency area"
            areaList.push(obj);
          }
        });
        this.setState({
          competencyAreaList: areaList,
        });
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  getMetaObject = (type) => {
    const metaObj = {
      path: APP.ROUTES_PATH.REVIEW,
      borderColor: "default-border-1",
    };
    if (type.toUpperCase() === APP.COLLECTIONS.POSITION) {
      metaObj.path = APP.ROUTES_PATH.REVIEW_POSITION;
      metaObj.borderColor = "position-border-1";
    } else if (type.toUpperCase() === APP.COLLECTIONS.ROLE) {
      metaObj.path = APP.ROUTES_PATH.REVIEW_ROLES;
      metaObj.borderColor = "role-border-1";
    } else if (type.toUpperCase() === APP.COLLECTIONS.ACTIVITY) {
      metaObj.path = APP.ROUTES_PATH.REVIEW_ACTIVITIES;
      metaObj.borderColor = "activity-border-1";
    } else if (type.toUpperCase() === APP.COLLECTIONS.COMPETENCY) {
      metaObj.path = APP.ROUTES_PATH.REVIEW_COMPETENCY;
      metaObj.borderColor = "competency-border-1";
    }
    return metaObj;
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
  };

  selectionToggleSource = (selectedObj) => {
    if (selectedObj) {
      selectedObj.selected = !selectedObj.selected

      const all = (selectedObj.selected) ? this.state.selectedFilterCount.All + 1
        : this.state.selectedFilterCount.All - 1;
      let source = this.state.selectedFilterCount.Source;
      let area = this.state.selectedFilterCount.Area;
      let type = this.state.selectedFilterCount.Type;
      if (selectedObj.filterType === "Source") {
        source = (selectedObj.selected) ? this.state.selectedFilterCount.Type + 1
          : this.state.selectedFilterCount.Type - 1
      }
      if (selectedObj.filterType === "Competency area") {
        area = (selectedObj.selected) ? this.state.selectedFilterCount.Area + 1
          : this.state.selectedFilterCount.Area - 1
      }
      if (selectedObj.filterType === "Competency type") {
        type = (selectedObj.selected) ? this.state.selectedFilterCount.Type + 1
          : this.state.selectedFilterCount.Type - 1
      }
      this.setState({
        selectedFilterCount: {
          All: all,
          Source: source,
          Area: area,
          Type: type,
        }
      });
    }
  };

  applyFilter = () => {
    let payload = {
      type: this.props.type,
      filters: [],
    };
    // adding source filters
    if (this.state.selectedFilterCount.All > 0) {
      if (this.state.selectedFilterCount.Source > 0) {
        let selectedValue = [];
        this.state.sourceList.forEach(element => {
          if (element.selected) {
            selectedValue.push(element.name)
          }
        });
        payload.filters.push({
          field: "source",
          values: selectedValue
        });
      }
      if (this.state.selectedFilterCount.Area > 0) {
        let selectedValue = [];
        this.state.competencyAreaList.forEach(element => {
          if (element.selected) {
            selectedValue.push(element.name)
          }
        });
        payload.filters.push({
          field: "area",
          values: selectedValue
        });
      }
      if (this.state.selectedFilterCount.Type > 0) {
        let selectedValue = [];
        competencyType.forEach(element => {
          if (element.selected) {
            selectedValue.push(element.name)
          }
        });
        payload.filters.push({
          field: "type",
          values: selectedValue
        });
      }
    }
    return payload;
  };

  clearAllFilter = () => {
    this.state.competencyAreaList.forEach(element => {
      element.selected = false;
    });
    this.state.sourceList.forEach(element => {
      element.selected = false;
    });
    competencyType.forEach(element => {
      element.selected = false;
    });

    this.setState({
      competencyAreaList: this.state.competencyAreaList,
      sourceFilter: this.state.sourceFilter,
      selectedFilterCount: { All: 0, Source: 0, Area: 0, Type: 0 },
    }, () => {
      this.props.filterReviewNodes(this.applyFilter());
    })
  }

  scrollToSelectedItem = () => {
    setTimeout(() => {
      if (this.props.location && this.props.location.pathname && this.props.type) {
        const elementId = this.props.location.pathname.split(this.getMetaObject(this.props.type).path);
        if (elementId.length > 1) {
          const elementIndex = this.props.reviewData[this.state.status].findIndex(obj => obj.id === elementId[1]);
          if (elementIndex > 0) {
            if (this.listRef.current) {
              this.listRef.current.scrollToItem(elementIndex, "center");
            }
          }
        }
      }
    }, 1500);
  }
  render() {
    const viewAllItems = ({ index, style }) =>
      <div style={style}>
        <NavLink
          key={this.props.reviewData[this.state.status][index].id}
          to={{
            pathname: this.getMetaObject(this.props.reviewData[this.state.status][index].type).path
              + this.props.reviewData[this.state.status][index].id,
            state: {
              showColumnThree: true,
              id: this.props.reviewData[this.state.status][index].id,
              type: this.props.reviewData[this.state.status][index].type,
            },
          }}>
          <div
            className={`pl-3 pt-3 ml-1 mr-1 mb-1 ${this.props.reviewData[this.state.status][index].type
              && this.getMetaObject(this.props.reviewData[this.state.status][index].type).borderColor
              }  ${this.props.history &&
                this.props.history.location.pathname ===
                (this.getMetaObject(this.props.type).path + this.props.reviewData[this.state.status][index].id)
                ? "active-list-selection-1"
                : "list-selection-1"
              }`}
            onClick={() => {
              this.props.getSelectedId(this.props.reviewData[this.state.status][index].id,
                this.props.reviewData[this.state.status][index].type);
            }}>
            <div className="row p-0 w-100">
              <div className="col-10">
                <h3 className="custom-heading-1 truncateText"
                  title={this.props.type === APP.COLLECTIONS.ACTIVITY
                    ? (this.props.reviewData[this.state.status][index].description)
                    : (this.props.reviewData[this.state.status][index].name)}>
                  {this.props.type === APP.COLLECTIONS.ACTIVITY
                    ? (this.props.reviewData[this.state.status][index].description)
                    : (this.props.reviewData[this.state.status][index].name)}
                </h3>
                <p className="custom-sub-heading-1">{this.props.reviewData[this.state.status][index].id}</p>
              </div>
              {this.props.reviewData[this.state.status][index].nodeStatus
                && this.props.reviewData[this.state.status][index].nodeStatus === APP.NODE_STATUS.UNVERIFIED && (
                  <div className="col-2 center-align">
                    <span className="under-review-icon-1 pr-0">
                      <img
                        src={UnderReviewIcon}
                        alt="review stage"
                      />
                    </span>
                  </div>
                )}
              {this.props.reviewData[this.state.status][index].nodeStatus &&
                this.props.reviewData[this.state.status][index].nodeStatus === APP.NODE_STATUS.VERIFIED && (
                  <div className="col-2 center-align">
                    <span className="check-icon-1 pr-0">
                      <img src={CheckIcon} alt="verified stage" />
                    </span>
                  </div>
                )}
              {this.props.reviewData[this.state.status][index].nodeStatus &&
                this.props.reviewData[this.state.status][index].nodeStatus === APP.NODE_STATUS.REJECTED && (
                  <div className="col-2 center-align">
                    <span className="cancel-icon-1 pr-0">
                      <img
                        src={RejectedIcon}
                        alt="rejected stage"
                      />
                    </span>
                  </div>
                )}
            </div>
          </div>
        </NavLink>
      </div>

    return (
      <div
        className="custom-body-bg-2 custom-full-height-4 col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2"
        id="officerColumn3"
      >
        {/*Search Nodes*/}
        <div className="col-12 mt-4 mb-4">
          <div className="row">
            <div className="col-9" id="officerBucketsList">
              <input
                style={{ width: "148%", marginLeft: "-0.5rem" }}
                type="text"
                className="form-control custom-search-5"
                placeholder="Search for an item"
                aria-label="Search"
                id="searchNode"
                onKeyUp={this.props.searchNode}
                aria-describedby="basic-addon1"
                autoComplete="off"
              />
            </div>
            <div className="col-3">
              {this.props.searchVal && (
                <span
                  className="material-icons competency-area-close-button-4 float-right"
                  onClick={() => {
                    document.getElementById("searchNode").value = "";
                    this.props.searchNode();
                  }}
                >
                  close
                </span>
              )}
            </div>
          </div>
        </div>
        {/* Tab selection */}
        <div className="d-flex row mt-4 mb-4 justify-content-around">
          {/* Unverified */}
          <div
            className="status-tab"
            onClick={() => {
              this.statusSelection("unverified");
            }}
          >
            <img src={UnderReviewIcon} alt="review stage" />
            {this.props.reviewData.unverified &&
              this.props.reviewData.unverified.length ? (
              <span
                className={`search-count ${this.state.status && this.state.status === "unverified"
                  ? "unverified-color"
                  : ""
                  }`}
              >
                {this.props.reviewData.unverified.length}
              </span>
            ) : (
              <span
                className={`search-count ${this.state.status && this.state.status === "unverified"
                  ? "unverified-color"
                  : ""
                  }`}
              >
                0
              </span>
            )}
            <div
              className={`item-status-label-1 ${this.state.status &&
                this.state.status === "unverified" &&
                "unverified-color"
                } `}
            >
              Unverified
            </div>
            <hr
              className={`${this.state.status && this.state.status === "unverified"
                ? "review-btmLine unverified-color item-status-label-1"
                : "review-btmLineNone item-status-label-2"
                } `}
            ></hr>
          </div>

          {/* Verified */}
          <div
            className="status-tab"
            onClick={() => {
              this.statusSelection("verified");
            }}
          >
            <img src={CheckIcon} alt="verified stage" />
            {this.props.reviewData.verified &&
              this.props.reviewData.verified.length ? (
              <span
                className={`search-count ${this.state.status && this.state.status === "verified"
                  ? "verified-color"
                  : ""
                  }`}
              >
                {this.props.reviewData.verified.length}
              </span>
            ) : (
              <span
                className={`search-count ${this.state.status && this.state.status === "verified"
                  ? "verified-color"
                  : ""
                  }`}
              >
                0
              </span>
            )}
            <div
              className={`item-status-label-1 ${this.state.status &&
                this.state.status === "verified" &&
                "verified-color"
                } `}
            >
              Verified
            </div>

            <hr
              className={`${this.state.status && this.state.status === "verified"
                ? "review-btmLine verified-color item-status-label-1"
                : "review-btmLineNone item-status-label-2"
                } `}
            ></hr>
          </div>

          {/* Rejected */}
          <div
            className="status-tab"
            onClick={() => {
              this.statusSelection("rejected");
            }}
          >
            <img src={RejectedIcon} alt="rejected stage" />
            {this.props.reviewData.rejected &&
              this.props.reviewData.rejected.length ? (
              <span
                className={`search-count ${this.state.status && this.state.status === "rejected"
                  ? "rejected-color"
                  : ""
                  }`}
              >
                {this.props.reviewData.rejected.length}
              </span>
            ) : (
              <span
                className={`search-count ${this.state.status && this.state.status === "rejected"
                  ? "rejected-color"
                  : ""
                  }`}
              >
                0
              </span>
            )}
            <div
              className={`item-status-label-1 ${this.state.status &&
                this.state.status === "rejected" &&
                "rejected-color"
                } `}
            >
              Rejected
            </div>
            <hr
              className={`${this.state.status && this.state.status === "rejected"
                ? "review-btmLine rejected-color item-status-label-1"
                : "review-btmLineNone item-status-label-2"
                } `}
            ></hr>
          </div>
        </div>
        <h3
          className={`pl-1 ${this.state.status === "unverified list-heading-1"
            ? ""
            : "text-capitalize list-heading-1"
            }`}
        >
          {this.state.status === "unverified"
            ? "Unverified"
            : this.state.status}
        </h3>
        {/* Filters */}
        <div
          className="pointer-style pt-3"
          data-toggle="modal"
          data-target="#newFilterModal"
          onClick={() => { }}
        >
          <p
            className={`filter-1 filter-2 ${this.state.selectedFilterCount.All > 0
              ? ("filter-1", "bold-font-1")
              : ""
              }`}
          >
            {this.state.selectedFilterCount.All > 0
              ? "Filter applied (" + this.state.selectedFilterCount.All + ")"
              : "Filter"}
          </p>
        </div>
        {/* Items List */}
        <div className="mt-4 mb-4">
          {this.props.reviewData &&
            this.props.reviewData[this.state.status] &&
            this.props.reviewData[this.state.status].length ? (
            <div
              style={{
                height: "68vh",
                width: "100%",
              }} >
              <AutoSizer>
                {({ height, width }) => (
                  <VariableSizeList
                    height={height}
                    width={width}
                    itemCount={this.props.reviewData[this.state.status].length}
                    itemSize={index => ((this.props.type === APP.COLLECTIONS.ACTIVITY
                      && !this.props.reviewData[this.state.status][index].description) ||
                      (this.props.type !== APP.COLLECTIONS.ACTIVITY && !this.props.reviewData[this.state.status][index].name))
                      ? 70 : 85}
                    ref={this.listRef}
                    overscanCount={100}>
                    {viewAllItems}
                  </VariableSizeList>
                )}
              </AutoSizer>
            </div>
          ) : (
            // If no items in the list
            <p className="pt-3 pl-3 activity-log-name m-0 text-center">
              No Data found!
            </p>
          )}
        </div>

        {/* Filter modal */}
        <div
          className="modal fade fadeInUp"
          id="newFilterModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="newFilterModalTitle"
          aria-hidden="true">
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            role="document">
            <div className="modal-content">
              <div className="row ml-0 w-100">
                <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 pt-2">
                  <div className="modal-header">
                    <h5 className="modal-title" id="newFilterModalLongTitle">
                      Filter by
                    </h5>
                  </div>
                  <div className="pl-3 pt-3">
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
                      {this.state.selectedFilterCount &&
                        this.state.selectedFilterCount.Source > 0
                        ? "Source (" +
                        this.state.selectedFilterCount.Source +
                        ")"
                        : "Source"}
                    </h4>
                    {this.props.type === APP.COLLECTIONS.COMPETENCY && (
                      <React.Fragment>
                        <h4
                          className={`pointer-style bb-1 ${this.state.selectedFilterBy === "Competency area"
                            ? "active-list-selection-3"
                            : "list-selection-5"
                            } `}
                          onClick={() =>
                            this.setState({
                              selectedFilterBy: "Competency area",
                            })
                          }>
                          {this.state.selectedFilterCount &&
                            this.state.selectedFilterCount.Area > 0
                            ? "Competency area (" +
                            this.state.selectedFilterCount.Area +
                            ")"
                            : "Competency area"}
                        </h4>
                        <h4
                          className={`pointer-style bb-1 ${this.state.selectedFilterBy === "Competency type"
                            ? "active-list-selection-3"
                            : "list-selection-5"
                            } `}
                          onClick={() =>
                            this.setState({
                              selectedFilterBy: "Competency type",
                            })
                          }>
                          {this.state.selectedFilterCount &&
                            this.state.selectedFilterCount.Type > 0
                            ? "Competency type (" +
                            this.state.selectedFilterCount.Type +
                            ")"
                            : "Competency type"}
                        </h4>
                      </React.Fragment>
                    )}
                  </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 custom-content-background pt-2">
                  {/* Source Filter */}
                  {this.state.selectedFilterBy === "Source" && (
                    <div className="modal-header">
                      <div
                        className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 p-0"
                        id="officerBucketsList">
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
                  {this.state.selectedFilterBy === "Source" && (
                    <div className="modal-body remove-scroll-x pt-0">
                      <div className="ml-4">
                        <div id="searchListFilter">
                          {this.state.sourceList &&
                            this.state.sourceList.map((i, j) => {
                              return (
                                <div
                                  className="row custom-search-checkbox-1"
                                  key={j}>
                                  <input
                                    checked={i.selected}
                                    value={i.selected}
                                    type="checkbox"
                                    className="mr-3 custom-search-checkbox-1 mt-1"
                                    onChange={() =>
                                      this.selectionToggleSource(i)
                                    } />
                                  <p
                                    className="filter-check-list pointer-style"
                                    onClick={() =>
                                      this.selectionToggleSource(i)
                                    }>
                                    {i.name}
                                  </p>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Competency area filter  */}
                  {this.state.selectedFilterBy === "Competency area" && (
                    <div className="modal-header">
                      <div
                        className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 p-0"
                        id="officerBucketsList">
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
                  {this.state.selectedFilterBy === "Competency area" && (
                    <div className="modal-body remove-scroll-x pt-0">
                      <div className="ml-4">
                        <div id="searchListFilter">
                          {this.state.competencyAreaList &&
                            this.state.competencyAreaList.map((i, j) => {
                              return (
                                <div
                                  className="row custom-search-checkbox-1"
                                  key={j}>
                                  <input
                                    checked={i.selected}
                                    value={i.selected}
                                    type="checkbox"
                                    className="mr-3 custom-search-checkbox-1 mt-1"
                                    onChange={() =>
                                      this.selectionToggleSource(i)
                                    } />
                                  <p
                                    className="filter-check-list pointer-style"
                                    onClick={() =>
                                      this.selectionToggleSource(i)
                                    }>
                                    {i.name}
                                  </p>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Competency type filter */}
                  {this.state.selectedFilterBy === "Competency type" && (
                    <div className="modal-header">
                      <div
                        className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 p-0"
                        id="officerBucketsList">
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
                  {this.state.selectedFilterBy === "Competency type" && (
                    <div className="modal-body remove-scroll-x pt-0">
                      <div className="ml-4">
                        <div id="searchListFilter">
                          {competencyType &&
                            competencyType.map((i, j) => {
                              return (
                                <div
                                  className="row custom-search-checkbox-1"
                                  key={j}>
                                  <input
                                    checked={i.selected}
                                    value={i.selected}
                                    type="checkbox"
                                    className="mr-3 custom-search-checkbox-1 mt-1"
                                    onChange={() =>
                                      this.selectionToggleSource(i)
                                    } />
                                  <p
                                    className="filter-check-list pointer-style"
                                    onClick={() =>
                                      this.selectionToggleSource(i)
                                    }>
                                    {i.name}
                                  </p>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <div className="row">
                  {this.state.selectedFilterCount.All > 0 && (
                    <button
                      type="button"
                      className="btn save-button mr-2 custom-primary-button-3"
                      data-dismiss="modal"
                      onClick={() =>
                        this.clearAllFilter()
                      }>
                      Clear all filters
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn save-button mr-2 custom-primary-button-3"
                    data-dismiss="modal">
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn save-button mr-2 custom-primary-button height-1"
                    disabled={!this.state.selectedFilterCount.All > 0}
                    onClick={() => {
                      this.props.filterReviewNodes(this.applyFilter());
                    }}
                    data-dismiss="modal">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ListView;
