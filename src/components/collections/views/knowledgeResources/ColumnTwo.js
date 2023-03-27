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
import { VariableSizeList } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"


class ColumnTwo extends React.Component {
  listRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      isNewKR: false,
      allKRData: [],
      krResponse: [],
      krDetails: [],
      currentDept: "",
      searchString: "",
    };
    this.createNewKR = this.createNewKR.bind(this);
    this.searchKR = this.searchKR.bind(this);
    this.getKRDetails = this.getKRDetails.bind(this);
    this.decryptUtility = this.decryptUtility.bind(this);
  }

  componentDidMount() {
    if (localStorage.getItem("department")) {
      this.decryptUtility();
    }
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
        this.getKRDetails("KNOWLEDGERESOURCE", this.state.currentDept);
      }
    );
  };

  getKRDetails = (type, dept) => {
    if (dept !== "All MDO") {
      MasterService.getNodesByTypeAndDept(type, dept).then((response) => {
        this.handleGetKRResponse(response);
      });
    } else {
      MasterService.getNodesByType(type).then((response) => {
        this.handleGetKRResponse(response);
      });
    }
  };

  handleGetKRResponse = (response) => {
    if (
      response &&
      response.data.statusInfo.statusCode === APP.CODE.SUCCESS
    ) {
      this.setState({
        allKRData: response.data.responseData,
        krResponse: response.data.responseData,
      }, () => {
        if (this.props.location && this.props.location.pathname) {
          const elementId = this.props.location.pathname.split(APP.COLLECTIONS_PATH.KNOWLEDGE_RESOURCES);
          if (elementId.length > 1) {
            const elementIndex = this.state.krResponse.findIndex(obj => obj.id === elementId[1]);
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

  searchKR = (e) => {
    if (e && e.target && (e.target.value || e.target.value === "")) {
      this.setState({
        searchString: e.target.value
      }, () => {
        this.setState({
          allKRData: this.state.krResponse.filter((obj) => (obj.name
            && obj.name.toLowerCase().includes(this.state.searchString.toLowerCase())) ||
            (obj.id
              && obj.id.toLowerCase().includes(this.state.searchString.toLowerCase())))
        })
      })
    } else {
      this.setState({
        allKRData: this.state.krResponse
      })
    }
  };

  createNewKR = () => {
    let scroll = document.getElementById("new");
    scroll.scrollIntoView();
    this.setState(
      {
        isNewKR: true,
      },
      () => {
        this.props.history.push({
          pathname: "/collection-knowledge-resources/0",
          state: { isNewKR: true, id: 0, type: "KNOWLEDGERESOURCE" },
        });
      }
    );
    if (
      this.props.history &&
      this.props.history.location.state &&
      this.props.history.location.state.isNewKR
    ) {
      this.setState({
        isNewKR: true,
      });
    }
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
        isNewKR: false,
      });
      this.props.history.location.state.stayOn = false;
      if (localStorage.getItem("fileURL")) {
        localStorage.removeItem("fileURL");
      }
      setTimeout(() => {
        this.getKRDetails("KNOWLEDGERESOURCE", this.state.currentDept);
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
    const viewAllKR = ({ index, style }) =>
      <div style={style}>
        <NavLink
          key={this.state.allKRData[index].id}
          id={this.state.allKRData[index].id}
          className=""
          to={{
            pathname: "/collection-knowledge-resources/" + this.state.allKRData[index].id,
            state: {
              showColumnThree: true,
              id: this.state.allKRData[index].id,
              type: "KNOWLEDGERESOURCE",
            },
          }}
        >
          <div
            className={`pl-3 pt-3 ml-1 mr-1 mb-1 ${this.props.history &&
              this.props.history.location.pathname ===
              "/collection-knowledge-resources/" + this.state.allKRData[index].id
              ? "active-list-selection-1 kr-border-1"
              : "list-selection-1 kr-border-1"
              } `}
          >
            <div className="row p-0 w-100">
              <div className="col-10">
                <h3 className="custom-heading-1 truncateText"
                  title={this.state.allKRData[index].name}>
                  {this.state.allKRData[index].name}</h3>
                <p className="custom-sub-heading-1">{this.state.allKRData[index].id}</p>
              </div>
              {this.state.allKRData[index].status
                && this.state.allKRData[index].status === "UNVERIFIED" && (
                  <div className="col-2 center-align">
                    <span className="under-review-icon-1 pr-0">
                      <img
                        src={UnderReviewIcon}
                        alt="sent for review stage"
                      />
                    </span>
                  </div>
                )}
              {this.state.allKRData[index].status
                && this.state.allKRData[index].status === "VERIFIED" && (
                  <div className="col-2 center-align">
                    <span className="check-icon-1 pr-0">
                      <img src={CheckIcon} alt="verified stage" />
                    </span>
                  </div>
                )}
              {this.state.allKRData[index].status
                && this.state.allKRData[index].status === "REJECTED" && (
                  <div className="col-2 center-align">
                    <span className="cancel-icon-1 pr-0">
                      <img src={RejectedIcon} alt="rejected stage" />
                    </span>
                  </div>
                )}
              {this.state.allKRData[index].status
                && this.state.allKRData[index].status === "DRAFT" && (
                  <div className="col-2 center-align">
                    <span className="draft-icon-1 pr-0">
                      <img src={DraftIcon} alt="draft stage" />
                    </span>
                  </div>
                )}
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
          <h1 className="mt-3 mb-4">Search for a Knowledge Resources</h1>
          <div className="row col-12 p-0">
            <div className="col-9" id="officerBucketsList">
              <input
                type="text"
                style={{ width: "140%" }}
                className="form-control mb-4 custom-search-5"
                placeholder="Search..."
                aria-label="Search"
                id="krSearch"
                value={this.state.searchString}
                onChange={this.searchKR}
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
                        document.getElementById("krSearch").value = "";
                        this.searchKR();
                      }
                    );
                  }}
                >
                  close
                </span>
              )}
            </div>
          </div>

          <div className="custom-div-size-1">
            <div id="krList">
              {/* New KR */}
              <div className="" id="new">
                {(this.state.isNewKR ||
                  (this.props.history &&
                    this.props.history.location.state &&
                    this.props.history.location.state.isNewKR)) && (
                    <NavLink
                      className=""
                      to={{
                        pathname: "/collection-knowledge-resources/" + 0,
                        state: {
                          isNewKR: true,
                          id: 0,
                          type: "KNOWLEDGERESOURCE",
                        },
                      }}
                    >
                      <div
                        className={`pl-3 pt-3 ml-1 mr-1 mb-1 fadeInUp ${this.props.history &&
                          this.props.history.location.pathname ===
                          "/collection-knowledge-resources/" + 0
                          ? "active-list-selection-1 kr-border-1"
                          : "new-profile-list kr-border-1"
                          } `}
                      >
                        <h3 className="new-item custom-heading-1">
                          *Knowledge Resource
                        </h3>
                        <p className="custom-sub-heading-1 new-item">KID000</p>
                      </div>
                    </NavLink>
                  )}
              </div>
              {/* Existing KR's */}
              {this.state.allKRData && this.state.allKRData.length > 0 && (
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
                        itemCount={this.state.allKRData.length}
                        itemSize={index => this.state.allKRData[index].name ? 85 : 70}
                        ref={this.listRef}
                        overscanCount={100}>
                        {viewAllKR}
                      </VariableSizeList>
                    )}
                  </AutoSizer>
                </div>
              )}

              {this.state.allKRData.length === 0 &&
                !this.state.isNewKR && (
                  <p className="pt-3 pl-3 activity-log-name m-0">
                    No knowledge resource found!
                  </p>
                )}
            </div>
          </div>
        </div>
        <button
          type="button"
          className="btn save-button p-3 push-bottom-3 custom-primary-button-3 button-type-3"
          onClick={this.createNewKR}
        >
          New Knowledge Resource
        </button>
      </div>
    );
  }
}

export default ColumnTwo;
