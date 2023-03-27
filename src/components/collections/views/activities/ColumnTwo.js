import React from "react";
import { NavLink } from "react-router-dom";
import { MasterService } from "../../../../services/master.service";
import Notify from "../../../../helpers/notify";
import { APP } from "../../../../constants";
import CryptoJS from "crypto-js";
import DraftIcon from "../../../../icons/stages/draft.svg";
import CheckIcon from "../../../../icons/stages/verified.svg";
import UnderReviewIcon from "../../../../icons/stages/sent_for_review.svg";
import RejectedIcon from "../../../../icons/stages/rejected.svg";
import CustomFilters from "../common/CustomFilters";
import { VariableSizeList } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"


class ColumnTwo extends React.Component {
  listRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      isNewActivity: false,
      allActivityData: [],
      activityResponse: [],
      activityDetails: [],
      currentDept: "",
      roles: "",
      searchString: ""
    };
    this.createNewActivity = this.createNewActivity.bind(this);
    this.searchActivity = this.searchActivity.bind(this);
    this.getActivityData = this.getActivityData.bind(this);
    this.decryptUtility = this.decryptUtility.bind(this);
    this.updateActivityData = this.updateActivityData.bind(this);
    this.getRoles = this.getRoles.bind(this);
  }

  componentDidMount() {
    if (localStorage.getItem("department")) {
      this.decryptUtility();
    }
    this.getRoles();
  }

  decryptUtility = () => {
    let bytes = CryptoJS.AES.decrypt(
      localStorage.getItem("department"),
      "igotcheckIndia*"
    );
    let originalText = bytes.toString(CryptoJS.enc.Utf8);

    this.setState(
      {
        currentDept: originalText,
      },
      () => {
        this.getActivityData("ACTIVITY", this.state.currentDept);
      }
    );
  };

  getRoles = () => {
    if (localStorage.getItem("stateFromNav")) {
      let bytes = CryptoJS.AES.decrypt(
        localStorage.getItem("stateFromNav"),
        "igotcheckIndia*"
      );
      let originalTextRoles = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      this.setState({
        roles: originalTextRoles,
      });
    }
  };

  getActivityData = (type, dept) => {
    if (dept !== "All MDO") {
      MasterService.getNodesByTypeAndDept(type, dept).then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState({
            allActivityData: response.data.responseData,
            activityResponse: response.data.responseData,
          }, () => {
            if (this.props.location && this.props.location.pathname) {
              const elementId = this.props.location.pathname.split(APP.COLLECTIONS_PATH.ACTIVITY);
              if (elementId.length > 1) {
                const elementIndex = this.state.activityResponse.findIndex(obj => obj.id === elementId[1]);
                if (elementIndex > 0) {
                  setTimeout(() => {
                    if (this.listRef.current) {
                      this.listRef.current.scrollToItem(elementIndex, "auto");
                    }
                  }, 500);
                }
              }
            }
          });
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });
    } else {
      MasterService.getNodesByType(type).then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState({
            allActivityData: response.data.responseData,
            activityResponse: response.data.responseData,
          }, () => {
            if (this.props.location && this.props.location.pathname) {
              const elementId = this.props.location.pathname.split(APP.COLLECTIONS_PATH.ACTIVITY);
              if (elementId.length > 1) {
                const elementIndex = this.state.activityResponse.findIndex(obj => obj.id === elementId[1]);
                if (elementIndex > 0) {
                  setTimeout(() => {
                    if (this.listRef.current) {
                      this.listRef.current.scrollToItem(elementIndex, "center");
                    }
                  }, 500);
                }
              }
            }
          });
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });
    }
  };

  searchActivity = (e) => {
    if (e && e.target && (e.target.value || e.target.value === "")) {
      this.setState({
        searchString: e.target.value
      }, () => {
        this.setState({
          allActivityData: this.state.activityResponse.filter((obj) => (obj.name
            && obj.name.toLowerCase().includes(this.state.searchString.toLowerCase())) ||
            (obj.id
              && obj.id.toLowerCase().includes(this.state.searchString.toLowerCase()))
            || (obj.description
              && obj.description.toLowerCase().includes(this.state.searchString.toLowerCase())))
        })
      })
    } else {
      this.setState({
        allActivityData: this.state.activityResponse
      })
    };
  }

  createNewActivity = () => {
    let scroll = document.getElementById("new");
    scroll.scrollIntoView();
    this.setState(
      {
        isNewActivity: true,
      },
      () => {
        this.props.history.push({
          pathname: "/collection-activities/0",
          state: { isNewActivity: true, id: 0, type: "ACTIVITY" },
        });
      }
    );
    if (
      this.props.history &&
      this.props.history.location.state &&
      this.props.history.location.state.isNewActivity
    ) {
      this.setState({
        isNewActivity: true,
      });
    }
  };

  updateActivityData = (data) => {
    this.setState({
      allActivityData: data,
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.department !== this.props.department) {
      this.decryptUtility();
    }
    if (
      prevProps.location &&
      prevProps.location.state &&
      prevProps.location.state.stayOn !==
      this.props.history.location.state.stayOn
    ) {
      this.setState({
        isNewActivity: false,
      });
      this.props.history.location.state.stayOn = false;
      setTimeout(() => {
        this.getActivityData("ACTIVITY", this.state.currentDept);
      }, 800);
    }

    // Trigger to update socket room details
    if (this.props.location && prevProps.location) {
      if (this.props.location.state && prevProps.location.state) {
        if (this.props.location.state.id !== prevProps.location.state.id) {
          this.props.getRoomId(this.props.location.state.id);
        }
      } else {
        if (this.props.location.state) {
          this.props.getRoomId(this.props.location.state.id);
        }
      }
    }
  }

  render() {
    const viewAllActivity = ({ index, style }) =>
      <div style={style}>
        <NavLink
          key={this.state.allActivityData[index].id}
          id={this.state.allActivityData[index].id}
          className=""
          to={{
            pathname: "/collection-activities/" + this.state.allActivityData[index].id,
            state: {
              showColumnThree: true,
              id: this.state.allActivityData[index].id,
              type: "ACTIVITY",
            },
          }}
        >
          <div
            className={`pl-3 pt-3 ml-1 mr-1 mb-1 ${this.props.history &&
              this.props.history.location.pathname ===
              "/collection-activities/" + this.state.allActivityData[index].id
              ? "active-list-selection-1 activity-border-1"
              : "list-selection-1 activity-border-1"
              } `}
          >
            <div className="row p-0 w-100">
              <div className="col-10">
                <h3 className="custom-heading-1 description-preview">{this.state.allActivityData[index].name
                  ? this.state.allActivityData[index].name : this.state.allActivityData[index].description}</h3>
                {this.state.allActivityData[index].name === null && (
                  <React.Fragment>
                    <h3 className="custom-heading-1">{this.state.allActivityData[index].id}</h3>
                    <p className="custom-sub-heading-1 description-preview">
                      {this.state.allActivityData[index].description}
                    </p>
                  </React.Fragment>
                )}
                {this.state.allActivityData[index].name !== null && (
                  <p className="custom-sub-heading-1">{this.state.allActivityData[index].id}</p>
                )}
              </div>
              {(this.state.allActivityData[index].status
                && (this.state.allActivityData[index].status === "DRAFT"
                  || this.state.allActivityData[index].status === APP.NODE_STATUS.REJECTED))
                ? (
                  <React.Fragment>
                    {(this.state.allActivityData[index].status === "DRAFT") && (
                      <div className="col-2 center-align">
                        <span className="draft-icon-1 pr-0">
                          <img src={DraftIcon} alt="draft stage" />
                        </span>
                      </div>
                    )}
                    {(this.state.allActivityData[index].status === APP.NODE_STATUS.REJECTED) && (
                      <div className="col-2 center-align">
                        <span className="cancel-icon-1 pr-0">
                          <img src={RejectedIcon} alt="rejected stage" />
                        </span>
                      </div>
                    )}
                  </React.Fragment>
                )
                : (
                  <React.Fragment>
                    {(!this.state.allActivityData[index].secondaryStatus
                      || this.state.allActivityData[index].secondaryStatus === "UNVERIFIED") && (
                        <div className="col-2 center-align">
                          <span className="under-review-icon-1 pr-0">
                            <img src={UnderReviewIcon} alt="review stage" />
                          </span>
                        </div>
                      )}
                    {(this.state.allActivityData[index].secondaryStatus
                      && this.state.allActivityData[index].secondaryStatus === "VERIFIED") && (
                        <div className="col-2 center-align">
                          <span className="check-icon-1 pr-0">
                            <img src={CheckIcon} alt="verified stage" />
                          </span>
                        </div>
                      )}
                    {(this.state.allActivityData[index].secondaryStatus
                      && this.state.allActivityData[index].secondaryStatus === "REJECTED") && (
                        <div className="col-2 center-align">
                          <span className="cancel-icon-1 pr-0">
                            <img src={RejectedIcon} alt="rejected stage" />
                          </span>
                        </div>
                      )}
                  </React.Fragment>
                )
              }
            </div>
          </div>
        </NavLink>
      </div>
    return (
      <div
        className="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 bordered custom-full-height-4"
        id="officerColumn3">
        <div className="p-1">
          <h1 className="mt-3 mb-4">Search for an Activity</h1>
          <div className="row col-12 p-0">
            <div className="col-9" id="officerBucketsList">
              <input
                type="text"
                style={{ width: "140%" }}
                className="form-control mb-4 custom-search-5"
                placeholder="Search..."
                aria-label="Search"
                id="activitySearch"
                value={this.state.searchString}
                onChange={this.searchActivity}
                aria-describedby="basic-addon1"
                autoComplete="off"
              />
            </div>
            <div className="col-2">
              {this.state.clearSearch && (
                <span
                  className="material-icons competency-area-close-button-4"
                  onClick={() => {
                    this.setState(
                      {
                        clearSearchInput: true,
                      },
                      () => {
                        document.getElementById("activitySearch").value = "";
                        this.searchActivity();
                      }
                    );
                  }}
                >
                  close
                </span>
              )}
            </div>
          </div>
          <CustomFilters
            type="ACTIVITY"
            dept={this.state.currentDept}
            filteredData={() => {
              this.getActivityData("ACTIVITY", this.state.currentDept);
            }}
            updateData={this.updateActivityData}
            isNew={this.state.isNewActivity}
          />

          <div className="custom-div-size-1">
            <div id="activityList">
              {/* New activity */}
              <div className="" id="new">
                {(this.state.isNewActivity ||
                  (this.props.history &&
                    this.props.history.location.state &&
                    this.props.history.location.state.isNewActivity)) && (
                    <NavLink
                      className=""
                      to={{
                        pathname: "/collection-activities/0",
                        state: { isNewActivity: true, id: 0, type: "ACTIVITY" },
                      }}
                    >
                      <div
                        className={`pl-3 pt-3 ml-1 mr-1 mb-1 fadeInUp ${this.props.history &&
                          this.props.history.location.pathname ===
                          "/collection-activities/0"
                          ? "active-list-selection-1 activity-border-1"
                          : "new-profile-list activity-border-1"
                          } `}
                      >
                        <h3 className="new-item custom-heading-1">
                          *Activity type
                        </h3>
                        <p className="custom-sub-heading-1 new-item">AID000</p>
                      </div>
                    </NavLink>
                  )}
              </div>
              {/* Existing activity */}
              {this.state.allActivityData && this.state.allActivityData.length > 0 && (
                <div
                  style={{
                    height: "69vh",
                    width: "100%",
                  }} >
                  <AutoSizer>
                    {({ height, width }) => (
                      <VariableSizeList
                        height={height}
                        width={width}
                        itemCount={this.state.allActivityData.length}
                        ref={this.listRef}
                        itemSize={index => this.state.allActivityData[index].description ? 85 : 70}
                        overscanCount={100}>
                        {viewAllActivity}
                      </VariableSizeList>
                    )}
                  </AutoSizer>
                </div>
              )}
              {this.state.allActivityData.length === 0 &&
                !this.state.isNewActivity && (
                  <p className="pt-3 pl-3 activity-log-name m-0">
                    No activity found!
                  </p>
                )}
            </div>
          </div>
        </div>
        <button
          type="button"
          className="btn save-button p-3 push-bottom-3 custom-primary-button-3 button-type-3"
          onClick={this.createNewActivity}
        >
          New Activity
        </button>
      </div>
    );
  }
}

export default ColumnTwo;
