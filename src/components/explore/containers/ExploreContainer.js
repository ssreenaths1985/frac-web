import React from "react";
import BrandSection from "../../common/BrandSection";
import TopNavBar from "../../common/TopNavBar";
import InfoNavBar from "../../common/InfoNavBar";
import SearchBar from "../views/SearchBar";
import { ExploreService } from "../../../services/explore.service";
import Notify from "../../../helpers/notify";
import { APP } from "../../../constants";
import GraphVisualization from "../views/GraphVisualization";
import ColumnFive from "../../collections/views/positions/ColumnFive";
import { DashboardService } from "../../../services/dashboard.service";
import { UserService } from "../../../services/user.service";
import CryptoJS from "crypto-js";

class ExploreContainer extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      searchResult: "",
      searchViewActivated: false,
      receivedData: "",
      showRightColumn: false,
      buttonText: "Full Screen",
      buttonClassOne: "save-button-no-border",
      buttonClassTwo: "full-screen-button",
      showEditDetails: "",
      styleClass: "",
      showNewNode: "",
      currentDept: "",
      allDeptData: "",
      clients: "",
      allSessions: "",
    };
    this.getAllNodes = this.getAllNodes.bind(this);
    this.searchForKeyword = this.searchForKeyword.bind(this);
    this.openFullscreen = this.openFullscreen.bind(this);
    this.closeFullScreen = this.closeFullScreen.bind(this);
    this.zoomToggleSwitch = this.zoomToggleSwitch.bind(this);
    this.catchEsc = this.catchEsc.bind(this);
    this.showEditColumn = this.showEditColumn.bind(this);
    this.setStyles = this.setStyles.bind(this);
    this.showNewColumn = this.showNewColumn.bind(this);
    this.decryptUtility = this.decryptUtility.bind(this);
    this.getDepartments = this.getDepartments.bind(this);
    this.getAllDepts = this.getAllDepts.bind(this);
    this.getSelectedDept = this.getSelectedDept.bind(this);
    this.encryptData = this.encryptData.bind(this);
    this.receiveClients = this.receiveClients.bind(this);
    this.receiveSessions = this.receiveSessions.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.getDepartments();
    this.getAllDepts();
    document.addEventListener("keydown", this.catchEsc, false);
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
        this.getAllNodes(this.state.currentDept);
      }
    );
  };

  encryptData = () => {
    let cipherText = CryptoJS.AES.encrypt(
      this.state.currentDept,
      "igotcheckIndia*"
    ).toString();
    localStorage.setItem("department", cipherText);
  };

  // Function to load all nodes for every first rendering
  getAllNodes = (dept) => {
    if (dept !== "All MDO") {
      ExploreService.exploreAllNodesDept(dept).then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState({
            searchResult: response.data.responseData,
          });
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });
    } else {
      ExploreService.exploreAllNodes().then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState({
            searchResult: response.data.responseData,
          });
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });
    }
  };

  // Function to fetch search results from API
  searchForKeyword(e) {
    e.preventDefault();
    let value = e.target.value;
    this.setState({
      showRightColumn: false,
    });
    if (e.target.value.length > 2) {
      this.setState(
        {
          searchViewActivated: true,
          showEditDetails: false,
          showNewNode: false,
        },
        () => {
          if (this.state.currentDept !== "All MDO") {
            ExploreService.searchNodesDept(value, this.state.currentDept).then(
              (response) => {
                if (
                  response &&
                  response.data.statusInfo.statusCode === APP.CODE.SUCCESS
                ) {
                  this.setState({
                    searchResult: response.data.responseData,
                  });
                } else {
                  Notify.error(
                    response && response.data.statusInfo.errorMessage
                  );
                }
              }
            );
          } else {
            ExploreService.searchNodes(value).then((response) => {
              if (
                response &&
                response.data.statusInfo.statusCode === APP.CODE.SUCCESS
              ) {
                this.setState({
                  searchResult: response.data.responseData,
                });
              } else {
                Notify.error(response && response.data.statusInfo.errorMessage);
              }
            });
          }
        }
      );
    }
    if (!e.target.value) {
      this.setState(
        {
          searchResult: "",
          searchViewActivated: false,
        },
        () => {
          this.getAllNodes();
        }
      );
    }
  }

  // Function enables fullscreen feature on different browsers
  openFullscreen = () => {
    var elem = document.getElementById("graphSection");
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
      this.setState({
        buttonText: "Exit Fullscreen",
        buttonClassOne: "custom-primary-button-4",
        buttonClassTwo: "close-full-screen-button",
      });
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen();
      this.setState({
        buttonText: "Exit Fullscreen",
        buttonClassOne: "custom-primary-button-4",
        buttonClassTwo: "close-full-screen-button",
      });
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      elem.webkitRequestFullscreen();
      this.setState({
        buttonText: "Exit Fullscreen",
        buttonClassOne: "custom-primary-button-4",
        buttonClassTwo: "close-full-screen-button",
      });
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      elem.msRequestFullscreen();
      this.setState({
        buttonText: "Exit Fullscreen",
        buttonClassOne: "custom-primary-button-4",
        buttonClassTwo: "close-full-screen-button",
      });
    }
  };

  // Function diables fullscreen feature on different browsers
  closeFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      this.setState({
        buttonText: "Full Screen",
        buttonClassOne: "save-button-no-border",
        buttonClassTwo: "full-screen-button",
      });
    } else if (document.mozCancelFullScreen) {
      /* Firefox */
      document.mozCancelFullScreen();
      this.setState({
        buttonText: "Full Screen",
        buttonClassOne: "save-button-no-border",
        buttonClassTwo: "full-screen-button",
      });
    } else if (document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      document.webkitExitFullscreen();
      this.setState({
        buttonText: "Full Screen",
        buttonClassOne: "save-button-no-border",
        buttonClassTwo: "full-screen-button",
      });
    } else if (document.msExitFullscreen) {
      /* IE/Edge */
      document.msExitFullscreen();
      this.setState({
        buttonText: "Full Screen",
        buttonClassOne: "save-button-no-border",
        buttonClassTwo: "full-screen-button",
      });
    }
  };

  // Function to catch esc key event and update the button text
  catchEsc = (event) => {
    if (event.keyCode === 18) {
      this.setState({
        buttonText: "Full Screen",
        buttonClassOne: "save-button-no-border",
        buttonClassTwo: "full-screen-button",
      });
    }
  };

  // Function to enable/disable the zoom
  zoomToggleSwitch = () => {
    this.setState({
      zoomToggle: true,
    });
  };

  // Function to enable the right side column
  getEnableCommand = (value, data) => {
    this.setState({
      showRightColumn: value,
      receivedData: data,
    });
  };

  showEditColumn = (value1, value2) => {
    this.setState({
      searchViewActivated: value2,
      showEditDetails: value1,
      showNewNode: false,
    });
  };

  showNewColumn = (value1, value2) => {
    this.setState({
      searchViewActivated: value2,
      showEditDetails: false,
      showNewNode: value1,
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

  getDepartments = () => {
    if (!localStorage.getItem("department") && localStorage.getItem("wid")) {
      let bytes = CryptoJS.AES.decrypt(
        localStorage.getItem("wid"),
        "igotcheckIndia*"
      );
      UserService.getRoles(bytes.toString(CryptoJS.enc.Utf8)).then((response) => {
        if (response && response.status === 200) {
          if (response.data
            && response.data.result
            && response.data.result.response
            && response.data.result.response.rootOrg
            && response.data.result.response.rootOrg.orgName
          ) {
            this.setState(
              {
                currentUserDept: response.data.result.response.rootOrg.orgName,
              },
              () => {
                this.encryptData();
                this.getAllNodes(this.state.currentDept);
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

  getAllDepts = () => {
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
  };

  getSelectedDept = (value) => {
    if (value) {
      this.setState(
        {
          currentDept: value,
        },
        () => {
          this.getAllNodes(this.state.currentDept);
        }
      );
    }
  };

  receiveClients = (list) => {
    this.setState({
      clients: list,
    });
  };

  receiveSessions = (data) => {
    this.setState({
      allSessions: data
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.location.key !== prevProps.location.key) {
      setTimeout(() => {
        this.getAllNodes();
      }, 500);
      this.setState({
        showNewNode: false,
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    return (
      <React.Fragment>
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <div className="row">
            <BrandSection />
            <TopNavBar
              pathName={this.props.history.location.pathname}
              history={this.props.history}
            />
            <InfoNavBar
              history={this.props.history}
              keycloak={this.props.keycloak}
              receiveClients={this.receiveClients}
              receiveSessions={this.receiveSessions}
            />
          </div>
        </div>

        <div id="graphSection" className="d-flex">
          <div
            className={`custom-padding-1 ${this.state.showRightColumn
              ? "col-xs-12 col-sm-12 col-md-9 col-lg-9 col-xl-9"
              : "col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
              }`}
          >
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 custom-padding-1">
              <SearchBar
                history={this.props.history}
                searchNode={this.searchForKeyword}
                changeTxt={this.state.buttonText}
                fullScreen={this.openFullscreen}
                closeScreen={this.closeFullScreen}
                fitScreen={this.zoomToggleSwitch}
                classOne={this.state.buttonClassOne}
                classTwo={this.state.buttonClassTwo}
                showEditColumn={this.showEditColumn}
                editDetails={this.state.showEditDetails}
                searchActivated={this.state.searchViewActivated}
                showNewNode={this.state.showNewNode}
                showNewColumn={this.showNewColumn}
                clients={this.state.clients}
                allSessions={this.state.allSessions}
              />
            </div>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 custom-padding-1 custom-body-bg custom-full-height-4">
              {this.state.searchResult && (
                <GraphVisualization
                  {...this.props}
                  history={this.props.history}
                  selectedItem={this.state.selectedItem}
                  graphData={this.state.searchResult}
                  toggle={this.state.toggle}
                  zoom={this.state.zoomToggle}
                  searchColumn={this.state.searchViewActivated}
                  commandFunction={this.getEnableCommand}
                  searchActivated={this.state.searchViewActivated}
                  editDetails={this.state.showEditDetails}
                  showEditColumn={this.showEditColumn}
                  showNewNode={this.state.showNewNode}
                  showNewColumn={this.showNewColumn}
                  currentDept={this.state.currentDept}
                  allDepts={this.state.allDeptData}
                  getSelectedDept={this.getSelectedDept}
                  clients={this.state.clients}
                  allSessions={this.state.allSessions}
                />
              )}
              {!this.state.searchResult && (
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 bordered custom-full-height-4 custom-body-bg">
                  <div
                    className="vertical-center d-none d-sm-block"
                    id="emptyState"
                  >
                    <center>
                      <div
                        className="shapeshifter play"
                        style={{
                          backgroundImage: "url(/img/loader/loader01.svg)",
                        }}
                      ></div>
                    </center>
                  </div>
                </div>
              )}
            </div>
          </div>
          {this.state.showRightColumn && (
            <ColumnFive
              {...this.props}
              roleId={this.state.receivedData.selectedID}
              type={this.state.receivedData.selectedType}
              childType={this.state.receivedData.childType}
              parentType={this.state.receivedData.parentType}
              btnText={this.state.receivedData.btnText}
              url={this.state.receivedData.url}
              stateDataKey={this.state.receivedData.stateDataKey}
              searchBarStyle="custom-search-bar-3"
              customHeight="custom-full-height-4"
              clients={this.state.clients}
              allSessions={this.state.allSessions}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default ExploreContainer;
