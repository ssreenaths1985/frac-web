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
      isNewRole: false,
      allRolesData: [],
      rolesResponse: [],
      roleDetails: [],
      currentDept: "",
      roles: "",
      searchString: ""
    };
    this.createNewRole = this.createNewRole.bind(this);
    this.searchRole = this.searchRole.bind(this);
    this.getRoleData = this.getRoleData.bind(this);
    this.decryptUtility = this.decryptUtility.bind(this);
    this.updateRoleData = this.updateRoleData.bind(this);
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
        this.getRoleData("ROLE", this.state.currentDept);
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

  getRoleData = (type, dept) => {
    if (dept !== "All MDO") {
      MasterService.getNodesByTypeAndDept(type, dept).then((response) => {
        this.handleGetRoleResponse(response);
      });
    } else {
      MasterService.getNodesByType(type).then((response) => {
        this.handleGetRoleResponse(response);
      });
    }
  };

  handleGetRoleResponse = (response) => {
    if (
      response &&
      response.data.statusInfo.statusCode === APP.CODE.SUCCESS
    ) {
      this.setState({
        allRolesData: response.data.responseData,
        rolesResponse: response.data.responseData,
      }, () => {
        if (this.props.location && this.props.location.pathname) {
          const elementId = this.props.location.pathname.split(APP.COLLECTIONS_PATH.ROLE);
          if (elementId.length > 1) {
            const elementIndex = this.state.rolesResponse.findIndex(obj => obj.id === elementId[1]);
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
  }

  searchRole = (e) => {
    if (e && e.target && (e.target.value || e.target.value === "")) {
      this.setState({
        searchString: e.target.value
      }, () => {
        this.setState({
          allRolesData: this.state.rolesResponse.filter((obj) => (obj.name
            && obj.name.toLowerCase().includes(this.state.searchString.toLowerCase())) ||
            (obj.id
              && obj.id.toLowerCase().includes(this.state.searchString.toLowerCase())))
        })
      })
    } else {
      this.setState({
        allRolesData: this.state.rolesResponse
      })
    }
  };

  createNewRole = () => {
    let scroll = document.getElementById("new");
    scroll.scrollIntoView();
    this.setState(
      {
        isNewRole: true,
      },
      () => {
        this.props.history.push({
          pathname: "/collection-roles/0",
          state: { isNewRole: true, id: 0, type: "ROLE" },
        });
      }
    );
    if (
      this.props.history &&
      this.props.history.location.state &&
      this.props.history.location.state.isNewRole
    ) {
      this.setState({
        isNewRole: true,
      });
    }
  };

  updateRoleData = (data) => {
    this.setState({
      allRolesData: data,
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
        isNewRole: false,
      });

      this.props.history.location.state.stayOn = false;
      setTimeout(() => {
        this.getRoleData("ROLE", this.state.currentDept);
      }, 800);
    }

    // Trigger to update socket room details
    if (this.props.location && prevProps.location) {
      if (this.props.location.state && prevProps.location.state) {
        if (this.props.location.state.id !== prevProps.location.state.id) {
          this.props.getRoomId(this.props.location.state.id);
        }
      }
    }
  }

  render() {
    const viewAllRoles = ({ index, style }) =>
      <div style={style}>
        <NavLink
          key={this.state.allRolesData[index].id}
          id={this.state.allRolesData[index].id}
          className=""
          to={{
            pathname: "/collection-roles/" + this.state.allRolesData[index].id,
            state: {
              showColumnThree: true,
              id: this.state.allRolesData[index].id,
              type: "ROLE",
            },
          }}>
          <div
            className={`pl-3 pt-3 ml-1 mr-1 mb-1 ${this.props.history &&
              this.props.history.location.pathname ===
              "/collection-roles/" + this.state.allRolesData[index].id
              ? "active-list-selection-1 role-border-1"
              : "list-selection-1 role-border-1"
              } `}>
            <div className="row p-0 w-100">
              <div className="col-10">
                <h3 className="custom-heading-1 truncateText"
                  title={this.state.allRolesData[index].name}>
                  {this.state.allRolesData[index].name}</h3>
                <p className="custom-sub-heading-1">{this.state.allRolesData[index].id}</p>
              </div>
              {(this.state.allRolesData[index].status && (this.state.allRolesData[index].status === "DRAFT"
                || this.state.allRolesData[index].status === APP.NODE_STATUS.REJECTED))
                ? (
                  <React.Fragment>
                    {(this.state.allRolesData[index].status === "DRAFT") && (
                      <div className="col-2 center-align">
                        <span className="draft-icon-1 pr-0">
                          <img src={DraftIcon} alt="draft stage" />
                        </span>
                      </div>
                    )}
                    {(this.state.allRolesData[index].status === APP.NODE_STATUS.REJECTED) && (
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
                    {(!this.state.allRolesData[index].secondaryStatus
                      || this.state.allRolesData[index].secondaryStatus === "UNVERIFIED") && (
                        <div className="col-2 center-align">
                          <span className="under-review-icon-1 pr-0">
                            <img src={UnderReviewIcon} alt="review stage" />
                          </span>
                        </div>
                      )}
                    {(this.state.allRolesData[index].secondaryStatus
                      && this.state.allRolesData[index].secondaryStatus === "VERIFIED") && (
                        <div className="col-2 center-align">
                          <span className="check-icon-1 pr-0">
                            <img src={CheckIcon} alt="verified stage" />
                          </span>
                        </div>
                      )}
                    {(this.state.allRolesData[index].secondaryStatus
                      && this.state.allRolesData[index].secondaryStatus === "REJECTED") && (
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
        id="officerColumn3"
      >
        <div className="p-1">
          <h1 className="mt-3 mb-4">Search for a Role</h1>
          <div className="row col-12 p-0">
            <div className="col-9" id="officerBucketsList">
              <input
                type="text"
                style={{ width: "140%" }}
                className="form-control mb-4 custom-search-5"
                placeholder="Search..."
                aria-label="Search"
                id="roleSearch"
                value={this.state.searchString}
                onChange={this.searchRole}
                aria-describedby="basic-addon1"
                autoComplete="off"
              />
            </div>
            <div className="col-2">
              {this.state.searchString && (
                <span
                  className="material-icons competency-area-close-button-4"
                  onClick={() => {
                    this.setState(
                      {
                        searchString: "",
                      },
                      () => {
                        this.searchRole();
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
            type="ROLE"
            dept={this.state.currentDept}
            filteredData={() => {
              this.getRoleData("ROLE", this.state.currentDept);
            }}
            updateData={this.updateRoleData}
            isNew={this.state.isNewRole}
          />

          <div className="custom-div-size-1">
            <div id="roleList">
              {/* New role */}
              <div className="" id="new">
                {(this.state.isNewRole ||
                  (this.props.history &&
                    this.props.history.location.state &&
                    this.props.history.location.state.isNewRole)) && (
                    <NavLink
                      className=""
                      to={{
                        pathname: "/collection-roles/" + 0,
                        state: {
                          isNewRole: true,
                          id: 0,
                          type: "ROLE",
                        },
                      }}
                    >
                      <div
                        className={`pl-3 pt-3 ml-1 mr-1 mb-1 fadeInUp ${this.props.history &&
                          this.props.history.location.pathname ===
                          "/collection-roles/" + 0
                          ? "active-list-selection-1 role-border-1"
                          : "new-profile-list role-border-1"
                          } `}
                      >
                        <h3 className="new-item custom-heading-1">*Role name</h3>
                        <p className="custom-sub-heading-1 new-item">RID000</p>
                      </div>
                    </NavLink>
                  )}
              </div>
              {this.state.allRolesData && this.state.allRolesData.length > 0 && (
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
                        itemCount={this.state.allRolesData.length}
                        itemSize={index => this.state.allRolesData[index].name ? 85 : 70}
                        ref={this.listRef}
                        overscanCount={100}>
                        {viewAllRoles}
                      </VariableSizeList>
                    )}
                  </AutoSizer>
                </div>
              )}
              {this.state.allRolesData.length === 0 &&
                !this.state.isNewRole && (
                  <p className="pt-3 pl-3 activity-log-name m-0">
                    No role found!
                  </p>
                )}
            </div>
          </div>
        </div>
        <button
          type="button"
          className="btn save-button p-3 push-bottom-3 custom-primary-button-3 button-type-3"
          onClick={this.createNewRole}
        >
          New Role
        </button>
      </div>
    );
  }
}

export default ColumnTwo;
