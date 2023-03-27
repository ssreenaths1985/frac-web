import React from "react";
import Notify from "../../../helpers/notify";
import { DashboardService } from "../../../services/dashboard.service";
import { NavLink } from "react-router-dom";
import { APP } from "../../../constants";
import DashboardDepartments from "./DashboardDepartments";
import CryptoJS from "crypto-js";
import { UserService } from "../../../services/user.service";
import { ChartService } from "../../../services/chart.service";
import PieChart from "../views/PieChart";

/**
 * DashboardHome renders application description and cards
 */

class DashboardHome extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      posCount: "",
      rolesCount: "",
      actCount: "",
      compCount: "",
      krCount: "",
      roles: "",
      currentUserDept: "",
      myReviewData: "",
      subordinateReviewStatus: "",
    };
    this.getCounts = this.getCounts.bind(this);
    this.decryptUtility = this.decryptUtility.bind(this);
    this.getLoggedInUserDept = this.getLoggedInUserDept.bind(this);
    this.encryptData = this.encryptData.bind(this);
    this.getChartData = this.getChartData.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.decryptUtility();
  }

  encryptData = () => {
    let cipherText = CryptoJS.AES.encrypt(
      this.state.currentUserDept,
      "igotcheckIndia*"
    ).toString();
    localStorage.setItem("department", cipherText);
  };

  // Function to get count's of all items
  getCounts = () => {
    if (
      !this.state.roles.includes("FRAC_ADMIN") &&
      !this.state.roles.includes("FRAC_REVIEWER_L1") &&
      !this.state.roles.includes("FRAC_REVIEWER_L2") &&
      this.state.currentUserDept
    ) {
      DashboardService.getCountsByDept(
        "POSITION",
        this.state.currentUserDept
      ).then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState({
            posCount: response.data.responseData,
          });
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });

      DashboardService.getCountsByDept("ROLE", this.state.currentUserDept).then(
        (response) => {
          if (
            response &&
            response.data.statusInfo.statusCode === APP.CODE.SUCCESS
          ) {
            this.setState({
              rolesCount: response.data.responseData,
            });
          } else {
            Notify.error(response && response.data.statusInfo.errorMessage);
          }
        }
      );

      DashboardService.getCountsByDept(
        "ACTIVITY",
        this.state.currentUserDept
      ).then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState({
            actCount: response.data.responseData,
          });
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });

      DashboardService.getCountsByDept(
        "COMPETENCY",
        this.state.currentUserDept
      ).then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState({
            compCount: response.data.responseData,
          });
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });

      DashboardService.getCountsByDept(
        "KNOWLEDGERESOURCE",
        this.state.currentUserDept
      ).then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState({
            krCount: response.data.responseData,
          });
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });
    } else {
      DashboardService.getCounts("POSITION").then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState({
            posCount: response.data.responseData,
          });
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });

      DashboardService.getCounts("ROLE").then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState({
            rolesCount: response.data.responseData,
          });
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });

      DashboardService.getCounts("ACTIVITY").then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState({
            actCount: response.data.responseData,
          });
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });

      DashboardService.getCounts("COMPETENCY").then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState({
            compCount: response.data.responseData,
          });
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });

      DashboardService.getCounts("KNOWLEDGERESOURCE").then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState({
            krCount: response.data.responseData,
          });
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });
    }
  };

  // Function performs the decrypt operation
  decryptUtility = () => {
    setTimeout(() => {
      if (localStorage.getItem("stateFromNav")) {
        let bytes = CryptoJS.AES.decrypt(
          localStorage.getItem("stateFromNav"),
          "igotcheckIndia*"
        );
        let originalText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        this.setState(
          {
            roles: originalText,
          },
          () => {
            this.getChartData();
            if (!localStorage.getItem("department")) {
              this.getLoggedInUserDept();
            } else {
              let bytesData = CryptoJS.AES.decrypt(
                localStorage.getItem("department"),
                "igotcheckIndia*"
              );
              let originalTxt = bytesData.toString(CryptoJS.enc.Utf8);

              this.setState(
                {
                  currentUserDept: originalTxt,
                },
                () => {
                  this.getCounts();
                }
              );
            }
          }
        );
      } else {
        this.setState(
          {
            roles: "departmentUser",
          },
          () => {
            this.getChartData();
            if (!localStorage.getItem("department")) {
              this.getLoggedInUserDept();
            } else {
              let bytesData = CryptoJS.AES.decrypt(
                localStorage.getItem("department"),
                "igotcheckIndia*"
              );
              let originalTxt = bytesData.toString(CryptoJS.enc.Utf8);
              this.setState(
                {
                  currentUserDept: originalTxt,
                },
                () => {
                  this.getCounts();
                }
              );
            }
          }
        );
      }
    }, 1500);
  };

  // Function gets the logged in user department
  getLoggedInUserDept = () => {
    if (localStorage.getItem("wid")) {
      let bytes = CryptoJS.AES.decrypt(
        localStorage.getItem("wid"),
        "igotcheckIndia*"
      );
      UserService.getRoles(bytes.toString(CryptoJS.enc.Utf8)).then(
        (response) => {
          if (
            response &&
            response.status === 200 &&
            response.data.result &&
            response.data.result.response &&
            response.data.result.response.rootOrg &&
            response.data.result.response.rootOrg.orgName
          ) {
            if (response.data) {
              this.setState(
                {
                  currentUserDept:
                    response.data.result.response.rootOrg.orgName,
                },
                () => {
                  this.encryptData();
                  this.getCounts();
                }
              );
            }
          } else {
            Notify.error(response && response.data.statusInfo.errorMessage);
          }
        }
      );
    }
  };

  // Function to get data for reviewers chart
  getChartData = () => {
    let type1 = "myReviewStatus";
    let type2 = "subordinateReviewStatus";

    if (
      this.state.roles &&
      (JSON.stringify(this.state.roles).includes("FRAC_REVIEWER_L1") ||
        JSON.stringify(this.state.roles).includes("FRAC_REVIEWER_L2"))
    ) {
      ChartService.getChartForReviewer(type1).then((response) => {
        if (response && response.status === 200) {
          this.setState({
            myReviewData: response.data.responseData.data,
          });
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });

      ChartService.getChartForReviewer(type2).then((response) => {
        if (response && response.status === 200) {
          this.setState({
            subordinateReviewStatus: response.data.responseData.data,
          });
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });
    }
  };

  componentWillUnmount() {
    this._isMounted = false;
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    return (
      <div
        className={`${
          JSON.stringify(this.state.roles).includes("FRAC_ADMIN") ||
          JSON.stringify(this.state.roles).includes("FRAC_REVIEWER_L1") ||
          JSON.stringify(this.state.roles).includes("FRAC_REVIEWER_L2")
            ? "col-12 custom-body-bg custom-full-height h-100"
            : "col-12 custom-body-bg custom-full-height"
        }`}
      >
        <div className="ml-xs-0 ml-sm-0 ml-md-5 ml-lg-5 ml-xl-5 pl-xs-0 pl-sm-0 pl-md-4 pl-lg-4 pl-xl-4">
          <div className="row">
            {/* Application description */}
            <div
              className="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 pt-5"
              id="dashboardHeading"
            >
              <h1 className="">Welcome to the iGOT FRACing Toolkit</h1>
              <p className="pt-2">
                This tool will help you list out the positions in your
                organisation along with labelling and description after checking
                whether an analogues entry does already exist in the FRACing
                database and then decide whether to modify an existing one,
                adopt the existing one or create a new one.{" "}
              </p>
              <p className="pt-1">
                Likewise, it can be done for Roles, Activities, Competencies and
                Knowledge Resources.
              </p>
              <p className="pt-1">
                This tool will also help you provide links to upload Knowledge
                Resources that according to you are relevant for every Role,
                Activity and Position.
              </p>
            </div>

            {/* Application features */}
            <div
              className="col-xs-12 col-sm-12 col-md-12 col-lg-7 col-xl-7 pl-sm-0 pl-xs-0 pl-md-5 pl-lg-5 pl-xl-5 ml-sm-0 ml-xs-0 ml-md-4 ml-lg-4 ml-xl-4 p-0"
              id="dashboardRightSection"
            >
              <div className="row col-12 pt-5 p-0 ml-3 pl-4 pl-sm-4 pl-xs-4 pl-md-0 pl-lg-0">
                <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 p-0 pb-3 pb-sm-0 pb-xs-0 pb-md-3 pb-lg-0">
                  <div className="col-3 p-0">
                    <img
                      className="responsive-icon"
                      src="../../img/navigation/Explore.svg"
                      alt="explore"
                    />
                  </div>
                  <div className="col-9 pr-5">
                    <h2 className="pt-2">Explore</h2>
                    <p className="pt-2">
                      Explore all the postions, roles, activities, competencies
                      and knowledge resources in the country. List them out or
                      visualize.
                    </p>
                  </div>
                </div>
                <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 p-0">
                  <div className="col-3 p-0">
                    <img
                      className="responsive-icon"
                      src="../../img/navigation/Map.svg"
                      alt="map"
                    />
                  </div>
                  <div className="col-9 pr-5">
                    <h2 className="pt-2">Map</h2>
                    <p className="pt-2">
                      See or make connections between each item available in the
                      database.
                    </p>
                  </div>
                </div>
              </div>
              <div className="row col-12 pt-5 ml-3 p-0 pl-4 pl-sm-4 pl-xs-4 pl-md-0 pl-lg-0">
                <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 p-0 pb-3 pb-sm-0 pb-xs-0 pb-md-3 pb-lg-0">
                  <div className="col-3 p-0">
                    <img
                      className="responsive-icon"
                      src="../../img/navigation/Create.svg"
                      alt="create"
                    />
                  </div>
                  <div className="col-9 pr-5">
                    <h2 className="pt-2">Create</h2>
                    <p className="pt-2">
                      Create new postions, roles, activities, competencies or
                      knowledge resources, if you can’t find one existing.
                    </p>
                  </div>
                </div>
                <div className="row col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 p-0">
                  <div className="col-3 p-0">
                    <img
                      className="responsive-icon"
                      src="../../img/navigation/Avoid_duplicates.svg"
                      alt="avoid_duplicates"
                    />
                  </div>
                  <div className="col-9 pr-5">
                    <h2 className="pt-2">Avoid duplicates</h2>
                    <p className="pt-2">
                      Be organized. Avoid duplicates by using smart suggestions
                      that shows you similar items while you create new.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards */}
        {((this.state.roles &&
          !JSON.stringify(this.state.roles).includes("FRAC_ADMIN") &&
          !JSON.stringify(this.state.roles).includes("FRAC_REVIEWER_L1") &&
          !JSON.stringify(this.state.roles).includes("FRAC_REVIEWER_L2") &&
          !JSON.stringify(this.state.roles).includes(
            "FRAC_COMPETENCY_MEMBER"
          )) ||
          this.state.roles === "departmentUser") && (
          <div className="row pl-3">
            <h1 className="dashboard-heading-2 pt-5 ml-xs-0 ml-sm-0 ml-md-5 ml-lg-5 ml-xl-5 pl-xs-0 pl-sm-0 pl-md-5 pl-lg-5 pl-xl-4">
              From my MDO
            </h1>
            <h2 className="dashboard-heading-3 pt-5 ml-xs-0 ml-sm-0 ml-md-2 ml-lg-2 ml-xl-2 pl-xs-0 pl-sm-0 pl-md-2 pl-lg-2 pl-xl-2">
              All of India
            </h2>
          </div>
        )}
        {this.state.roles &&
          (JSON.stringify(this.state.roles).includes("FRAC_ADMIN") ||
            JSON.stringify(this.state.roles).includes("FRAC_REVIEWER_L1") ||
            JSON.stringify(this.state.roles).includes("FRAC_REVIEWER_L2") ||
            JSON.stringify(this.state.roles).includes(
              "FRAC_COMPETENCY_MEMBER"
            )) && (
            <h1 className="dashboard-heading-2 pt-5 ml-xs-0 ml-sm-0 ml-md-4 ml-lg-5 ml-xl-5 pl-xs-0 pl-sm-0 pl-md-4 pl-lg-4 pl-xl-4">
              All of India
            </h1>
          )}
        <div className="row pr-5 pb-3 mt-5 justify-content-center pl-xs-0 pl-sm-0 pl-md-5 pl-lg-5 pl-xl-5">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div className="row pl-2 ml-3">
              {this.state.roles &&
                !JSON.stringify(this.state.roles).includes(
                  "FRAC_COMPETENCY_MEMBER"
                ) && (
                  <>
                    <div className="col-xs-12 col-sm-12 col-md-3 col-lg-2 col-xl-2 card custom-dash-card-3 mb-3 mr-5 pointer-style position-border-1">
                      {/* <NavLink to="/collection-positions/" id="dashboardLink"> */}
                      <h5>{this.state.posCount || 0}</h5>
                      <p>Positions</p>
                      {/* </NavLink> */}
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-3 col-lg-2 col-xl-2 card custom-dash-card-3 mb-3 mr-5 pointer-style role-border-1">
                      {/* <NavLink to="/collection-roles/" id="dashboardLink"> */}
                      <h5>{this.state.rolesCount || 0}</h5>
                      <p>Roles</p>
                      {/* </NavLink> */}
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-3 col-lg-2 col-xl-2 card custom-dash-card-3 mb-3 mr-5 pointer-style activity-border-1">
                      {/* <NavLink to="/collection-activities/" id="dashboardLink"> */}
                      <h5>{this.state.actCount || 0}</h5>
                      <p>Activities</p>
                      {/* </NavLink> */}
                    </div>
                  </>
                )}

              {this.state.roles && (
                <div className="col-xs-12 col-sm-12 col-md-3 col-lg-2 col-xl-2 card custom-dash-card-3 mb-3 mr-5 pointer-style competency-border-1">
                  {/* <NavLink to="/collection-competencies/" id="dashboardLink"> */}
                  <h5>{this.state.compCount || 0}</h5>
                  <p>Competencies</p>
                  {/* </NavLink> */}
                </div>
              )}

              {this.state.roles &&
                !JSON.stringify(this.state.roles).includes(
                  "FRAC_COMPETENCY_MEMBER"
                ) && (
                  <div className="col-xs-12 col-sm-12 col-md-3 col-lg-2 col-xl-2 card custom-dash-card-3 mb-3 mr-5 mr-sm-5 mr-xs-5 mr-md-0 pointer-style kr-border-1">
                    {/* <NavLink
                      to="/collection-knowledge-resources/"
                      id="dashboardLink"
                    > */}
                    <h5>{this.state.krCount || 0}</h5>
                    <p>Knowledge Resources</p>
                    {/* </NavLink> */}
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* My editorial level */}
        {/* {this.state.roles &&
          this.state.roles.length !== 0 &&
          JSON.stringify(this.state.roles).includes("FRAC_ADMIN") && (
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-5">
              <h2 className="dashboard-heading-2 pt-5 ml-xs-0 ml-sm-0 ml-md-3 ml-lg-5 ml-xl-5 pl-xs-0 pl-sm-0 pl-md-3 pl-lg-4 pl-xl-2">
                My editorial level
              </h2>
              <div className="col-6 mt-5 ml-xs-0 ml-sm-0 ml-md-3 ml-lg-5 ml-xl-5 pl-xs-0 pl-sm-0 pl-md-3 pl-lg-4 pl-xl-2">
                <div className="my-editorial-level-box-1 p-3">
                  <div className="row mt-1">
                    <div className="my-editorial-level-indicator-box-1 col-2 ml-3"></div>
                    <div className="col-8 pl-4">
                      <label>Competencies</label>
                      <p>IFU member</p>
                      <div
                        className="d-flex flex-row"
                        style={{ marginTop: "-0.5rem" }}
                      >
                        <div className="level-progress-bar-1-filled mr-1"></div>
                        <div className="level-progress-bar-2 mr-1"></div>
                        <div className="level-progress-bar-3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )} */}

        {/* Get Started */}
        {this.state.roles &&
          this.state.roles.length !== 0 &&
          (JSON.stringify(this.state.roles).includes("FRAC_REVIEWER_L1") ||
            JSON.stringify(this.state.roles).includes("FRAC_REVIEWER_L2")) && (
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-5">
              <h2 className="dashboard-heading-2 pt-5 ml-xs-0 ml-sm-0 ml-md-3 ml-lg-5 ml-xl-5 pl-xs-0 pl-sm-0 pl-md-3 pl-lg-4 pl-xl-2">
                Get started
              </h2>
              <div className="mt-5 ml-xs-0 ml-sm-0 ml-md-3 ml-lg-5 ml-xl-4 pl-xs-0 pl-sm-0 pl-md-3 pl-lg-4 pl-xl-3">
                <div className="row col-12">
                  {/* Video 1 */}
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-3 col-xl-3 mr-3">
                    <div className="get-started-card-1">
                      <video
                        id="videoElement"
                        controls={true}
                        className="get-started-video-1"
                        poster="/videos/getStarted/intro_sc_01.png"
                        src="/videos/getStarted/intro_01.mp4"
                        type="video/mp4"
                        controlsList="nodownload"
                      ></video>
                      <div className="get-started-title-1 pl-4 pt-3">
                        <label>Competency-driven Engagement</label>
                        <p>Introduction</p>
                      </div>
                    </div>
                  </div>

                  {/* Video 2 */}
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-3 col-xl-3 mr-3 mt-0 mt-xs-5 mt-sm-5 mt-md-5 mt-lg-0 mt-xl-0">
                    <div className="get-started-card-1">
                      <video
                        id="videoElement"
                        controls={true}
                        className="get-started-video-1"
                        poster="/videos/getStarted/module_01.png"
                        src="/videos/getStarted/C-DE_01.mp4"
                        type="video/mp4"
                        controlsList="nodownload"
                      ></video>
                      <div className="get-started-title-1 pl-4 pt-3">
                        <label>The C-DE Process for MDOs</label>
                        <p>Module 1</p>
                      </div>
                    </div>
                  </div>

                  {/* Video 3 */}
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-3 col-xl-3 mr-3 mt-5 mt-xs-5 mt-sm-5 mt-md-5 mt-lg-0 mt-xl-0">
                    <div className="get-started-card-1">
                      <video
                        id="videoElement"
                        controls={true}
                        className="get-started-video-1"
                        poster="/videos/getStarted/module_02.png"
                        src="/videos/getStarted/C-DE_02.mp4"
                        type="video/mp4"
                        controlsList="nodownload"
                      ></video>
                      <div className="get-started-title-1 pl-4 pt-3">
                        <label>The C-DE Process for MDOs</label>
                        <p>Module 2</p>
                      </div>
                    </div>
                  </div>

                  {/* Video 4 */}
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-3 col-xl-3 mr-3 mt-5 mt-xs-5 mt-sm-5 mt-md-5 mt-lg-0 mt-xl-0">
                    <div className="get-started-card-1 mt-5">
                      <video
                        id="videoElement"
                        controls={true}
                        className="get-started-video-1"
                        poster="/videos/getStarted/module_03.png"
                        src="/videos/getStarted/C-DE_03.mp4"
                        type="video/mp4"
                        controlsList="nodownload"
                      ></video>
                      <div className="get-started-title-1 pl-4 pt-3">
                        <label>The C-DE Process for MDOs</label>
                        <p>Module 3</p>
                      </div>
                    </div>
                  </div>

                  {/* FAQ's */}
                  <NavLink
                    to="/faq"
                    id="dashboardLink"
                    className="col-xs-12 col-sm-12 col-md-12 col-lg-3 col-xl-3 mr-3 mt-5"
                  >
                    <div className="get-started-card-1">
                      <div className="get-started-img-1"></div>
                      <div className="get-started-title-1 pl-4 pt-3">
                        <label>Frequently asked questions</label>
                        <p>Everything related to FRACing</p>
                      </div>
                    </div>
                  </NavLink>
                </div>
              </div>
            </div>
          )}

        {/* Charts for reviewer */}
        {this.state.roles &&
          this.state.roles.length !== 0 &&
          (JSON.stringify(this.state.roles).includes("FRAC_REVIEWER_L1") ||
            JSON.stringify(this.state.roles).includes("FRAC_REVIEWER_L2")) && (
            <div
              className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-5"
              id="chartArea"
            >
              <h2 className="dashboard-heading-2 pt-5 ml-xs-0 ml-sm-0 ml-md-3 ml-lg-5 ml-xl-5 pl-xs-0 pl-sm-0 pl-md-3 pl-lg-4 pl-xl-2">
                Reviewer’s Dashboard
              </h2>
              <div className="mt-5 ml-xs-0 ml-sm-0 ml-md-3 ml-lg-2 ml-xl-2 pl-xs-0 pl-sm-0 pl-md-3 pl-lg-5 pl-xl-5 row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-lg-4 chart-type-1">
                  <h1 className="pt-4 pl-3 pr-3">My review status</h1>
                  <center>
                    <div className="w-75 pb-3 pt-3">
                      <PieChart
                        {...this.props}
                        data={this.state.myReviewData}
                      />
                    </div>
                  </center>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-lg-4 chart-type-1 ml-0 ml-xs-0 ml-sm-0 ml-md-0 ml-lg-5 ml-xl-5 mt-5 mt-xs-5 mt-sm-5 mt-md-5 mt-lg-0 mt-xl-0">
                  <h1 className="pt-4 pl-3 pr-3">Subordinate review status</h1>
                  <center>
                    <div className="w-75 pb-3 pt-3">
                      <PieChart
                        {...this.props}
                        data={this.state.subordinateReviewStatus}
                      />
                    </div>
                  </center>
                </div>
              </div>
            </div>
          )}

        {/* Renders the DashboardDepartments component */}
        {this.state.roles &&
          this.state.roles.length !== 0 &&
          JSON.stringify(this.state.roles).includes("FRAC_ADMIN") && (
            <div className="row justify-content-center">
              <DashboardDepartments {...this.props} />
            </div>
          )}
        {this.state.roles &&
          this.state.roles.length !== 0 &&
          !JSON.stringify(this.state.roles).includes("FRAC_ADMIN") && (
            <div className="row justify-content-center">
              <footer className="custom-footer version-label mb-3 mt-3">
                v11
              </footer>
            </div>
          )}
      </div>
    );
  }
}

export default DashboardHome;
