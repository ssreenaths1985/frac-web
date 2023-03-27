import React from "react";
import { MasterService } from "../../../../services/master.service";
import Notify from "../../../../helpers/notify";
import { APP } from "../../../../constants";
import ColumnFive from "../positions/ColumnFive";
import ColumnSix from "../positions/ColumnSix";
import RatingAndFeedback from "../common/RatingAndFeedback";
import CryptoJS from "crypto-js";
import { List } from "react-virtualized";
import AutoSizer from "react-virtualized-auto-sizer";

const MAP_KR = "Map KR";
const formFields = [APP.FIELD_NAME.DESCRITPION, MAP_KR];

class ColumnThree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      activityDetails: [],
      activityData: {
        name: "",
        description: "",
      },
      activityResponse: {},
      enableSaveAction: false,
      formUpdated: false,
      roleList: [],
      selectedRoleList: [],
      mappedRole: [],
      searchResultActivities: [],
      getRole: false,
      getSelectedActivityID: "",
      letterCount: 100,
      competencyList: [],
      selectedCompetencyList: [],
      mappedCompetency: [],
      getSelectedCompetencyID: "",
      krList: [],
      selectedKrList: [],
      mappedKr: [],
      getKR: false,
      getSelectedKRID: "",
      keyCodes: [8, 46, 37, 39, 38, 40],
      comments: [],
      commentText: "",
      changeRating: true,
      clearSearchCompetencyACT: false,
      clearSearchInputCompetencyACT: false,
      clearSearchMappedCompetencyACT: false,
      clearSearchInputMappedCompetencyACT: false,
      clearSearchMappedRoleACT: false,
      clearSearchInputMappedRoleACT: false,
      clearSearchMappedKrACT: false,
      clearSearchInputMappedKrACT: false,
      clearSearchKrACT: false,
      clearSearchInputKrACT: false,
      clearSearchKrACTTwo: false,
      clearSearchInputKrACTTwo: false,
      showActivityLog: true,
      activityLogs: [],
      saveAsDraft: false,
      roles: "",
      source: "",
      showFeedback: false,
      krSearchkeyword: "",
      searchKrList: [],
      columnSixTabRef: "",
    };
    this.saveActivity = this.saveActivity.bind(this);
    this.onActivityChange = this.onActivityChange.bind(this);
    this.getActivityDetails = this.getActivityDetails.bind(this);
    this.getRolesList = this.getRolesList.bind(this);
    this.getRoleMapped = this.getRoleMapped.bind(this);
    this.getSimilarActivities = this.getSimilarActivities.bind(this);
    this.selectedRole = this.selectedRole.bind(this);
    this.receiveData = this.receiveData.bind(this);
    this.getLetterCount = this.getLetterCount.bind(this);
    this.getCompentencyList = this.getCompentencyList.bind(this);
    this.getCompentencyMapped = this.getCompentencyMapped.bind(this);
    this.selectionToggleTwo = this.selectionToggleTwo.bind(this);
    this.mapCompetencyToActivity = this.mapCompetencyToActivity.bind(this);
    this.selectedCompetency = this.selectedCompetency.bind(this);
    this.searchCompetency = this.searchCompetency.bind(this);
    this.searchMappedCompetency = this.searchMappedCompetency.bind(this);
    this.searchMappedRole = this.searchMappedRole.bind(this);
    this.getKRList = this.getKRList.bind(this);
    this.selectionToggleThree = this.selectionToggleThree.bind(this);
    this.mapKRToActivity = this.mapKRToActivity.bind(this);
    this.getKRMapped = this.getKRMapped.bind(this);
    this.selectedKR = this.selectedKR.bind(this);
    this.searchMappedKR = this.searchMappedKR.bind(this);
    this.searchKr = this.searchKr.bind(this);
    this.searchKrTwo = this.searchKrTwo.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.unmapKR = this.unmapKR.bind(this);
    this.resetActivityHandler = this.resetActivityHandler.bind(this);
    this.getLogs = this.getLogs.bind(this);
    this.checkAccess = this.checkAccess.bind(this);
  }

  componentDidMount() {
    this.checkAccess();
    if (this.props.history.location.state) {
      if (this.props.history.location.state.id !== "0") {
        this.setState(
          {
            id: this.props.history.location.state.id,
          },
          () => {
            if (this.state.id !== 0) {
              this.getActivityDetails(this.state.id, "ACTIVITY");
              this.getRoleMapped(this.state.id, "ROLE");
              this.getKRMapped(this.state.id, "KNOWLEDGERESOURCE");
              this.getLogs(this.state.id, "ACTIVITY");
            } else {
              this.updateFormFieldAccess();
            }
          }
        );
      }
    }
    if (document.getElementById("masterColumn3")) {
      document
        .getElementById("masterColumn3")
        .addEventListener("mousedown", (event) => {
          let checkIds = ["mappedKRList", "mappedRoleList"];
          if (
            event.path &&
            event.path.length > 3 &&
            !event.path[4].id.includes(checkIds)
          ) {
            this.resetActivityHandler();
          }
        });
    }
  }

  resetActivityHandler = () => {
    this.setState({
      getKR: false,
      getRole: false,
      showActivityLog: true,
      getSelectedActivityID: "",
      getSelectedKRID: "",
    });
  };

  checkAccess = () => {
    // setTimeout(() => {
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
          if (this.state.id !== 0) {
            this.getActivityDetails(this.state.id, "ACTIVITY");
          }
        }
      );
    }
    // }, 300);
  };

  receiveData = (name, description) => {
    if (name && description) {
      this.setState(
        {
          activityData: {
            ...this.state.activityData,
            name: name,
            description: description,
          },
        },
        () => {
          this.setState({
            letterCount: 100 - this.state.activityData.description.length,
          });
        }
      );
    }
  };

  searchCompetency = () => {
    let input, filter, ul, li, a, i, txtValue;
    if (!this.state.clearSearchInputCompetencyACT) {
      this.setState({
        clearSearchCompetencyACT: true,
      });
    } else {
      this.setState({
        clearSearchCompetencyACT: false,
        clearSearchInputCompetencyACT: false,
      });
    }

    input = document.getElementById("competencySearch");

    if (input.value.length === 0) {
      this.setState({
        clearSearchCompetencyACT: false,
        clearSearchInputCompetencyACT: false,
      });
    }

    if (!this.state.clearSearchInputCompetencyACT) {
      filter = input.value.toUpperCase();
    } else {
      filter = "";
    }

    ul = document.getElementById("competencyList");
    li = ul.getElementsByTagName("dd");

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("div")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  };

  searchKr = () => {
    let input, filter, ul, li, a, i, txtValue;
    if (!this.state.clearSearchInputKrACT) {
      this.setState({
        clearSearchKrACT: true,
      });
    } else {
      this.setState({
        clearSearchKrACT: false,
        clearSearchInputKrACT: false,
      });
    }

    input = document.getElementById("krSearch");

    if (input.value.length === 0) {
      this.setState({
        clearSearchKrACT: false,
        clearSearchInputKrACT: false,
      });
    }

    if (!this.state.clearSearchInputKrACT) {
      filter = input.value.toUpperCase();
    } else {
      filter = "";
    }

    ul = document.getElementById("krList");
    li = ul.getElementsByTagName("dd");

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("div")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  };

  searchKrTwo = () => {
    let input, filter, ul, li, a, i, txtValue;
    if (!this.state.clearSearchInputKrACTTwo) {
      this.setState({
        clearSearchKrACTTwo: true,
      });
    } else {
      this.setState({
        clearSearchKrACTTwo: false,
        clearSearchInputKrACTTwo: false,
      });
    }

    input = document.getElementById("krSearchTwo");

    if (input.value.length === 0) {
      this.setState({
        clearSearchKrACTTwo: false,
        clearSearchInputKrACTTwo: false,
      });
    }

    if (!this.state.clearSearchInputKrACT) {
      filter = input.value.toUpperCase();
    } else {
      filter = "";
    }

    ul = document.getElementById("krListTwo");
    li = ul.getElementsByTagName("dd");

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("div")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  };

  searchMappedCompetency = () => {
    // Declare variables
    let input, filter, ul, li, a, i, txtValue;
    if (!this.state.clearSearchInputMappedCompetencyACT) {
      this.setState({
        clearSearchMappedCompetencyACT: true,
      });
    } else {
      this.setState({
        clearSearchMappedCompetencyACT: false,
        clearSearchInputMappedCompetencyACT: false,
      });
    }

    input = document.getElementById("mappedCompetencySearch");

    if (input.value.length === 0) {
      this.setState({
        clearSearchMappedCompetencyACT: false,
        clearSearchInputMappedCompetencyACT: false,
      });
    }

    if (!this.state.clearSearchInputMappedCompetencyACT) {
      filter = input.value.toUpperCase();
    } else {
      filter = "";
    }

    ul = document.getElementById("mappedCompetencyList");
    li = ul.getElementsByTagName("div");

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  };

  searchMappedRole = () => {
    // Declare variables
    let input, filter, ul, li, a, i, txtValue;
    if (!this.state.clearSearchInputMappedRoleACT) {
      this.setState({
        clearSearchMappedRoleACT: true,
      });
    } else {
      this.setState({
        clearSearchMappedRoleACT: false,
        clearSearchInputMappedRoleACT: false,
      });
    }

    input = document.getElementById("mappedRoleSearch");

    if (input.value.length === 0) {
      this.setState({
        clearSearchMappedRoleACT: false,
        clearSearchInputMappedRoleACT: false,
      });
    }

    if (!this.state.clearSearchInputMappedRoleACT) {
      filter = input.value.toUpperCase();
    } else {
      filter = "";
    }

    ul = document.getElementById("mappedRoleList");
    li = ul.getElementsByTagName("div");

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  };

  searchMappedKR = () => {
    // Declare variables
    let input, filter, ul, li, a, i, txtValue;
    if (!this.state.clearSearchInputMappedKrACT) {
      this.setState({
        clearSearchMappedKrACT: true,
      });
    } else {
      this.setState({
        clearSearchMappedKrACT: false,
        clearSearchInputMappedKrACT: false,
      });
    }

    input = document.getElementById("mappedKRSearch");

    if (input.value.length === 0) {
      this.setState({
        clearSearchMappedKrACT: false,
        clearSearchInputMappedKrACT: false,
      });
    }

    if (!this.state.clearSearchInputMappedKrACT) {
      filter = input.value.toUpperCase();
    } else {
      filter = "";
    }

    ul = document.getElementById("mappedKRList");
    li = ul.getElementsByTagName("div");

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  };

  getSimilarActivities = (event) => {
    // To get similar roles while typing in the field
    if (event && !event.custom) {
      event.preventDefault();
    }

    // For Name
    if (
      event.target.name === "activityLabel" &&
      this.state.activityData.name &&
      this.state.activityData.name.length > 1
    ) {
      if (!event.custom) {
        this.setState({
          columnSixTabRef: APP.PARAMETERS.SIMILAR_ITEM_TAB_REF,
        });
      }
      let searchPayloadNameACT = {
        searches: [
          {
            type: "ACTIVITY",
            field: "name",
            keyword: this.state.activityData.name,
          },
        ],
      };
      MasterService.searchNodes(searchPayloadNameACT).then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState(
            {
              searchResultActivities: [],
            },
            () => {
              const resultSet = [];
              response.data.responseData.forEach((searchObj) => {
                if (searchObj.id !== this.state.activityData.id) {
                  resultSet.push(searchObj);
                }
              });
              this.setState({
                searchResultActivities: [
                  ...this.state.searchResultActivities,
                  resultSet,
                ],
              });
            }
          );
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });
    } else {
      this.setState({
        searchResultActivities: [],
      });
    }

    // For Description
    if (
      event.target.name === "activityDescription" &&
      this.state.activityData.description &&
      this.state.activityData.description.length > 1
    ) {
      let searchPayloadDescriptionACT = {
        searches: [
          {
            type: "ACTIVITY",
            field: "description",
            keyword: this.state.activityData.description,
          },
        ],
      };
      MasterService.searchNodes(searchPayloadDescriptionACT).then(
        (response) => {
          if (
            response &&
            response.data.statusInfo.statusCode === APP.CODE.SUCCESS
          ) {
            this.setState(
              {
                searchResultActivities: [],
              },
              () => {
                const resultSet = [];
                response.data.responseData.forEach((searchObj) => {
                  if (searchObj.id !== this.state.activityData.id) {
                    resultSet.push(searchObj);
                  }
                });
                this.setState({
                  searchResultActivities: [
                    ...this.state.searchResultActivities,
                    resultSet,
                  ],
                });
              }
            );
          } else {
            Notify.error(response && response.data.statusInfo.errorMessage);
          }
        }
      );
    } else {
      this.setState({
        searchResultActivities: [],
      });
    }
  };

  selectedRole = (id) => {
    this.setState({
      getRole: true,
      showActivityLog: false,
      getSelectedRoleID: id,
    });
  };

  saveActivity = (e) => {
    if (e) {
      e.preventDefault();
    }
    let activityPayload;

    if (this.state.id === 0) {
      activityPayload = {
        type: "ACTIVITY",
        source: "FRAC",
        description: this.state.activityData.description,
      };
    } else {
      activityPayload = {
        type: "ACTIVITY",
        source: this.state.source.length !== 0 ? this.state.source : "FRAC",
        id: this.state.id,
        description: this.state.activityData.description,
      };
    }

    if (this.state.saveAsDraft) {
      activityPayload.status = "DRAFT";
    }

    // For later references

    if (
      (activityPayload.description !== 0 &&
        activityPayload.description.length > 1) ||
      this.state.saveAsDraft
    ) {
      MasterService.addDataNode(activityPayload).then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.formValidation();
          if (this.state.id === 0) {
            Notify.dark("Activity created successfully");
          } else {
            Notify.dark("Activity updated successfully");
          }

          this.setState(
            {
              enableSaveAction: false,
              showActivityLog: true,
              getKR: false,
              getRole: false,
              saveAsDraft: false,
            },
            () => {
              setTimeout(() => {
                if (this.state.id !== 0) {
                  this.getLogs(this.state.id, "ACTIVITY");
                }
              }, 800);
            }
          );
          const pathName =
            this.props.review && this.props.review === "true"
              ? APP.ROUTES_PATH.REVIEW_ACTIVITIES
              : APP.COLLECTIONS_PATH.ACTIVITY;
          this.props.history.push({
            pathname: pathName + response.data.responseData.id,
            state: {
              isNewActivity: false,
              id: response.data.responseData.id,
              type: "ACTIVITY",
              stayOn: true,
              showColumnThree: true,
            },
          });
          if (this.state.id !== 0) {
            setTimeout(() => {
              this.getActivityDetails(
                response.data.responseData.id,
                "ACTIVITY"
              );
            }, 700);
          }
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });
    } else {
      Notify.error("Kindly fill required details");
    }
  };

  getActivityDetails = (id, type) => {
    if (id !== 0) {
      setTimeout(() => {
        MasterService.getDataByNodeId(id, type).then((response) => {
          if (
            response &&
            response.data.statusInfo.statusCode === APP.CODE.SUCCESS
          ) {
            this.setState(
              {
                activityData: response.data.responseData,
                activityResponse: response.data.responseData,
                source: response.data.responseData.source,
              },
              () => {
                if (this.props.review || this.props.review === "true") {
                  const event = {
                    target: { name: "activityDescription" },
                    custom: true,
                  };
                  this.getSimilarActivities(event);
                }
                this.formValidation();
                this.updateFormFieldAccess();
                if (this.state.activityData.description) {
                  this.setState({
                    letterCount:
                      this.state.letterCount -
                      this.state.activityData.description.length,
                  });
                }

                if (response.data.responseData.status === "DRAFT") {
                  this.setState({
                    saveAsDraft: true,
                  });
                } else {
                  this.setState({
                    saveAsDraft: false,
                  });
                }
              }
            );
          } else {
            Notify.error(response && response.data.statusInfo.errorMessage);
          }
        });
      }, 800);
    } else {
      this.setState({
        activityData: {
          id: "",
          name: "",
          description: "",
        },
      });
    }
  };

  updateFormFieldAccess() {
    let disable = false;
    if (
      this.state.id &&
      this.state.activityData.secondaryStatus &&
      this.state.activityData.secondaryStatus === APP.NODE_STATUS.VERIFIED &&
      !this.state.roles.includes("FRAC_ADMIN") &&
      !this.state.roles.includes("FRAC_REVIEWER_L2")
    ) {
      disable = true;
    }

    formFields.forEach((field) => {
      const elementId = APP.COLLECTIONS.ACTIVITY + field + "value";
      const element = document.getElementById(elementId);
      if (element) {
        element.disabled = disable;
      }
    });
  }

  onActivityChange = (e) => {
    e.preventDefault();
    let onlyAlphabet = /^[/+#\-_()., A-Za-z ]*$/;

    switch (e.target.name) {
      case "activityLabel":
        if (!onlyAlphabet.test(e.target.value)) {
          return false;
        }
        this.setState(
          {
            activityData: {
              ...this.state.activityData,
              name: e.target.value,
            },
          },
          () => {
            this.formValidation();
          }
        );
        break;
      case "activityDescription":
        this.setState(
          {
            activityData: {
              ...this.state.activityData,
              description: e.target.value,
            },
          },
          () => {
            this.formValidation();
          }
        );
        break;
      case "searchKR":
        this.setState(
          {
            krSearchkeyword: e.target.value,
          },
          () => {
            this.getKrSearch();
          }
        );
        break;
      default:
        break;
    }
  };

  getKrSearch() {
    this.setState({
      searchKrList: this.state.krList.filter(
        (obj) =>
          (obj.name &&
            obj.name
              .toLowerCase()
              .includes(this.state.krSearchkeyword.toLowerCase())) ||
          (obj.id &&
            obj.id
              .toLowerCase()
              .includes(this.state.krSearchkeyword.toLowerCase()))
      ),
    });
  }

  getRolesList = () => {
    MasterService.getNodesByType("ROLE").then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        this.setState({
          roleList: response.data.responseData,
        });
        if (this.state.mappedRole) {
          this.state.mappedRole.map((k, l) => {
            this.setState((prevState) => ({
              selectedRoleList: [k.id, ...prevState.selectedRoleList],
            }));
            return null;
          });
        }
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  getCompentencyList = () => {
    MasterService.getNodesByType("COMPETENCY").then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        this.setState({
          competencyList: response.data.responseData,
        });
        if (this.state.mappedCompetency) {
          this.state.mappedCompetency.map((k, l) => {
            this.setState((prevState) => ({
              selectedCompetencyList: [
                k.id,
                ...prevState.selectedCompetencyList,
              ],
            }));
            return null;
          });
        }
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  getKRList = () => {
    MasterService.getNodesByType("KNOWLEDGERESOURCE").then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        this.setState({
          krList: response.data.responseData,
          searchKrList: response.data.responseData,
        });
        if (this.state.mappedKr) {
          this.state.mappedKr.map((k, l) => {
            this.setState((prevState) => ({
              selectedKrList: [k.id, ...prevState.selectedKrList],
            }));
            return null;
          });
        }
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  selectionToggleTwo = (id) => {
    if (this.state.mappedCompetency) {
      this.state.mappedCompetency.map((k, l) => {
        this.setState((prevState) => ({
          selectedCompetencyList: [k.id, ...prevState.selectedCompetencyList],
        }));
        return null;
      });
    }
    this.setState(
      {
        selectedCompetencyList: [...this.state.selectedCompetencyList, id],
      },
      () => {
        this.state.selectedCompetencyList.forEach((i, j) => {
          if (
            this.state.selectedCompetencyList.indexOf(i) !== j &&
            this.state.selectedCompetencyList.includes(id)
          ) {
            if (this.state.selectedCompetencyList.indexOf(id) > -1) {
              this.state.selectedCompetencyList.splice(
                this.state.selectedCompetencyList.indexOf(id),
                1
              );
              this.state.selectedCompetencyList.splice(
                this.state.selectedCompetencyList.indexOf(i),
                1
              );
            }

            this.setState({
              selectedCompetencyList: this.state.selectedCompetencyList,
            });
          }
        });
      }
    );
  };

  selectionToggleThree = (id) => {
    if (this.state.mappedKr) {
      this.state.mappedKr.map((k, l) => {
        this.setState((prevState) => ({
          selectedKrList: [k.id, ...prevState.selectedKrList],
        }));
        return null;
      });
    }
    this.setState(
      {
        selectedKrList: [...this.state.selectedKrList, id],
      },
      () => {
        this.state.selectedKrList.forEach((i, j) => {
          if (
            this.state.selectedKrList.indexOf(i) !== j &&
            this.state.selectedKrList.includes(id)
          ) {
            if (this.state.selectedKrList.indexOf(id) > -1) {
              this.state.selectedKrList.splice(
                this.state.selectedKrList.indexOf(id),
                1
              );
              this.state.selectedKrList.splice(
                this.state.selectedKrList.indexOf(i),
                1
              );
            }

            this.setState({
              selectedKrList: this.state.selectedKrList,
            });
          }
        });
      }
    );
  };

  mapCompetencyToActivity = () => {
    let mapPayload = {
      parent: "ACTIVITY",
      parentId: this.state.id,
      child: "COMPETENCY",
      childIds: this.state.selectedCompetencyList,
    };
    MasterService.mapNodes(mapPayload).then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        if (
          this.state.selectedCompetencyList.length <
            this.state.mappedCompetency.length ||
          this.state.selectedCompetencyList.length ===
            this.state.mappedCompetency.length
        ) {
          Notify.dark("Unmapped successfully");
        } else {
          Notify.dark("Mapped successfully");
        }
        this.setState({
          selectedCompetencyList: [],
          showActivityLog: true,
        });

        setTimeout(() => {
          this.getCompentencyMapped(this.state.id, "COMPETENCY");
          if (this.state.id !== 0) {
            this.getLogs(this.state.id, "ACTIVITY");
          }
        }, 800);
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  mapKRToActivity = () => {
    let mapPayload = {
      parent: "ACTIVITY",
      parentId: this.state.id,
      child: "KNOWLEDGERESOURCE",
      childIds: this.state.selectedKrList,
    };
    MasterService.mapNodes(mapPayload).then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        if (
          this.state.selectedKrList.length < this.state.mappedKr.length ||
          this.state.selectedKrList.length === this.state.mappedKr.length
        ) {
          Notify.dark("Unmapped successfully");
        } else {
          Notify.dark("Mapped successfully");
        }
        this.setState({
          selectedKrList: [],
          showActivityLog: true,
        });

        setTimeout(() => {
          this.getKRMapped(this.state.id, "KNOWLEDGERESOURCE");
          if (this.state.id !== 0) {
            this.getLogs(this.state.id, "ACTIVITY");
          }
        }, 800);
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  getRoleMapped = (id, type) => {
    MasterService.getParentNode(id, type).then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        this.setState({
          mappedRole: response.data.responseData,
        });
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  getCompentencyMapped = (id, type) => {
    MasterService.getChildForParent(id, type).then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        this.setState({
          mappedCompetency: response.data.responseData,
        });
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  getKRMapped = (id, type) => {
    MasterService.getChildForParent(id, type).then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        this.setState({
          mappedKr: response.data.responseData,
        });
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  // Text character counter
  getLetterCount = (event) => {
    if (event.target.name === "activityDescription") {
      this.setState({
        letterCount: 100 - this.state.activityData.description.length,
      });
    }
  };

  selectedCompetency = (id) => {
    this.setState({
      getRole: false,
      showActivityLog: true,
      getSelectedCompetencyID: id,
    });
  };

  selectedKR = (id) => {
    this.setState({
      getRole: false,
      showActivityLog: false,
      getKR: true,
      getSelectedKRID: id,
    });
  };

  // Method to delete an Activity
  deleteItem = (id, type) => {
    MasterService.deleteNode(id, type).then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        Notify.dark("Activity deleted successfully");
        this.setState({
          enableSaveAction: false,
          showActivityLog: true,
          getRole: false,
          getKR: false,
        });
        const pathName =
          this.props.review && this.props.review === "true"
            ? APP.ROUTES_PATH.REVIEW_ACTIVITIES
            : APP.COLLECTIONS_PATH.ACTIVITY;
        this.props.history.push({
          pathname: pathName,
          state: {
            isNewActivity: false,
            type: "ACTIVITY",
            stayOn: true,
            deleteItem: true,
            showColumnThree: false,
          },
        });
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  unmapKR = (id) => {
    if (this.state.mappedKr) {
      let tempArray = [];
      this.state.mappedKr.map((i, j) => {
        if (i.id !== id) {
          tempArray.push(i);
        }
        return null;
      });
      this.setState({
        mappedKr: tempArray,
      });
      tempArray.map((k, l) => {
        this.setState((prevState) => ({
          selectedKrList: [k.id, ...prevState.selectedKrList],
        }));
        return null;
      });
      this.setState({
        getKR: false,
      });
    }
  };

  getLogs = (id, type) => {
    if (this.state.id !== 0) {
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
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.department !== this.props.department) {
      this.props.history.push({
        pathname: "/collection-activities/",
        state: {
          isNewActivity: false,
          type: "ACTIVITY",
        },
      });
    }
    if (this.props.match.params.id !== "0") {
      if (prevProps.location.state.id !== this.props.location.state.id) {
        this.setState(
          {
            id: this.props.location.state.id,
            showActivityLog: true,
            getRole: false,
            getKR: false,
            getSelectedActivityID: "",
            getSelectedCompetencyID: "",
            getSelectedRoleID: "",
            getSelectedKRID: "",
            letterCount: 100,
            rating: 0,
            comments: [],
            commentText: "",
            receivedRating: "",
            averageRating: "",
            activityLogs: [],
            activityData: {
              id: "",
              name: "",
              description: "",
            },
            activityResponse: {},
            enableSaveAction: false,
            formUpdated: false,
            mappedRole: [],
            selectedRoleList: [],
            mappedCompetency: [],
            selectedCompetencyList: [],
            mappedKr: [],
            selectedKrList: [],
            source: "",
            krSearchkeyword: "",
            searchKrList: [],
          },
          () => {
            if (this.state.id !== 0) {
              this.getActivityDetails(this.state.id, "ACTIVITY");
              this.getRoleMapped(this.state.id, "ROLE");
              this.getKRMapped(this.state.id, "KNOWLEDGERESOURCE");
              this.getLogs(this.state.id, "ACTIVITY");
            } else {
              this.updateFormFieldAccess();
            }
          }
        );
      }
    } else {
      this.updateFormFieldAccess();
      if (prevProps.location.state.id !== this.props.location.state.id) {
        this.setState({
          activityData: {
            id: "",
            name: "",
            description: "",
          },
          mappedRole: [],
          selectedRoleList: [],
          mappedCompetency: [],
          selectedCompetencyList: [],
          mappedKr: [],
          selectedKrList: [],
          letterCount: 100,
          rating: 0,
          comments: [],
          commentText: "",
          receivedRating: "",
          averageRating: "",
          activityLogs: [],
          source: "",
          activityResponse: {},
          enableSaveAction: false,
          formUpdated: false,
          krSearchkeyword: "",
          searchKrList: [],
        });
      }
    }
    // Review
    if (
      this.props.review &&
      this.props.review === "true" &&
      this.props.selectedNodeStatus &&
      this.props.selectedNodeStatus !== this.state.activityData.status
    ) {
      this.setState({
        activityData: {
          ...this.state.activityData,
          status: this.props.selectedNodeStatus,
        },
      });
    }

    if (document.getElementById("more-menu")) {
      document
        .getElementById("more-menu")
        .addEventListener("mousedown", (event) => {
          setTimeout(() => {
            if (
              event.path &&
              event.path.find((o) => o.id === "feedbackDropdownMenu")
            ) {
              if (
                document
                  .getElementById("feedbackDropdownMenu")
                  .getAttribute("aria-expanded") === "true"
              ) {
                this.setState(
                  {
                    showFeedback: true,
                  },
                  () => {
                    document.getElementById("feedbackDropdownMenu").click();
                    document
                      .getElementById("feedback-dd-menu-1")
                      .classList.add("show");
                  }
                );
              }
            } else {
              this.setState({
                showFeedback: false,
              });
            }
          }, 300);
        });
    }

    document
      .getElementById("masterColumn3")
      .addEventListener("mousedown", (event) => {
        if (this.state.columnSixTabRef !== "") {
          this.setState({
            columnSixTabRef: "",
          });
        }
        if (this.state.showFeedback) {
          setTimeout(() => {
            const feedbackModal = document.getElementById("feedback-dd-menu-1");
            if (feedbackModal && !feedbackModal.classList.contains("show")) {
              this.setState({
                showFeedback: false,
              });
            }
          }, 300);
        }
      });
  }

  // Checks all the required fields of the form is filled,
  // if yes then enables the save button else disable the button
  formValidation() {
    let formValid = false;
    const activityData = this.state.activityData;
    if (activityData.description) {
      formValid = true;
    }
    this.detectFormChanges();
    this.setState({
      enableSaveAction: formValid,
    });
    return formValid;
  }

  detectFormChanges() {
    let changesDetected = false;
    const activityData = JSON.parse(JSON.stringify(this.state.activityData));
    if (
      JSON.stringify(this.state.activityResponse) !==
      JSON.stringify(activityData)
    ) {
      changesDetected = true;
    }
    this.setState({
      formUpdated: changesDetected,
    });
  }

  render() {
    return (
      <div className="row p-0 col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xsl-8 m-0">
        <div
          className={`bordered custom-full-height-4 custom-body-bg ${
            this.state.getRole || this.state.getKR || this.state.showActivityLog
              ? "col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8"
              : "col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
          }`}
          id="masterColumn3"
        >
          <div>
            <div className="p-2 mt-2">
              <div className="sticky-area-top custom-body-bg">
                <div className="row mb-3 p-2 mt-3">
                  {/* status tag */}
                  <div
                    className={` ${
                      this.state.formUpdated
                        ? !this.props.review || this.props.review === "false"
                          ? "col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-3"
                          : "col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4"
                        : "col-xs-12 col-sm-12 col-md-12 col-lg-5 col-xl-5"
                    } `}
                  >
                    {this.state.id !== 0 && (
                      <div className="float-left">
                        {!this.props.review || this.props.review === "false" ? (
                          // status tage
                          <div className="status-tag">
                            {this.state.activityData.status !==
                              APP.NODE_STATUS.DRAFT && (
                              <React.Fragment>
                                {(!this.state.activityData.secondaryStatus ||
                                  this.state.activityData.secondaryStatus ===
                                    APP.NODE_STATUS.UNVERIFIED) && (
                                  <React.Fragment>
                                    {this.state.activityData.status &&
                                    this.state.activityData.status ===
                                      APP.NODE_STATUS.REJECTED ? (
                                      <p className="status-rejected status-text">
                                        Rejected
                                      </p>
                                    ) : (
                                      <React.Fragment>
                                        {this.props.review &&
                                        this.props.review === "true" &&
                                        this.state.roles &&
                                        this.state.roles.includes(
                                          APP.USER_ROLES.REVIEWER_ONE
                                        ) &&
                                        this.state.activityData.status ===
                                          APP.NODE_STATUS.VERIFIED ? (
                                          <p className="status-verified status-text">
                                            Verified
                                          </p>
                                        ) : (
                                          <p className="status-unverified status-text">
                                            {this.props.review &&
                                            this.props.review === "true"
                                              ? "Unverified"
                                              : "Sent for review"}
                                          </p>
                                        )}
                                      </React.Fragment>
                                    )}
                                  </React.Fragment>
                                )}
                                {this.state.activityData.secondaryStatus &&
                                  this.state.activityData.secondaryStatus ===
                                    APP.NODE_STATUS.VERIFIED && (
                                    <p className="status-verified status-text">
                                      Verified
                                    </p>
                                  )}
                                {this.state.activityData.secondaryStatus &&
                                  this.state.activityData.secondaryStatus ===
                                    APP.NODE_STATUS.REJECTED && (
                                    <p className="status-rejected status-text">
                                      Rejected
                                    </p>
                                  )}
                              </React.Fragment>
                            )}
                            {this.state.activityData.status ===
                              APP.NODE_STATUS.DRAFT && (
                              <p className="status-draft status-text">Draft</p>
                            )}
                          </div>
                        ) : (
                          // similar competency
                          <React.Fragment>
                            {this.state.searchResultActivities[0] &&
                            this.state.searchResultActivities[0].length > 0 ? (
                              <div
                                className="status-tag pointer"
                                onClick={() => {
                                  this.setState({
                                    columnSixTabRef:
                                      APP.PARAMETERS.SIMILAR_ITEM_TAB_REF,
                                  });
                                }}
                              >
                                <p className="filter-msg status-text status-text-PL">
                                  {this.state.searchResultActivities[0].length}{" "}
                                  Similar items found
                                </p>
                              </div>
                            ) : (
                              <div className="status-tag pointer">
                                <p className="filter-msg status-text status-text-PL">
                                  No similar items found
                                </p>
                              </div>
                            )}
                          </React.Fragment>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Delete action & feedback component */}
                  <div
                    className={` ${
                      this.state.formUpdated
                        ? !this.props.review || this.props.review === "false"
                          ? "col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-9"
                          : "col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-8"
                        : "col-xs-12 col-sm-12 col-md-12 col-lg-7 col-xl-7"
                    } `}
                  >
                    <div className="d-inline-block float-right">
                      {this.state.id !== 0 &&
                        (!this.props.review ||
                          this.props.review === "false") && (
                          <React.Fragment>
                            <div className="d-inline-block">
                              {this.state.formUpdated &&
                                this.state.showFeedback && (
                                  <div id="feedback-btn" className="col-6">
                                    <RatingAndFeedback {...this.props} />
                                  </div>
                                )}

                              {this.state.formUpdated &&
                                !this.state.showFeedback && (
                                  <button
                                    className="btn more-btn"
                                    type="button"
                                    id="moreDropdownMenu"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                  >
                                    More
                                  </button>
                                )}
                              <div
                                className={` ${
                                  this.state.formUpdated
                                    ? "dropdown-menu right-dropdown-menu-3 col-3 col-lg-3 col-xl-2 col-md-3 p-0"
                                    : "row"
                                } `}
                                role="menu"
                                aria-labelledby="moreDropdownMenu"
                                id="more-menu"
                              >
                                <div
                                  className={`${
                                    this.state.roles.includes(
                                      APP.USER_ROLES.FRAC_ADMIN
                                    ) ||
                                    this.state.roles.includes(
                                      APP.USER_ROLES.REVIEWER_TWO
                                    )
                                      ? "mr-0"
                                      : "mr-4"
                                  } `}
                                >
                                  <RatingAndFeedback {...this.props} />
                                </div>
                                {this.state.roles &&
                                  (this.state.roles.includes(
                                    APP.USER_ROLES.FRAC_ADMIN
                                  ) ||
                                    this.state.roles.includes(
                                      APP.USER_ROLES.REVIEWER_TWO
                                    )) && (
                                    <div className="dropdown-content">
                                      <button
                                        className={` btn delete-button-1 ${
                                          this.state.formUpdated &&
                                          !this.state.showFeedback
                                            ? "mr-0"
                                            : "mr-4"
                                        } `}
                                        type="button"
                                        data-toggle="modal"
                                        data-target="#newDeleteModal"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  )}
                              </div>
                            </div>
                          </React.Fragment>
                        )}
                      {this.state.formUpdated && (
                        <button
                          type="button"
                          className="btn save-button cancel-button p-0 mr-3 discard-btn"
                          data-toggle="modal"
                          data-target="#newCancelModal"
                        >
                          Discard changes
                        </button>
                      )}
                      {((this.state.formUpdated &&
                        this.state.enableSaveAction) ||
                        (this.state.activityData &&
                          this.state.activityData.status &&
                          this.state.activityData.status ===
                            APP.NODE_STATUS.DRAFT)) && (
                        <button
                          type="button"
                          className={`btn save-button mt-sm-2 mt-md-2 mt-0 mr-3
                            ${
                              this.state.formUpdated &&
                              (!this.props.review ||
                                this.props.review === "false")
                                ? "review-secondary-button-1"
                                : "custom-primary-button"
                            } `}
                          onClick={() => {
                            this.setState(
                              {
                                saveAsDraft: false,
                              },
                              () => {
                                this.saveActivity();
                              }
                            );
                          }}
                          disabled={!this.state.enableSaveAction}
                        >
                          {this.props.review || this.props.review === "true"
                            ? "Save"
                            : "Send for review"}
                        </button>
                      )}
                      {this.state.formUpdated &&
                        (!this.props.review ||
                          this.props.review === "false") && (
                          <button
                            type="button"
                            className="btn save-button custom-primary-button mt-0 mt-sm-2 mt-md-2 mt-lg-0"
                            onClick={() => {
                              this.setState(
                                {
                                  saveAsDraft: true,
                                },
                                () => {
                                  this.saveActivity();
                                }
                              );
                            }}
                          >
                            Save as draft
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </div>
              {this.state.activityData &&
                this.state.activityData.status &&
                ((this.state.activityData.status &&
                  this.state.activityData.status === APP.NODE_STATUS.REJECTED &&
                  this.state.activityData.reviewComments) ||
                  (this.state.activityData.secondaryStatus &&
                    this.state.activityData.secondaryStatus ===
                      APP.NODE_STATUS.REJECTED &&
                    this.state.activityData.secondaryReviewComments)) && (
                  <div className="row mb-3">
                    <div className="col-8">
                      <div className="review-comment-box-1">
                        <label>Reviewer’s comment</label>
                        <p>
                          {this.state.activityData.secondaryReviewComments
                            ? this.state.activityData.secondaryReviewComments
                            : this.state.activityData.reviewComments}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              <form onSubmit={this.saveActivity}>
                <div className="row">
                  <label className="col-xl-4 col-12">Activity ID</label>
                  <div className="col-xl-8 col-12 mb-4">
                    <input
                      type="text"
                      id="expertID"
                      className="form-control"
                      placeholder="AID"
                      aria-label="id"
                      aria-describedby="basicId"
                      value={this.state.activityData.id || ""}
                      disabled
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-xl-4 col-12">
                    <label>Activity Description*</label>
                    <span
                      className="material-icons info-icon pl-2 align-middle pointer-style"
                      data-toggle="tooltip"
                      data-trigger="hover click"
                      title="The activity description should begin with the objective (i.e. the milestone that is planned to be achieved), list the steps (if more than 1) to be carried out in a sequence, and answer the ‘what’, ‘when’ and ‘how’. Recommend to use verbs."
                    >
                      info
                    </span>
                  </div>
                  <div className="col-xl-8 col-12 mb-4">
                    <textarea
                      className="form-control"
                      id={
                        APP.COLLECTIONS.ACTIVITY +
                        APP.FIELD_NAME.DESCRITPION +
                        "value"
                      }
                      spellCheck="true"
                      rows={
                        this.state.activityData.description &&
                        this.state.activityData.description.length > 200
                          ? this.state.activityData.description.length > 800
                            ? 15
                            : this.state.activityData.description.length / 55
                          : 4
                      }
                      placeholder="Activity Description..."
                      name="activityDescription"
                      value={this.state.activityData.description}
                      onChange={this.onActivityChange}
                      autoComplete="off"
                      onKeyUp={(event) => {
                        if (!this.state.keyCodes.includes(event.keyCode)) {
                          // if (event.keyCode === 32) {
                          this.getSimilarActivities(event);
                          // }
                        }
                        this.getLetterCount(event);
                      }}
                      required
                    ></textarea>
                    <p
                      className={`mb-4 ${
                        this.state.letterCount < 0
                          ? "change-text-color"
                          : "change-text-color-1"
                      }`}
                    >
                      Characters remaining: {this.state.letterCount}
                    </p>
                  </div>
                </div>

                {/* Cancel Modal */}
                <div
                  className="modal fade fadeInUp"
                  id="newCancelModal"
                  tabIndex="-1"
                  role="dialog"
                  aria-labelledby="newCancelModalTitle"
                  aria-hidden="true"
                >
                  <div
                    className="modal-dialog modal-dialog-centered"
                    role="document"
                  >
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="newCancelLongTitle">
                          Do you want to discard the changes?
                        </h5>
                      </div>
                      <div className="modal-body remove-scroll-x">
                        <p>All the unsaved changes will be discarded.</p>
                      </div>
                      <div className="modal-footer">
                        <div className="row">
                          <button
                            type="button"
                            className="btn save-button mr-2 danger-button-1"
                            data-dismiss="modal"
                            onClick={() => {
                              this.setState(
                                {
                                  activityData: {
                                    ...this.state.activityData,
                                    name: "",
                                    description: "",
                                  },
                                  enableSave: false,
                                  letterCount: 100,
                                  saveAsDraft: false,
                                  activityResponse: {},
                                  enableSaveAction: false,
                                  formUpdated: false,
                                },
                                () => {
                                  if (this.state.id !== 0) {
                                    this.getActivityDetails(
                                      this.state.id,
                                      "ACTIVITY"
                                    );
                                  }
                                }
                              );
                            }}
                          >
                            Yes, discard
                          </button>

                          <button
                            type="button"
                            className="btn save-button mr-2 custom-primary-button-3"
                            data-dismiss="modal"
                          >
                            No
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {this.props.history.location.state.id !== 0 && (
                  <React.Fragment>
                    <div id="officerColumn4" className="mt-3 ml-3">
                      <ul
                        className="nav nav-pills mb-3 mt-1 custom-officer-margin"
                        id="pills-tab"
                        role="tablist"
                      >
                        <li className="nav-item">
                          <a
                            className="nav-link active text-center custom-officer-margin"
                            id="pills-home-tab"
                            data-toggle="pill"
                            href="#pills-kr"
                            role="tab"
                            aria-controls="pills-home"
                            aria-selected="true"
                            onClick={() =>
                              this.setState({
                                // getCompetency: false
                                getRole: false,
                                getSelectedCompetencyID: "",
                                getSelectedRoleID: "",
                              })
                            }
                          >
                            Knowledge Resources
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link text-center custom-officer-margin"
                            id="pills-home-tab"
                            data-toggle="pill"
                            href="#pills-roles"
                            role="tab"
                            aria-controls="pills-home"
                            aria-selected="true"
                            onClick={() =>
                              this.setState({
                                // getCompetency: false,
                                getKR: false,
                                getSelectedCompetencyID: "",
                                getSelectedKRID: "",
                              })
                            }
                          >
                            Associated Roles
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="tab-content m-2" id="pills-tabContent">
                      <div
                        className="tab-pane fade"
                        id="pills-roles"
                        role="tabpanel"
                        aria-labelledby="pills-profile-tab"
                      >
                        {/*Search mapped roles*/}
                        {this.state.mappedRole &&
                        this.state.mappedRole.length > 0 ? (
                          <div className="row col-12">
                            <div
                              className="col-3 mb-4 p-0"
                              id="officerBucketsList"
                            >
                              <input
                                type="text"
                                style={{
                                  width: "110%",
                                  paddingLeft: "1.75rem",
                                }}
                                className="form-control mb-4 custom-search-5 custom-search-bar-2 form-control-4"
                                placeholder="Search..."
                                name="search"
                                autoComplete="off"
                                id="mappedRoleSearch"
                                onKeyUp={this.searchMappedRole}
                              />
                            </div>
                            <div className="col-2">
                              {this.state.clearSearchMappedRoleACT && (
                                <span
                                  className="material-icons competency-area-close-button-3"
                                  onClick={() => {
                                    this.setState(
                                      {
                                        clearSearchInputMappedRoleACT: true,
                                      },
                                      () => {
                                        document.getElementById(
                                          "mappedRoleSearch"
                                        ).value = "";
                                        this.searchMappedRole();
                                      }
                                    );
                                  }}
                                >
                                  close
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div id="emptyState">
                            <p> No associated roles</p>
                          </div>
                        )}

                        <div id="mappedRoleList">
                          <div className="row col-12">
                            {this.state.mappedRole &&
                              this.state.mappedRole.map((value, index) => {
                                return (
                                  <div
                                    className={`col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 card mr-3 mb-3 cca-card pointer-style role-border-1 custom-fixed-width-2 ${
                                      this.state.getSelectedRoleID === value.id
                                        ? "on-select-card-2"
                                        : ""
                                    }`}
                                    key={value.id}
                                    onClick={() => this.selectedRole(value.id)}
                                  >
                                    <div className="ml-0 pl-2">
                                      <p className="custom-heading-1 card-spacing-1">
                                        {value.name}
                                      </p>
                                      <p className="custom-sub-heading-1 custom-line-height-1">
                                        {value.id}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>

                      <div
                        className="tab-pane fade show active"
                        id="pills-kr"
                        role="tabpanel"
                        aria-labelledby="pills-profile-tab"
                      >
                        <button
                          type="button"
                          id={APP.COLLECTIONS.ACTIVITY + MAP_KR + "value"}
                          className="btn new-secondary-btn mt-2 mb-4"
                          data-toggle="modal"
                          data-target="#newKRModal"
                          onClick={() => {
                            this.getKRList();
                            this.setState({
                              getRole: false,
                              getKR: false,
                            });
                          }}
                        >
                          Add Knowledge Resources
                        </button>

                        <div
                          className="modal fade fadeInUp"
                          id="newKRModal"
                          tabIndex="-1"
                          role="dialog"
                          aria-labelledby="newKRModalTitle"
                          aria-hidden="true"
                        >
                          <div
                            className="modal-dialog modal-dialog-centered modal-lg"
                            role="document"
                          >
                            <div className="modal-content">
                              <div className="row ml-0 w-100">
                                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 pt-2">
                                  <div className="modal-header">
                                    <h5
                                      className="modal-title"
                                      id="newKRLongTitle"
                                    >
                                      Map an existing Knowledge Resources
                                    </h5>
                                  </div>

                                  {/*Search list of kr*/}
                                  <div className="row col-12">
                                    <div
                                      className="col-10 mb-1"
                                      id="officerBucketsList"
                                    >
                                      <input
                                        type="text"
                                        style={{ width: "110%" }}
                                        className="form-control mb-4 custom-search-5 custom-search-bar-3 form-control-2"
                                        placeholder="Search..."
                                        name="searchKR"
                                        id="krSearch"
                                        onChange={this.onActivityChange}
                                        value={this.state.krSearchkeyword}
                                        autoComplete="off"
                                      />
                                    </div>
                                    <div className="col-2">
                                      {this.state.clearSearchKrACT && (
                                        <span
                                          className="material-icons competency-area-close-button-3"
                                          onClick={() => {
                                            this.setState(
                                              {
                                                clearSearchInputKrACT: true,
                                              },
                                              () => {
                                                document.getElementById(
                                                  "krSearch"
                                                ).value = "";
                                                this.searchKr();
                                              }
                                            );
                                          }}
                                        >
                                          close
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="modal-body remove-scroll-x">
                                    <div id="krList">
                                      {this.state.searchKrList &&
                                        this.state.searchKrList.length > 0 && (
                                          <div
                                            style={{
                                              height: "25em",
                                              width: "100%",
                                            }}
                                          >
                                            <AutoSizer>
                                              {({ height, width }) => (
                                                <List
                                                  width={width}
                                                  height={height}
                                                  rowHeight={85}
                                                  rowRenderer={({
                                                    index,
                                                    key,
                                                    style,
                                                  }) => {
                                                    return (
                                                      <div
                                                        key={key}
                                                        style={style}
                                                      >
                                                        <dd key={key}>
                                                          <div className="flex">
                                                            {this.state.selectedKrList.includes(
                                                              this.state
                                                                .searchKrList[
                                                                index
                                                              ].id
                                                            ) && (
                                                              <input
                                                                checked
                                                                type="checkbox"
                                                                className="mt-4 mr-3 custom-search-checkbox"
                                                                onChange={() =>
                                                                  this.selectionToggleThree(
                                                                    this.state
                                                                      .searchKrList[
                                                                      index
                                                                    ].id
                                                                  )
                                                                }
                                                              />
                                                            )}

                                                            {!this.state.selectedKrList.includes(
                                                              this.state
                                                                .searchKrList[
                                                                index
                                                              ].id
                                                            ) && (
                                                              <input
                                                                type="checkbox"
                                                                className="mt-4 mr-3 custom-search-checkbox"
                                                                onChange={() =>
                                                                  this.selectionToggleThree(
                                                                    this.state
                                                                      .searchKrList[
                                                                      index
                                                                    ].id
                                                                  )
                                                                }
                                                              />
                                                            )}
                                                            <div
                                                              className={`col-xs-12 col-sm-12 col-md-8 col-lg-10 col-xl-10 card mb-3 cca-card pointer-style kr-border-1 ${
                                                                this.state.selectedKrList.includes(
                                                                  this.state
                                                                    .searchKrList[
                                                                    index
                                                                  ].id
                                                                )
                                                                  ? "on-select-card"
                                                                  : ""
                                                              }`}
                                                            >
                                                              <div
                                                                className="ml-0 pl-2"
                                                                onClick={() =>
                                                                  this.selectionToggleThree(
                                                                    this.state
                                                                      .searchKrList[
                                                                      index
                                                                    ].id
                                                                  )
                                                                }
                                                              >
                                                                <p className="custom-heading-1 card-spacing-1">
                                                                  {
                                                                    this.state
                                                                      .searchKrList[
                                                                      index
                                                                    ].name
                                                                  }
                                                                </p>
                                                                <p className="custom-sub-heading-1 custom-line-height-1">
                                                                  {
                                                                    this.state
                                                                      .searchKrList[
                                                                      index
                                                                    ].id
                                                                  }
                                                                </p>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </dd>
                                                      </div>
                                                    );
                                                  }}
                                                  rowCount={
                                                    this.state.searchKrList
                                                      .length
                                                  }
                                                />
                                              )}
                                            </AutoSizer>
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 custom-content-background pt-2">
                                  <div className="modal-header">
                                    <h5
                                      className="modal-title"
                                      id="newRoleModalLongTitle"
                                    >
                                      Mapped
                                    </h5>
                                  </div>

                                  {/*Search for already added kr*/}
                                  <div className="row col-12">
                                    <div
                                      className="col-10 mb-1"
                                      id="officerBucketsList"
                                    >
                                      <input
                                        type="text"
                                        style={{ width: "110%" }}
                                        className="form-control mb-4 custom-search-5 custom-search-bar-2 form-control-2"
                                        placeholder="Search..."
                                        name="search"
                                        value={this.keyword}
                                        id="krSearchTwo"
                                        onKeyUp={this.searchKrTwo}
                                        autoComplete="off"
                                      />
                                    </div>
                                    <div className="col-2">
                                      {this.state.clearSearchKrACTTwo && (
                                        <span
                                          className="material-icons competency-area-close-button-3"
                                          onClick={() => {
                                            this.setState(
                                              {
                                                clearSearchInputKrACTTwo: true,
                                              },
                                              () => {
                                                document.getElementById(
                                                  "krSearchTwo"
                                                ).value = "";
                                                this.searchKrTwo();
                                              }
                                            );
                                          }}
                                        >
                                          close
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="modal-body remove-scroll-x">
                                    <div id="krListTwo">
                                      {this.state.mappedKr &&
                                        this.state.mappedKr.map((i, j) => {
                                          return (
                                            <dd key={i.id}>
                                              <div className="flex">
                                                <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10 card mb-3 cca-card kr-border-1">
                                                  <div className="ml-0 pl-2">
                                                    <p className="custom-heading-1 card-spacing-1">
                                                      {i.name}
                                                    </p>
                                                    <p className="custom-sub-heading-1 custom-line-height-1">
                                                      {i.id}
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            </dd>
                                          );
                                        })}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="modal-footer">
                                <div className="row">
                                  <button
                                    type="button"
                                    className="btn save-button mr-2 custom-primary-button-3"
                                    data-dismiss="modal"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    data-dismiss="modal"
                                    className="btn save-button mr-2 new-icon-button custom-primary-button-3"
                                    onClick={() =>
                                      this.props.history.push({
                                        pathname:
                                          "/collection-knowledge-resources/0",
                                        state: {
                                          isNewKR: true,
                                          id: 0,
                                          type: "KNOWLEDGERESOURCE",
                                        },
                                      })
                                    }
                                  >
                                    Create a new K/R
                                  </button>
                                  <button
                                    type="button"
                                    className="btn save-button mr-2 custom-primary-button"
                                    data-dismiss="modal"
                                    onClick={this.mapKRToActivity}
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/*Search for mapped kr*/}
                        {this.state.mappedKr && this.state.mappedKr.length > 0 && (
                          <div className="row col-12">
                            <div
                              className="col-3 mb-4 p-0"
                              id="officerBucketsList"
                            >
                              <input
                                type="text"
                                style={{
                                  width: "110%",
                                  paddingLeft: "1.75rem",
                                }}
                                className="form-control mb-4 custom-search-5 custom-search-bar-2 form-control-4"
                                placeholder="Search..."
                                name="search"
                                autoComplete="off"
                                id="mappedKRSearch"
                                onKeyUp={this.searchMappedKR}
                              />
                            </div>
                            <div className="col-2">
                              {this.state.clearSearchMappedKrACT && (
                                <span
                                  className="material-icons competency-area-close-button-3"
                                  onClick={() => {
                                    this.setState(
                                      {
                                        clearSearchInputMappedKrACT: true,
                                      },
                                      () => {
                                        document.getElementById(
                                          "mappedKRSearch"
                                        ).value = "";
                                        this.searchMappedKR();
                                      }
                                    );
                                  }}
                                >
                                  close
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <div id="mappedKRList">
                          <div className="row col-12">
                            {this.state.mappedKr &&
                              this.state.mappedKr.map((value, index) => {
                                return (
                                  <div
                                    className={`col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 card mr-3 mb-3 cca-card pointer-style kr-border-1 custom-fixed-width-2 ${
                                      this.state.getSelectedKRID === value.id
                                        ? "on-select-card-2"
                                        : ""
                                    }`}
                                    key={value.id}
                                    onClick={() => this.selectedKR(value.id)}
                                  >
                                    <div className="ml-0 pl-2">
                                      <p className="custom-heading-1 card-spacing-1">
                                        {value.name}
                                      </p>
                                      <p className="custom-sub-heading-1 custom-line-height-1">
                                        {value.id}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                )}
              </form>
              {/* Delete node modal form */}
              <div
                className="modal fade fadeInUp"
                id="newDeleteModal"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="newDeleteModalTitle"
                aria-hidden="true"
              >
                <div
                  className="modal-dialog modal-dialog-centered"
                  role="document"
                >
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="newDeleteLongTitle">
                        Do you want to delete this Activity?
                      </h5>
                    </div>
                    <div className="modal-body remove-scroll-x">
                      <p>
                        The selected Activity details and all the mapping
                        related to this Activity will be deleted.
                      </p>
                    </div>
                    <div className="modal-footer">
                      <div className="row">
                        <button
                          type="button"
                          className="btn save-button mr-2 danger-button-1"
                          data-dismiss="modal"
                          onClick={() =>
                            this.deleteItem(
                              this.state.activityData.id,
                              "ACTIVITY"
                            )
                          }
                        >
                          Yes, delete
                        </button>

                        <button
                          type="button"
                          className="btn save-button mr-2 custom-primary-button-3"
                          data-dismiss="modal"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.getRole && (
          <ColumnFive
            {...this.props}
            roleId={this.state.getSelectedRoleID}
            type="ROLE"
            childType={["ACTIVITY", "COMPETENCY"]}
            parentType={["POSITION"]}
            btnText="Jump to Role"
            url="/collection-roles/"
            stateDataKey="isNewRole"
            searchBarStyle="custom-search-bar-3"
            customHeight="custom-full-height-4"
          />
        )}
        {this.state.getKR && (
          <ColumnFive
            {...this.props}
            roleId={this.state.getSelectedKRID}
            type="KNOWLEDGERESOURCE"
            parentType={["ACTIVITY"]}
            selectionFunction={this.unmapKR}
            unMapFunction={this.mapKRToActivity}
            btnText="Jump to KR"
            url="/collection-knowledge-resources/"
            stateDataKey="isNewKR"
            searchBarStyle="custom-search-bar-3"
            customHeight="custom-full-height-4"
          />
        )}
        {this.state.showActivityLog && (
          <ColumnSix
            {...this.props}
            customHeight="custom-full-height-4"
            activityLogs={this.state.activityLogs}
            nodeData={this.state.activityData}
            activeTabId={this.state.columnSixTabRef}
            searchData={this.state.searchResultActivities}
            searchHeading="Similar Activities"
            searchClass="activity-border-1"
            searchClass2="role-border-1"
            type="ACTIVITY"
            btnText="Jump to Activity"
            url="/collection-activities/"
            stateDataKey="isNewActivity"
            actioBtnText="Copy info to new activity"
            titleSecondary="Associated Roles"
            functionName="getParentNode"
            receiveData={this.receiveData}
          />
        )}
      </div>
    );
  }
}

export default ColumnThree;
export { ColumnThree };
