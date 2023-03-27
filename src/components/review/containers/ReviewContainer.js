import React from "react";
import ListView from "../views/ListView";
import { ReviewService } from "../../../services/review.service";
import { MasterService } from "../../../services/master.service";
import { DashboardService } from "../../../services/dashboard.service";
import Notify from "../../../helpers/notify";
import { APP } from "../../../constants";
import CryptoJS from "crypto-js";
import { UserService } from "../../../services/user.service";
import ColumnOne from "../views/ColumnOne";
import { ColumnThree as PositionView } from "../../collections/views/positions/ColumnThree";
import { ColumnThree as RoleView } from "../../collections/views/roles/ColumnThree";
import { ColumnThree as ActivityView } from "../../collections/views/activities/ColumnThree";
import { ColumnThree as CompetencyView } from "../../collections/views/competencies/ColumnThree";
import HeaderSection from "../../collections/containers/common/HeaderSection";

/**
 *  Review container handles review UI components and its API calls
 **/

class ReviewContainer extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      selectedID: "",
      selectedNodeStatus: "unverified",
      reviewData: [],
      reviewDataList: [],
      nodeData: "",
      activityLogs: "",
      mappedCompLevel: "",
      similarNodeData: "",
      similarNodeCompLevel: "",
      allDepartments: "",
      selectedDept: "",
      currentDept: "",
      searchVal: false,
      nodeCount: {},
      clients: "",
      allSessions: "",
      gotData: "",
      roles: "",
      userType: "",
      sendData: "",
      roomId: "",
    };
    this.getSelectedID = this.getSelectedID.bind(this);
    this.getVerificationListData = this.getVerificationListData.bind(this);
    this.getNodeDetailsById = this.getNodeDetailsById.bind(this);
    this.getMappedCompLevel = this.getMappedCompLevel.bind(this);
    this.verifyDataNode = this.verifyDataNode.bind(this);
    this.searchNode = this.searchNode.bind(this);
    this.similarNodeDetails = this.similarNodeDetails.bind(this);
    this.getAllDepartments = this.getAllDepartments.bind(this);
    this.getSelectedDept = this.getSelectedDept.bind(this);
    this.saveCompetencies = this.saveCompetencies.bind(this);
    this.getDepartments = this.getDepartments.bind(this);
    this.encryptData = this.encryptData.bind(this);
    this.decryptUtility = this.decryptUtility.bind(this);
    this.getNodeInformation = this.getNodeInformation.bind(this);
    this.getNodeActivityLog = this.getNodeActivityLog.bind(this);
    this.receiveClients = this.receiveClients.bind(this);
    this.receiveSessions = this.receiveSessions.bind(this);
    this.getRoles = this.getRoles.bind(this);
    this.getClients = this.getClients.bind(this);
    this.gotMessage = this.gotMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.getRoomId = this.getRoomId.bind(this);
    this.getSessions = this.getSessions.bind(this);
    this.filterReviewNodes = this.filterReviewNodes.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.getRoles();
  }

  componentDidUpdate() {
    if (
      this.props.history.location &&
      this.props.history.location.pathname &&
      this.state.type !==
      this.getCollectionTypeByPath(this.props.history.location.pathname)
    ) {
      this.setState(
        {
          type: this.getCollectionTypeByPath(
            this.props.history.location.pathname
          ),
          selectedID: "",
        },
        () => {
          this.getVerificationListData();
        }
      );
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.setState = (state, callback) => {
      return;
    };
  }

  getClients = (list) => {
    this.setState({
      clients: list,
    });
  };

  gotMessage = (data) => {
    this.setState({
      gotData: data,
    });
  };

  sendMessage = (data) => {
    this.setState({
      sendData: data,
    });
  };

  getRoomId = (value) => {
    this.setState({
      roomId: value,
    });
  };

  getSessions = (data) => {
    this.setState({
      allSessions: data,
    });
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
          this.getAllDepartments();
          this.getDepartments();
        }
      );
    }
  };

  // Return the type of collection from the url path
  getCollectionTypeByPath(path) {
    if (path.match(APP.ROUTES_PATH.REVIEW_POSITION)) {
      return APP.COLLECTIONS.POSITION;
    }

    if (path.match(APP.ROUTES_PATH.REVIEW_ROLES)) {
      return APP.COLLECTIONS.ROLE;
    }

    if (path.match(APP.ROUTES_PATH.REVIEW_ACTIVITIES)) {
      return APP.COLLECTIONS.ACTIVITY;
    }

    if (path.match(APP.ROUTES_PATH.REVIEW_COMPETENCY)) {
      return APP.COLLECTIONS.COMPETENCY;
    }
  }
  // Function to get logged in user department
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
                currentUserDept: response.data.result.response.rootOrg.orgName,
              },
              () => {
                this.encryptData();
                this.getVerificationListData();
              }
            );
          }
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });
    } else {
      this.decryptUtility();
      this.getVerificationListData();

      // Get Count of all Nodes
      this.getNodeCount(APP.COLLECTIONS.POSITION);
      this.getNodeCount(APP.COLLECTIONS.ROLE);
      this.getNodeCount(APP.COLLECTIONS.ACTIVITY);
      this.getNodeCount(APP.COLLECTIONS.COMPETENCY);
    }
  };

  // Function for encryption
  encryptData = () => {
    let cipherText = CryptoJS.AES.encrypt(
      this.state.currentDept,
      "igotcheckIndia*"
    ).toString();
    localStorage.setItem("department", cipherText);
  };

  // Function for decryption
  decryptUtility = () => {
    let bytes = CryptoJS.AES.decrypt(
      localStorage.getItem("department"),
      "igotcheckIndia*"
    );
    let originalText = bytes.toString(CryptoJS.enc.Utf8);
    this.setState({
      currentDept: originalText,
    });
  };

  // Function to get review list
  getVerificationListData = () => {
    let userType;
    if (this.state.roles.includes("FRAC_REVIEWER_L1")) {
      userType = "FRAC_REVIEWER_L1";
    }

    if (this.state.roles.includes("FRAC_REVIEWER_L2")) {
      userType = "FRAC_REVIEWER_L2";
    }

    if (this.state.type && userType) {
      ReviewService.getVerificationListWoDept(this.state.type, userType).then(
        (response) => {
          if (
            response &&
            response.data.statusInfo.statusCode === APP.CODE.SUCCESS
          ) {
            let parc = this.setReviewNodeStatus(response.data.responseData);
            this.setState({
              reviewData: parc,
              reviewDataList: parc,
            });
            if (this.state.searchVal) {
              this.searchNode();
            }
          } else {
            Notify.error(response && response.data.statusInfo.errorMessage);
          }
        }
      );
      // }
    } else {
      if (this.state.type) {
        ReviewService.getVerificationListWoDeptWoUserType(this.state.type).then(
          (response) => {
            if (
              response &&
              response.data.statusInfo.statusCode === APP.CODE.SUCCESS
            ) {
              let parc = this.setReviewNodeStatus(response.data.responseData);
              this.setState({
                reviewData: parc,
                reviewDataList: parc,
              });
              if (this.state.searchVal) {
                this.searchNode();
              }
            } else {
              Notify.error(response && response.data.statusInfo.errorMessage);
            }
          }
        );
      }
    }
  };

  filterReviewNodes = (payload) => {
    let userType;
    if (this.state.roles.includes("FRAC_REVIEWER_L1")) {
      userType = "FRAC_REVIEWER_L1";
    }

    if (this.state.roles.includes("FRAC_REVIEWER_L2")) {
      userType = "FRAC_REVIEWER_L2";
    }

    if (payload && payload.filters && payload.filters.length > 0) {
      if (userType) {
        payload.userType = userType;
      }
      ReviewService.filterReviewNodes(payload).then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          let parc = this.setReviewNodeStatus(response.data.responseData);
          this.setState({
            reviewData: parc,
            reviewDataList: parc,
          });
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });
    } else {
      this.getVerificationListData();
    }
  };

  setReviewNodeStatus(responseData) {
    let parc = { rejected: [], unverified: [], verified: [] };
    if (responseData) {
      // unverified
      responseData.unverified &&
        responseData.unverified.map((unverifiedItem) => {
          unverifiedItem.nodeStatus = APP.NODE_STATUS.UNVERIFIED
          parc.unverified.push(unverifiedItem);
          return null;
        });
      // verified
      responseData.verified &&
        responseData.verified.map((verifiedItem) => {
          verifiedItem.nodeStatus = APP.NODE_STATUS.VERIFIED
          parc.verified.push(verifiedItem);
          return null;
        });
      //rejected
      responseData.rejected &&
        responseData.rejected.map((rejectedItem) => {
          rejectedItem.nodeStatus = APP.NODE_STATUS.REJECTED
          parc.rejected.push(rejectedItem);
          return null;
        });
    }
    return parc;
  }

  // Function to get selected item details by its ID
  getSelectedID = (id, type) => {
    this.setState(
      {
        selectedID: id,
        type: type,
      },
      () => {
        this.getNodeInformation(this.state.selectedID, type, true);
      }
    );
  };

  // Function to similar nodes suggestions for selected item
  getNodeDetailsById = (id, type, flag) => {
    ReviewService.getNodeDetailsWithSimilarities(id, type, flag).then(
      (response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          response.data.responseData.type = type;
          this.setState(
            {
              nodeData: response.data.responseData,
              selectedNodeStatus: response.data.responseData.status,
            },
            () => {
              if (
                this.state.nodeData.additionalProperties &&
                this.state.nodeData.additionalProperties.cod
              ) {
                this.setState({
                  selectedDept: this.state.nodeData.additionalProperties.cod,
                });
              } else {
                this.setState({
                  selectedDept: "Select a department",
                });
              }
            }
          );
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      }
    );
  };

  // To get activity logs of a node
  getNodeActivityLog = (id, type) => {
    MasterService.getActivityLogs(id, type).then((response) => {
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
    });
  };

  // Function to get similar node details
  similarNodeDetails = (id, type) => {
    MasterService.getDataByNodeId(id, type).then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        this.setState({
          similarNodeData: response.data.responseData,
        });
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });

    MasterService.getChildForParent(id, "COMPETENCIESLEVEL").then(
      (response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState({
            similarNodeCompLevel: response.data.responseData,
          });
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      }
    );
  };

  // Function to get mapped competency levels
  getMappedCompLevel = (id, type) => {
    MasterService.getChildForParent(id, type).then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        this.setState({
          mappedCompLevel: response.data.responseData,
        });
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  // To verify, unverify or reject a data node
  verifyDataNode = (data) => {
    ReviewService.verifyNode(data).then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        this.getVerificationListData();
        this.getNodeCount(data.type);
        setTimeout(() => {
          this.getNodeInformation(this.state.selectedID, data.type, true);
          this.props.history.push({
            pathname: APP.ROUTES_PATH.REVIEW + data.type.toLowerCase() + "/",
            state: {
              showColumnThree: false,
            },
          });
        }, 800);
        Notify.dark("Moved successfully");
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  // To get node details by id and its activity log.
  getNodeInformation = (id, type, status) => {
    this.getNodeDetailsById(id, type, status);
    this.getNodeActivityLog(id, type);
    if (type === APP.COLLECTIONS.COMPETENCY) {
      this.getMappedCompLevel(id, "COMPETENCIESLEVEL");
    }
  };

  // Function to search items from unverified list
  searchNode = () => {
    let filteredData = { rejected: [], unverified: [], verified: [] };
    let inputVal = false;
    if (this.state.reviewDataList) {
      const input = document.getElementById("searchNode");
      if (input.value) {
        inputVal = true;
        this.filterSearch(
          this.state.reviewDataList.verified,
          input.value,
          filteredData.verified
        );
        this.filterSearch(
          this.state.reviewDataList.unverified,
          input.value,
          filteredData.unverified
        );
        this.filterSearch(
          this.state.reviewDataList.rejected,
          input.value,
          filteredData.rejected
        );
      } else {
        filteredData = this.state.reviewDataList;
      }
      this.setState({
        reviewData: filteredData,
        searchVal: inputVal,
      });
    }
  };

  // filters the array with node matching the search text
  filterSearch(sourceList, searchValue, result) {
    if (sourceList && sourceList.length) {
      sourceList.map((data) => {
        if (
          (data.name &&
            data.name.toUpperCase().indexOf(searchValue.toUpperCase()) > -1) ||
          (data.id &&
            data.id.toUpperCase().indexOf(searchValue.toUpperCase()) > -1) ||
          (data.type === APP.COLLECTIONS.ACTIVITY && data.description &&
            data.description.toUpperCase().indexOf(searchValue.toUpperCase()) > -1)) {
          result.push(data);
        }
        return null;
      });
    }
  }

  // Function to get all MDO
  getAllDepartments = () => {
    if (!this.state.allDepartments && localStorage.getItem("wid")) {
      DashboardService.getAllDepartments().then((response) => {
        if (response && response.status === 200 && response.data.result
          && response.data.result.response
          && response.data.result.response.content) {
          this.setState({
            allDepartments: response.data.result.response.content,
          });
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });
    }
  };

  // Function to get selected department details
  getSelectedDept = (value) => {
    if (value) {
      this.setState(
        {
          selectedDept: value,
        },
        () => {
          if (this.state.selectedDept !== "Select a MDO") {
            this.saveCompetencies();
          }
        }
      );
    }
  };

  // Function to save competencies after update
  saveCompetencies = () => {
    let competencyPayload;

    if (
      this.state.selectedDept &&
      this.state.nodeData.additionalProperties.competencyType
    ) {
      competencyPayload = {
        type: this.state.nodeData.type,
        source: "FRAC",
        status: this.state.nodeData.status,
        secondaryStatus: this.state.nodeData.secondaryStatus || "",
        id: this.state.nodeData.id,
        name: this.state.nodeData.name,
        description: this.state.nodeData.description,
        additionalProperties: {
          competencyType:
            this.state.nodeData.additionalProperties.competencyType,
          cod: this.state.selectedDept,
        },
      };
    } else {
      competencyPayload = {
        type: this.state.nodeData.type,
        source: "FRAC",
        status: this.state.nodeData.status,
        secondaryStatus: this.state.nodeData.secondaryStatus || "",
        id: this.state.nodeData.id,
        name: this.state.nodeData.name,
        description: this.state.nodeData.description,
        additionalProperties: {
          cod: this.state.selectedDept,
        },
      };
    }
    MasterService.addDataNode(competencyPayload).then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        Notify.dark("Competency updated successfully");
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  // To get total count of unverified node
  getNodeCount(type) {
    // if (type !== "POSITION") {

    // }

    if (
      this.state.roles.includes("FRAC_REVIEWER_L1") ||
      this.state.roles.includes("FRAC_REVIEWER_L2")
    ) {
      let userType;
      if (this.state.roles.includes("FRAC_REVIEWER_L1")) {
        userType = "FRAC_REVIEWER_L1";
      }

      if (this.state.roles.includes("FRAC_REVIEWER_L2")) {
        userType = "FRAC_REVIEWER_L2";
      }
      DashboardService.getCountByUserType(type, userType).then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState({
            nodeCount: {
              ...this.state.nodeCount,
              [type]: response.data.responseData,
            },
          });
        }
      });
    } else {
      DashboardService.getNodeCount(type, "UNVERIFIED").then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState({
            nodeCount: {
              ...this.state.nodeCount,
              [type]: response.data.responseData,
            },
          });
        }
      });
    }
  }

  receiveClients = (list) => {
    this.setState({
      clients: list,
    });
  };

  receiveSessions = (data) => {
    this.setState({
      allSessions: data,
    });
  };

  render() {
    return (
      <React.Fragment>
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <HeaderSection
            {...this.props}
            getClients={this.getClients}
            gotData={this.gotMessage}
            sendData={this.state.sendData}
            sendRoomId={this.state.roomId}
            getSessions={this.getSessions}
          />
        </div>
        <div className="d-xl-flex d-lg-flex d-md-flex d-sm-none col-xs-12 col-sm-12 col-md-12 col-lg-12 custom-padding-1">
          <ColumnOne
            {...this.props}
            history={this.props.history}
            nodeCount={this.state.nodeCount}
            clients={this.state.clients}
            allSessions={this.state.allSessions}
          />
          {this.props.history.location.pathname !== APP.ROUTES_PATH.REVIEW && (
            <React.Fragment>
              <ListView
                {...this.props}
                type={this.state.type}
                getSelectedId={this.getSelectedID}
                reviewData={this.state.reviewData}
                selectedID={this.state.selectedID}
                selectedNodeStatus={this.state.selectedNodeStatus}
                filterReviewNodes={this.filterReviewNodes}
                searchNode={this.searchNode}
                searchVal={this.state.searchVal}
                clients={this.state.clients}
                allSessions={this.state.allSessions}
                getMessage={this.state.gotData}
                sendMessage={this.sendMessage}
              />
              {this.props.history.location.state &&
                this.props.history.location.state.showColumnThree && (
                  <React.Fragment>
                    {this.state.type === APP.COLLECTIONS.POSITION &&
                      this.state.selectedID && (
                        <PositionView
                          {...this.props}
                          department=""
                          allDepartments={this.state.allDepartments}
                          verifyDataNode={this.verifyDataNode}
                          review="true"
                          selectedNodeStatus={this.state.selectedNodeStatus}
                          clients={this.state.clients}
                          allSessions={this.state.allSessions}
                          getMessage={this.state.gotData}
                          sendMessage={this.sendMessage}
                        />
                      )}
                    {this.state.type === APP.COLLECTIONS.ROLE &&
                      this.state.selectedID && (
                        <RoleView
                          {...this.props}
                          allDepartments={this.state.allDepartments}
                          verifyDataNode={this.verifyDataNode}
                          review="true"
                          selectedNodeStatus={this.state.selectedNodeStatus}
                          clients={this.state.clients}
                          allSessions={this.state.allSessions}
                          getMessage={this.state.gotData}
                          sendMessage={this.sendMessage}
                        />
                      )}
                    {this.state.type === APP.COLLECTIONS.ACTIVITY &&
                      this.state.selectedID && (
                        <ActivityView
                          {...this.props}
                          allDepartments={this.state.allDepartments}
                          verifyDataNode={this.verifyDataNode}
                          review="true"
                          selectedNodeStatus={this.state.selectedNodeStatus}
                          clients={this.state.clients}
                          allSessions={this.state.allSessions}
                          getMessage={this.state.gotData}
                          sendMessage={this.sendMessage}
                        />
                      )}
                    {this.state.type === APP.COLLECTIONS.COMPETENCY &&
                      this.state.selectedID && (
                        <CompetencyView
                          {...this.props}
                          allDepartments={this.state.allDepartments}
                          verifyDataNode={this.verifyDataNode}
                          review="true"
                          selectedNodeStatus={this.state.selectedNodeStatus}
                          clients={this.state.clients}
                          allSessions={this.state.allSessions}
                          getMessage={this.state.gotData}
                          sendMessage={this.sendMessage}
                        />
                      )}
                  </React.Fragment>
                )}
            </React.Fragment>
          )}
          {/* Empty state for selecting a collection */}
          {this.props.history.location.pathname === APP.ROUTES_PATH.REVIEW && (
            <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10 bordered custom-full-height-4 custom-body-bg">
              <div
                className="vertical-center d-none d-sm-block"
                id="emptyState"
              >
                <center>
                  <h1 className="pb-2">No collections selected</h1>
                  <p className="col-7 pb-2">
                    Please select a collection from the list to review
                  </p>
                  <img
                    src="../../../img/empty/lists_empty.svg"
                    alt="empty activity"
                  ></img>
                </center>
              </div>
            </div>
          )}
          {/* Empty state for each types */}
          {this.state.type &&
            (!this.state.selectedID ||
              (this.props.history.location.state &&
                !this.props.history.location.state.showColumnThree)) && (
              <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 bordered custom-full-height-4 custom-body-bg">
                <div className="vertical-center col-12" id="emptyState">
                  <center>
                    <h1 className="pb-2">
                      No {this.state.type.toLowerCase()} selected
                    </h1>
                    <p className="col-7 pb-2">
                      Please select a {this.state.type.toLowerCase()} from the
                      left side to see its details here
                    </p>
                    {this.state.type.toUpperCase() ===
                      APP.COLLECTIONS.POSITION && (
                        <img
                          src="../../../../img/empty/positions_empty.svg"
                          alt="empty activity"
                        ></img>
                      )}
                    {this.state.type.toUpperCase() === APP.COLLECTIONS.ROLE && (
                      <img
                        src="../../../../img/empty/roles_empty.svg"
                        alt="empty activity"
                      ></img>
                    )}
                    {this.state.type.toUpperCase() ===
                      APP.COLLECTIONS.ACTIVITY && (
                        <img
                          src="../../../../img/empty/activity_empty.svg"
                          alt="empty activity"
                        ></img>
                      )}
                    {this.state.type.toUpperCase() ===
                      APP.COLLECTIONS.COMPETENCY && (
                        <img
                          src="../../../../img/empty/competency_empty.svg"
                          alt="empty activity"
                        ></img>
                      )}
                  </center>
                </div>
              </div>
            )}
        </div>
      </React.Fragment>
    );
  }
}

export default ReviewContainer;
