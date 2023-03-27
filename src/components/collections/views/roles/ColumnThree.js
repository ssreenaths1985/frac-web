import React from "react";
import { MasterService } from "../../../../services/master.service";
import Notify from "../../../../helpers/notify";
import { APP } from "../../../../constants";
import ColumnFive from "../positions/ColumnFive";
import ColumnSix from "../positions/ColumnSix";
import RatingAndFeedback from "../common/RatingAndFeedback";
import CryptoJS from "crypto-js";
import { List } from "react-virtualized";
import AutoSizer from "react-virtualized-auto-sizer"

const MAP_ACTIVITY = "Map activity";
const MAP_COMPETENCY = "Map competency";

const formFields = [
  APP.FIELD_NAME.LABEL,
  APP.FIELD_NAME.DESCRITPION,
  MAP_ACTIVITY,
  MAP_COMPETENCY
];

class ColumnThree extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      rolesDetails: [],
      roleData: {
        name: "",
        description: "",
      },
      roleResponse: {},
      enableSaveAction: false,
      formUpdated: false,
      competencyList: [],
      selectedCompetencyList: [],
      mappedCompetency: [],
      positionList: [],
      selectedPositionList: [],
      mappedPosition: [],
      searchResultRoles: [],
      getCompetency: false,
      getSelectedCompetencyID: "",
      getPosition: false,
      getSelectedPositionID: "",
      letterCount: 200,
      keyCodes: [8, 46, 37, 39, 38, 40],
      getActivity: false,
      getSelectedActivityID: "",
      mappedActivity: [],
      selectedActivityList: [],
      activityList: [],
      rating: 0,
      comments: [],
      commentText: "",
      receivedRating: "",
      averageRating: "",
      changeRating: true,
      clearSearchCompetencyRole: false,
      clearSearchInputCompetencyRole: false,
      clearSearchCompetencyRoleTwo: false,
      clearSearchInputCompetencyRoleTwo: false,
      clearSearchMappedPositionRole: false,
      clearSearchInputMappedPositionRole: false,
      clearSearchMappedCompetencyRole: false,
      clearSearchInputMappedCompetencyRole: false,
      clearSearchMappedActivityRole: false,
      clearSearchInputMappedActivityRole: false,
      clearSearchActivityRole: false,
      clearSearchInputActivityRole: false,
      clearSearchActivityRoleTwo: false,
      clearSearchInputActivityRoleTwo: false,
      showActivityLog: true,
      activityLogs: [],
      saveAsDraft: false,
      roles: "",
      source: "",
      showFeedback: false,
      competencySearchkeyword: "",
      searchCompetencyList: [],
      activitySearchkeyword: "",
      searchActivityList: [],
      columnSixTabRef: "",
    };
    this.saveRole = this.saveRole.bind(this);
    this.onRoleChange = this.onRoleChange.bind(this);
    this.getRoleDetails = this.getRoleDetails.bind(this);
    this.getCompetencyList = this.getCompetencyList.bind(this);
    this.selectionToggle = this.selectionToggle.bind(this);
    this.mapCompetencyToRole = this.mapCompetencyToRole.bind(this);
    this.getCompetencyMapped = this.getCompetencyMapped.bind(this);
    this.searchCompetency = this.searchCompetency.bind(this);
    this.searchCompetencyTwo = this.searchCompetencyTwo.bind(this);
    this.searchMappedPosition = this.searchMappedPosition.bind(this);
    this.searchMappedCompetency = this.searchMappedCompetency.bind(this);
    this.getSimilarRoles = this.getSimilarRoles.bind(this);
    this.getPositionMapped = this.getPositionMapped.bind(this);
    this.selectedCompetency = this.selectedCompetency.bind(this);
    this.selectedPosition = this.selectedPosition.bind(this);
    this.receiveData = this.receiveData.bind(this);
    this.getLetterCount = this.getLetterCount.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.getActivityList = this.getActivityList.bind(this);
    this.selectionToggleActivity = this.selectionToggleActivity.bind(this);
    this.mapActivityToRole = this.mapActivityToRole.bind(this);
    this.getActivityMapped = this.getActivityMapped.bind(this);
    this.searchMappedActivity = this.searchMappedActivity.bind(this);
    this.searchActivity = this.searchActivity.bind(this);
    this.searchActivityTwo = this.searchActivityTwo.bind(this);
    this.selectedActivity = this.selectedActivity.bind(this);
    this.unmapActivity = this.unmapActivity.bind(this);
    this.unmapCompetency = this.unmapCompetency.bind(this);
    this.makeRoleRating = this.makeRoleRating.bind(this);
    this.resetRoleRating = this.resetRoleRating.bind(this);
    this.postRoleComment = this.postRoleComment.bind(this);
    this.onRoleCommentChange = this.onRoleCommentChange.bind(this);
    this.postRoleRating = this.postRoleRating.bind(this);
    this.getRoleAverageRating = this.getRoleAverageRating.bind(this);
    this.nameRoleAvatar = this.nameRoleAvatar.bind(this);
    this.resetRoleHandler = this.resetRoleHandler.bind(this);
    this.getRoleLogs = this.getRoleLogs.bind(this);
    this.checkAccess = this.checkAccess.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.checkAccess();
    if (this.props.history.location.state) {
      if (this.props.history.location.state.id !== "0") {
        this.setState(
          {
            id: this.props.history.location.state.id,
          },
          () => {
            if (this.state.id !== 0) {
              this.getRoleDetails(this.state.id, "ROLE");
              this.getCompetencyMapped(this.state.id, "COMPETENCY");
              this.getPositionMapped(this.state.id, "POSITION");
              // To get mapped activities for the role based on ID
              this.getActivityMapped(this.state.id, "ACTIVITY");
              this.getRoleLogs(this.state.id, "ROLE");
            } else {
              this.updateFormFieldAccess();
            }
          }
        );
      }
    }
    document
      .getElementById("masterColumn3")
      .addEventListener("mousedown", (event) => {
        let checkIds = [
          "mappedActivityList",
          "mappedCompetencyList",
          "mappedPositionList",
        ];
        if (
          event.path &&
          event.path.length > 3 &&
          !event.path[4].id.includes(checkIds)
        ) {
          this.resetRoleHandler();
        }
      });
  }

  resetRoleHandler = () => {
    this.setState({
      getPosition: false,
      getActivity: false,
      getCompetency: false,
      showActivityLog: true,
      getSelectedActivityID: "",
      getSelectedCompetencyID: "",
      getSelectedPositionID: "",
    });
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  checkAccess = () => {
    setTimeout(() => {
      if (localStorage.getItem("stateFromNav")) {
        let bytes = CryptoJS.AES.decrypt(
          localStorage.getItem("stateFromNav"),
          "igotcheckIndia*"
        );
        let originalText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        this.setState({
          roles: originalText,
        }, () => {
          if (this.state.id !== 0) {
            this.getRoleDetails(this.state.id, "ROLE");
          }
        });
      }
    }, 300);
  };

  receiveData = (name, description) => {
    if (name && description) {
      this.setState(
        {
          roleData: {
            ...this.state.roleData,
            name: name,
            description: description,
          },
        },
        () => {
          this.setState({
            letterCount: 200 - this.state.roleData.description.length,
          });
        }
      );
    }
  };

  searchCompetency = () => {
    let input, filter, ul, li, a, i, txtValue;
    if (!this.state.clearSearchInputCompetencyRole) {
      this.setState({
        clearSearchCompetencyRole: true,
      });
    } else {
      this.setState({
        clearSearchCompetencyRole: false,
        clearSearchInputCompetencyRole: false,
      });
    }

    input = document.getElementById("competencySearch");

    if (input.value.length === 0) {
      this.setState({
        clearSearchCompetencyRole: false,
        clearSearchInputCompetencyRole: false,
      });
    }

    if (!this.state.clearSearchInputCompetencyRole) {
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

  searchCompetencyTwo = () => {
    let input, filter, ul, li, a, i, txtValue;
    if (!this.state.clearSearchInputCompetencyRoleTwo) {
      this.setState({
        clearSearchCompetencyRoleTwo: true,
      });
    } else {
      this.setState({
        clearSearchCompetencyRoleTwo: false,
        clearSearchInputCompetencyRoleTwo: false,
      });
    }

    input = document.getElementById("competencySearchTwo");

    if (input.value.length === 0) {
      this.setState({
        clearSearchCompetencyRoleTwo: false,
        clearSearchInputCompetencyRoleTwo: false,
      });
    }

    if (!this.state.clearSearchInputCompetencyRoleTwo) {
      filter = input.value.toUpperCase();
    } else {
      filter = "";
    }

    ul = document.getElementById("competencyListTwo");
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
    if (!this.state.clearSearchInputMappedCompetencyRole) {
      this.setState({
        clearSearchMappedCompetencyRole: true,
      });
    } else {
      this.setState({
        clearSearchMappedCompetencyRole: false,
        clearSearchInputMappedCompetencyRole: false,
      });
    }

    input = document.getElementById("mappedCompetencySearch");

    if (input.value.length === 0) {
      this.setState({
        clearSearchMappedCompetencyRole: false,
        clearSearchInputMappedCompetencyRole: false,
      });
    }

    if (!this.state.clearSearchInputMappedCompetencyRole) {
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

  searchMappedPosition = () => {
    // Declare variables
    let input, filter, ul, li, a, i, txtValue;
    if (!this.state.clearSearchInputMappedPositionRole) {
      this.setState({
        clearSearchMappedPositionRole: true,
      });
    } else {
      this.setState({
        clearSearchMappedPositionRole: false,
        clearSearchInputMappedPositionRole: false,
      });
    }

    input = document.getElementById("mappedPositionSearch");

    if (input.value.length === 0) {
      this.setState({
        clearSearchMappedPositionRole: false,
        clearSearchInputMappedPositionRole: false,
      });
    }

    if (!this.state.clearSearchInputMappedPositionRole) {
      filter = input.value.toUpperCase();
    } else {
      filter = "";
    }

    ul = document.getElementById("mappedPositionList");
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

  searchMappedActivity = () => {
    // To search for a role from the mapped role list for a position
    // Declare variables
    let input, filter, ul, li, a, i, txtValue;
    if (!this.state.clearSearchInputMappedActivityRole) {
      this.setState({
        clearSearchMappedActivityRole: true,
      });
    } else {
      this.setState({
        clearSearchMappedActivityRole: false,
        clearSearchInputMappedActivityRole: false,
      });
    }

    input = document.getElementById("activityMappedSearch");

    if (input.value.length === 0) {
      this.setState({
        clearSearchMappedActivityRole: false,
        clearSearchInputMappedActivityRole: false,
      });
    }

    if (!this.state.clearSearchInputMappedActivityRole) {
      filter = input.value.toUpperCase();
    } else {
      filter = "";
    }

    ul = document.getElementById("mappedActivityList");
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

  searchActivity = () => {
    // To search for a role from role list in the modal
    // Declare variables
    let input, filter, ul, li, a, i, txtValue;
    if (!this.state.clearSearchInputActivityRole) {
      this.setState({
        clearSearchActivityRole: true,
      });
    } else {
      this.setState({
        clearSearchActivityRole: false,
        clearSearchInputActivityRole: false,
      });
    }

    input = document.getElementById("activitySearch");

    if (input.value.length === 0) {
      this.setState({
        clearSearchActivityRole: false,
        clearSearchInputActivityRole: false,
      });
    }

    if (!this.state.clearSearchInputActivityRole) {
      filter = input.value.toUpperCase();
    } else {
      filter = "";
    }

    ul = document.getElementById("activityListSearch");
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

  searchActivityTwo = () => {
    // To search for a role from role list in the modal
    // Declare variables
    let input, filter, ul, li, a, i, txtValue;
    if (!this.state.clearSearchInputActivityRoleTwo) {
      this.setState({
        clearSearchActivityRoleTwo: true,
      });
    } else {
      this.setState({
        clearSearchActivityRoleTwo: false,
        clearSearchInputActivityRoleTwo: false,
      });
    }

    input = document.getElementById("activitySearchTwo");

    if (input.value.length === 0) {
      this.setState({
        clearSearchActivityRoleTwo: false,
        clearSearchInputActivityRoleTwo: false,
      });
    }

    if (!this.state.clearSearchInputActivityRoleTwo) {
      filter = input.value.toUpperCase();
    } else {
      filter = "";
    }

    ul = document.getElementById("activityListTwo");
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

  getSimilarRoles = (event) => {
    // To get similar roles while typing in the field
    if (event && !event.custom) {
      event.preventDefault();
    }

    // For Name
    if (
      event.target.name === "roleLabel" &&
      this.state.roleData.name.length > 0
    ) {
      if (!event.custom) {
        this.setState({
          columnSixTabRef: APP.PARAMETERS.SIMILAR_ITEM_TAB_REF
        });
      }
      let searchPayloadNameROLE = {
        searches: [
          {
            type: "ROLE",
            field: "name",
            keyword: this.state.roleData.name,
          },
        ],
      };
      MasterService.searchNodes(searchPayloadNameROLE).then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState(
            {
              searchResultRoles: [],
            },
            () => {
              const resultSet = [];
              response.data.responseData.forEach(searchObj => {
                if (searchObj.id !== this.state.roleData.id) {
                  resultSet.push(searchObj);
                }
              });
              this.setState({
                searchResultRoles: [
                  ...this.state.searchResultRoles,
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
        searchResultRoles: [],
      });
    }

    // For Description
    if (
      event.target.name === "roleDescription" &&
      this.state.roleData.description.length > 0
    ) {
      let searchPayloadDescriptionROLE = {
        searches: [
          {
            type: "ROLE",
            field: "description",
            keyword: this.state.roleData.description,
          },
        ],
      };
      MasterService.searchNodes(searchPayloadDescriptionROLE).then(
        (response) => {
          if (
            response &&
            response.data.statusInfo.statusCode === APP.CODE.SUCCESS
          ) {
            this.setState(
              {
                searchResultRoles: [],
              },
              () => {
                this.setState({
                  searchResultRoles: [
                    ...this.state.searchResultRoles,
                    response.data.responseData,
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
        searchResultRoles: [],
      });
    }
  };

  selectedCompetency = (id) => {
    this.setState({
      getCompetency: true,
      showActivityLog: false,
      getSelectedCompetencyID: id,
    });
  };

  selectedPosition = (id) => {
    this.setState({
      getActivity: false,
      getCompetency: false,
      getPosition: true,
      showActivityLog: false,
      getSelectedPositionID: id,
    });
  };

  saveRole = (e) => {
    if (e) {
      e.preventDefault();
    }
    let rolePayload;

    if (this.state.id === 0) {
      rolePayload = {
        type: "ROLE",
        source: "FRAC",
        name: this.state.roleData.name,
        description: this.state.roleData.description,
      };
    } else {
      rolePayload = {
        type: "ROLE",
        source: this.state.source.length !== 0 ? this.state.source : "FRAC",
        id: this.state.id,
        name: this.state.roleData.name,
        description: this.state.roleData.description,
      };
    }

    if (this.state.saveAsDraft) {
      rolePayload.status = "DRAFT";
    }

    if (
      (rolePayload.name !== 0 &&
        rolePayload.name.length > 0 &&
        rolePayload.description !== 0 &&
        rolePayload.description.length > 0) ||
      this.state.saveAsDraft
    ) {
      MasterService.addDataNode(rolePayload).then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          if (this.state.id === 0) {
            Notify.dark("Role created successfully");
          } else {
            Notify.dark("Role updated successfully");
          }
          this.setState(
            {
              enableSaveAction: false,
              showActivityLog: true,
              getCompetency: false,
              getPosition: false,
              getActivity: false,
              saveAsDraft: false,
            },
            () => {
              this.formValidation();
              setTimeout(() => {
                if (this.state.id !== 0) {
                  this.getRoleLogs(this.state.id, "ROLE");
                }
              }, 800);
            }
          );
          const pathName =
            this.props.review && this.props.review === "true"
              ? APP.ROUTES_PATH.REVIEW_ROLES
              : APP.COLLECTIONS_PATH.ROLE;
          this.props.history.push({
            pathname: pathName + response.data.responseData.id,
            state: {
              isNewRole: false,
              id: response.data.responseData.id,
              type: "ROLE",
              stayOn: true,
              showColumnThree: true,
            },
          });
          if (this.state.id !== 0) {
            setTimeout(() => {
              this.getRoleDetails(response.data.responseData.id, "ROLE");
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

  getRoleDetails = (id, type) => {
    if (id !== 0) {
      setTimeout(() => {
        MasterService.getDataByNodeId(id, type).then((response) => {
          if (
            response &&
            response.data.statusInfo.statusCode === APP.CODE.SUCCESS
          ) {
            this.setState(
              {
                roleData: response.data.responseData,
                roleResponse: response.data.responseData,
                source: response.data.responseData.source,
              },
              () => {
                if (this.props.review || this.props.review === "true") {
                  const event = { target: { name: "roleLabel" }, custom: true }
                  this.getSimilarRoles(event);
                }
                this.formValidation();
                this.updateFormFieldAccess();
                if (this.state.roleData.description) {
                  this.setState({
                    letterCount:
                      this.state.letterCount -
                      this.state.roleData.description.length,
                  });
                }
              }
            );

            if (response.data.responseData.status === "DRAFT") {
              this.setState({
                saveAsDraft: true,
              });
            } else {
              this.setState({
                saveAsDraft: false,
              });
            }
          } else {
            Notify.error(response && response.data.statusInfo.errorMessage);
          }
        });
      }, 800);
    } else {
      this.setState({
        roleData: {
          id: "",
          name: "",
          description: "",
        },
      });
    }
  };

  updateFormFieldAccess() {
    let disable = false;
    if (this.state.id && this.state.roleData.secondaryStatus
      && this.state.roleData.secondaryStatus === APP.NODE_STATUS.VERIFIED
      && !this.state.roles.includes("FRAC_ADMIN") && !this.state.roles.includes("FRAC_REVIEWER_L2")) {
      disable = true;
    }

    formFields.forEach(field => {
      const elementId = APP.COLLECTIONS.ROLE + field + "value";
      const element = document.getElementById(elementId);
      if (element) {
        element.disabled = disable;
      }
    });
  }

  onRoleChange = (e) => {
    e.preventDefault();
    let onlyAlphabet = /^[/+#\-_()., A-Za-z ]*$/;

    switch (e.target.name) {
      case "roleLabel":
        if (!onlyAlphabet.test(e.target.value)) {
          return false;
        }
        this.setState(
          {
            roleData: {
              ...this.state.roleData,
              name: e.target.value,
            },
          }, () => {
            this.formValidation();
          });
        break;
      case "roleDescription":
        this.setState(
          {
            roleData: {
              ...this.state.roleData,
              description: e.target.value,
            },
          }, () => {
            this.formValidation();
          });
        break;
      case "searchCompetencyKeyword":
        this.setState({
          competencySearchkeyword: e.target.value
        }, () => {
          this.getCompetencySearch();
        })
        break;
      case "searchActivityKeyword":
        this.setState({
          activitySearchkeyword: e.target.value
        }, () => {
          this.getActivitySearch();
        })
        break;
      default:
        break;
    }
  };

  getCompetencySearch() {
    this.setState({
      searchCompetencyList: this.state.competencyList.filter((obj) => (obj.name
        && obj.name.toLowerCase().includes(this.state.competencySearchkeyword.toLowerCase())) ||
        (obj.id
          && obj.id.toLowerCase().includes(this.state.competencySearchkeyword.toLowerCase())))
    })
  }

  getActivitySearch() {
    this.setState({
      searchActivityList: this.state.activityList.filter((obj) => (obj.name
        && obj.name.toLowerCase().includes(this.state.activitySearchkeyword.toLowerCase())) ||
        (obj.id
          && obj.id.toLowerCase().includes(this.state.activitySearchkeyword.toLowerCase())))
    })
  }

  getCompetencyList = () => {
    MasterService.getNodesByType("COMPETENCY").then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        this.setState({
          competencyList: response.data.responseData,
          searchCompetencyList: response.data.responseData
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

  selectionToggle = (id) => {
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

  mapCompetencyToRole = () => {
    let mapPayload = {
      parent: "ROLE",
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
          this.getCompetencyMapped(this.state.id, "COMPETENCY");
          if (this.state.id !== 0) {
            this.getRoleLogs(this.state.id, "ROLE");
          }
        }, 800);
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  getCompetencyMapped = (id, type) => {
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

  getPositionMapped = (id, type) => {
    MasterService.getParentNode(id, type).then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        this.setState({
          mappedPosition: response.data.responseData,
        });
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  // Text character counter
  getLetterCount = (event) => {
    if (event.target.name === "roleDescription") {
      this.setState({
        letterCount: 200 - this.state.roleData.description.length,
      });
    }
  };

  // Method to delete an Role
  deleteItem = (id, type) => {
    MasterService.deleteNode(id, type).then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        Notify.dark("Role deleted successfully");
        this.setState({
          enableSaveAction: false,
          showActivityLog: true,
          getPosition: false,
          getCompetency: false,
          getActivity: false,
        });
        const pathName =
          this.props.review && this.props.review === "true"
            ? APP.ROUTES_PATH.REVIEW_ROLES
            : APP.COLLECTIONS_PATH.ROLE;
        this.props.history.push({
          pathname: pathName,
          state: {
            isNewRole: false,
            type: "ROLE",
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

  getActivityList = () => {
    // Get all activity list
    MasterService.getNodesByType("ACTIVITY").then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        this.setState({
          activityList: response.data.responseData,
          searchActivityList: response.data.responseData
        });
        if (this.state.mappedActivity) {
          this.state.mappedActivity.map((k, l) => {
            this.setState((prevState) => ({
              selectedActivityList: [k.id, ...prevState.selectedActivityList],
            }));
            return null;
          });
        }
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  selectionToggleActivity = (id) => {
    // Enable multiple selection from the list in the modal
    if (this.state.mappedActivity) {
      this.state.mappedActivity.map((k, l) => {
        this.setState((prevState) => ({
          selectedActivityList: [k.id, ...prevState.selectedActivityList],
        }));
        return null;
      });
    }

    this.setState(
      {
        selectedActivityList: [...this.state.selectedActivityList, id],
      },
      () => {
        this.state.selectedActivityList.forEach((i, j) => {
          if (
            this.state.selectedActivityList.indexOf(i) !== j &&
            this.state.selectedActivityList.includes(id)
          ) {
            if (this.state.selectedActivityList.indexOf(id) > -1) {
              this.state.selectedActivityList.splice(
                this.state.selectedActivityList.indexOf(id),
                1
              );
              this.state.selectedActivityList.splice(
                this.state.selectedActivityList.indexOf(i),
                1
              );
            }
            this.setState({
              selectedActivityList: this.state.selectedActivityList,
            });
          }
        });
      }
    );
  };

  unmapActivity = (id) => {
    if (this.state.mappedActivity) {
      let tempArray = [];
      this.state.mappedActivity.map((i, j) => {
        if (i.id !== id) {
          tempArray.push(i);
        }
        return null;
      });
      this.setState({
        mappedActivity: tempArray,
      });
      tempArray.map((k, l) => {
        this.setState((prevState) => ({
          selectedActivityList: [k.id, ...prevState.selectedActivityList],
        }));
        return null;
      });
      this.setState({
        getActivity: false,
      });
    }
  };

  unmapCompetency = (id) => {
    if (this.state.mappedCompetency) {
      let tempArray = [];
      this.state.mappedCompetency.map((i, j) => {
        if (i.id !== id) {
          tempArray.push(i);
        }
        return null;
      });
      this.setState({
        mappedCompetency: tempArray,
      });
      tempArray.map((k, l) => {
        this.setState((prevState) => ({
          selectedCompetencyList: [k.id, ...prevState.selectedCompetencyList],
        }));
        return null;
      });
      this.setState({
        getCompetency: false,
      });
    }
  };

  mapActivityToRole = () => {
    // Map roles to the position
    let mapPayload = {
      parent: "ROLE",
      parentId: this.state.id,
      child: "ACTIVITY",
      childIds: this.state.selectedActivityList,
    };

    MasterService.mapNodes(mapPayload).then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        if (
          this.state.selectedActivityList.length <
          this.state.mappedActivity.length ||
          this.state.selectedActivityList.length ===
          this.state.mappedActivity.length
        ) {
          Notify.dark("Unmapped successfully");
        } else {
          Notify.dark("Mapped successfully");
        }
        this.setState({
          selectedActivityList: [],
          showActivityLog: true,
        });
        setTimeout(() => {
          this.getActivityMapped(this.state.id, "ACTIVITY");
          if (this.state.id !== 0) {
            this.getRoleLogs(this.state.id, "ROLE");
          }
        }, 800);
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  getActivityMapped = (id, type) => {
    // To get mapped activity for a position
    MasterService.getChildForParent(id, type).then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        this.setState({
          mappedActivity: response.data.responseData,
        });
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  selectedActivity = (id) => {
    this.setState({
      getCompetency: false,
      showActivityLog: false,
      getPosition: false,
      getActivity: true,
      getSelectedActivityID: id,
    });
  };

  makeRoleRating = (e) => {
    e.preventDefault();

    this.setState({
      rating: e.target.value,
    });
  };

  resetRoleRating = () => {
    this.setState({
      rating: 0,
    });
  };

  postRoleComment = (e) => {
    e.preventDefault();
    let payload = {
      type: "ROLE",
      id: this.state.id,
      comments: [this.state.commentText],
    };
    MasterService.postComment(payload).then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        this.setState({
          commentText: "",
          comments: [],
        });
        Notify.dark("Comment posted");
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  onRoleCommentChange = (e) => {
    e.preventDefault();
    this.setState({
      commentText: e.target.value,
    });
  };

  postRoleRating = (e) => {
    e.preventDefault();
    let payload = {
      type: "ROLE",
      id: this.state.id,
      rating: parseInt(this.state.rating),
    };
    MasterService.postRating(payload).then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        this.setState({
          rating: 0,
        });

        Notify.dark("Rating posted");
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  getRoleAverageRating = (type, id) => {
    MasterService.getAverageRating(type, id).then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        if (
          response.data.responseData &&
          response.data.responseData.rating >= 0
        ) {
          this.setState({
            averageRating: response.data.responseData.rating,
          });
        }
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  nameRoleAvatar = (value) => {
    let generatedString = value
      .split(/\s/)
      .reduce((res, letter) => (res += letter.slice(0, 1)), "");
    return generatedString;
  };

  getRoleLogs = (id, type) => {
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
        pathname: "/collection-roles/",
        state: {
          isNewRole: false,
          type: "ROLE",
        },
      });
    }
    if (this.props.match.params.id !== "0") {
      if (prevProps.location.state.id !== this.props.location.state.id) {
        this.setState(
          {
            id: this.props.location.state.id,
            showActivityLog: true,
            letterCount: 200,
            getPosition: false,
            getActivity: false,
            getSelectedCompetencyID: "",
            getSelectedPositionID: "",
            getSelectedActivityID: "",
            rating: 0,
            comments: [],
            commentText: "",
            receivedRating: "",
            averageRating: "",
            activityLogs: [],
            roleData: {
              id: "",
              name: "",
              description: "",
            },
            mappedCompetency: [],
            selectedCompetencyList: [],
            mappedPosition: [],
            selectedPositionList: [],
            mappedActivity: [],
            selectedActivityList: [],
            source: "",
            positionResponse: {},
            formUpdated: false,
            enableSaveAction: false,
            competencySearchkeyword: "",
            searchCompetencyList: [],
            activitySearchkeyword: "",
            searchActivityList: []
          },
          () => {
            if (this.state.id !== 0) {
              this.getRoleDetails(this.state.id, "ROLE");
              this.getCompetencyMapped(this.state.id, "COMPETENCY");
              this.getPositionMapped(this.state.id, "POSITION");
              this.getActivityMapped(this.state.id, "ACTIVITY");
              if (this.state.id !== 0) {
                this.getRoleLogs(this.state.id, "ROLE");
              }
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
          roleData: {
            id: "",
            name: "",
            description: "",
          },
          mappedCompetency: [],
          selectedCompetencyList: [],
          mappedPosition: [],
          selectedPositionList: [],
          mappedActivity: [],
          selectedActivityList: [],
          letterCount: 200,
          rating: 0,
          comments: [],
          commentText: "",
          receivedRating: "",
          averageRating: "",
          activityLogs: [],
          source: "",
          positionResponse: {},
          formUpdated: false,
          enableSaveAction: false,
          competencySearchkeyword: "",
          searchCompetencyList: [],
          activitySearchkeyword: "",
          searchActivityList: []
        });
      }
    }
    // Review
    if (
      this.props.review &&
      this.props.review === "true" &&
      this.props.selectedNodeStatus &&
      this.props.selectedNodeStatus !== this.state.roleData.status
    ) {
      this.setState({
        roleData: {
          ...this.state.roleData,
          status: this.props.selectedNodeStatus,
        },
      });
    }

    if (document.getElementById("more-menu")) {
      document.getElementById("more-menu")
        .addEventListener("mousedown", (event) => {
          setTimeout(() => {
            if (event.path && event.path.find((o) => o.id === "feedbackDropdownMenu")) {
              if (document.getElementById("feedbackDropdownMenu").getAttribute("aria-expanded") === "true") {
                this.setState({
                  showFeedback: true
                }, () => {
                  document.getElementById("feedbackDropdownMenu").click();
                  document.getElementById("feedback-dd-menu-1").classList.add("show");
                })
              }
            } else {
              this.setState({
                showFeedback: false
              })
            }
          }, 300);
        });
    }

    document.getElementById("masterColumn3")
      .addEventListener("mousedown", (event) => {
        if (this.state.columnSixTabRef !== "") {
          this.setState({
            columnSixTabRef: ""
          })
        }
        if (this.state.showFeedback) {
          setTimeout(() => {
            const feedbackModal = document.getElementById("feedback-dd-menu-1");
            if (feedbackModal && !feedbackModal.classList.contains("show")) {
              this.setState({
                showFeedback: false
              })
            }
          }, 300);
        }
      });
  }

  // Checks all the required fields of the form is filled, 
  // if yes then enables the save button else disable the button
  formValidation() {
    let formValid = false;
    const roleData = this.state.roleData;
    if (roleData.name && roleData.description) {
      formValid = true;
    }
    this.detectFormChanges();
    this.setState({
      enableSaveAction: formValid
    })
    return formValid;
  }

  detectFormChanges() {
    let changesDetected = false;
    const roleData = JSON.parse(JSON.stringify(this.state.roleData));
    if (JSON.stringify(this.state.roleResponse) !== JSON.stringify(roleData)) {
      changesDetected = true;
    }
    this.setState({
      formUpdated: changesDetected
    });
  }

  render() {
    return (
      <div className="row p-0 col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xsl-8 m-0">
        <div
          className={`bordered custom-full-height-4 custom-body-bg ${this.state.getCompetency ||
            this.state.getPosition ||
            this.state.getActivity ||
            this.state.showActivityLog
            ? "col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8"
            : "col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
            }`}
          id="masterColumn3"
        >
          <div>
            <div className="sticky-area-top custom-body-bg">
              <div className="row mb-3 p-2 mt-3">
                {/* Status tag */}
                <div className={` ${this.state.formUpdated
                  ? ((!this.props.review || this.props.review === "false")
                    ? "col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-3"
                    : "col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4")
                  : "col-xs-12 col-sm-12 col-md-12 col-lg-5 col-xl-5"
                  } `}>
                  {this.state.id !== 0 && (
                    <div className="float-left">
                      {(!this.props.review || this.props.review === "false") ?
                        // status tage
                        <div className="status-tag">
                          {this.state.roleData.status !== APP.NODE_STATUS.DRAFT && (
                            <React.Fragment>
                              {(!this.state.roleData.secondaryStatus ||
                                this.state.roleData.secondaryStatus === APP.NODE_STATUS.UNVERIFIED) && (
                                  <React.Fragment>
                                    {(this.state.roleData.status && this.state.roleData.status === APP.NODE_STATUS.REJECTED)
                                      ? (
                                        <p className="status-rejected status-text">
                                          Rejected
                                        </p>
                                      )
                                      : <React.Fragment>
                                        {(this.props.review && this.props.review === "true"
                                          && this.state.roles && this.state.roles.includes(APP.USER_ROLES.REVIEWER_ONE)
                                          && this.state.roleData.status === APP.NODE_STATUS.VERIFIED)
                                          ? (<p className="status-verified status-text">
                                            Verified
                                          </p>)
                                          : (<p className="status-unverified status-text">
                                            {(this.props.review && this.props.review === "true") ? "Unverified" : "Sent for review"}
                                          </p>)}
                                      </React.Fragment>}
                                  </React.Fragment>
                                )}
                              {(this.state.roleData.secondaryStatus &&
                                this.state.roleData.secondaryStatus === APP.NODE_STATUS.VERIFIED) && (
                                  <p className="status-verified status-text">
                                    Verified
                                  </p>
                                )}
                              {(this.state.roleData.secondaryStatus &&
                                this.state.roleData.secondaryStatus === APP.NODE_STATUS.REJECTED) && (
                                  <p className="status-rejected status-text">
                                    Rejected
                                  </p>
                                )}
                            </React.Fragment>
                          )}
                          {this.state.roleData.status === APP.NODE_STATUS.DRAFT && (
                            <p className="status-draft status-text">Draft</p>
                          )}
                        </div>
                        : // similar competency
                        <React.Fragment>
                          {this.state.searchResultRoles[0] && this.state.searchResultRoles[0].length > 0 ? (
                            <div className="status-tag pointer" onClick={() => {
                              this.setState({
                                columnSixTabRef: APP.PARAMETERS.SIMILAR_ITEM_TAB_REF
                              });
                            }}>
                              <p className="filter-msg status-text status-text-PL">{this.state.searchResultRoles[0].length} Similar items found</p>
                            </div>
                          ) : (
                            <div className="status-tag pointer">
                              <p className="filter-msg status-text status-text-PL">No similar items found</p>
                            </div>
                          )}
                        </React.Fragment>
                      }
                    </div>
                  )}
                </div>
                {/* Delete action & feedback component */}
                <div className={` ${this.state.formUpdated
                  ? ((!this.props.review || this.props.review === "false")
                    ? "col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-9"
                    : "col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-8")
                  : "col-xs-12 col-sm-12 col-md-12 col-lg-7 col-xl-7"
                  } `}>
                  <div className="d-inline-block float-right">
                    {this.state.id !== 0 && (!this.props.review || this.props.review === "false") && (
                      <React.Fragment>
                        <div className="d-inline-block">
                          {this.state.formUpdated && this.state.showFeedback && (
                            <div id="feedback-btn" className="col-6">
                              <RatingAndFeedback {...this.props} />
                            </div>
                          )}
                          {this.state.formUpdated && !this.state.showFeedback &&
                            <button
                              className="btn more-btn"
                              type="button"
                              id="moreDropdownMenu"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              More
                            </button>}
                          <div
                            className={` ${(this.state.formUpdated)
                              ? "dropdown-menu right-dropdown-menu-3 col-3 col-lg-3 col-xl-2 col-md-3 p-0" : "row"
                              } `}
                            role="menu"
                            aria-labelledby="moreDropdownMenu"
                            id="more-menu">
                            <div className={`${((this.state.roles.includes(APP.USER_ROLES.FRAC_ADMIN) || this.state.roles.includes(APP.USER_ROLES.REVIEWER_TWO)))
                              ? "mr-0" : "mr-4"} `}>
                              <RatingAndFeedback {...this.props} />
                            </div>
                            {this.state.roles &&
                              (this.state.roles.includes(APP.USER_ROLES.FRAC_ADMIN) || this.state.roles.includes(APP.USER_ROLES.REVIEWER_TWO))
                              && (
                                <div className="dropdown-content">
                                  <button
                                    className={` btn delete-button-1 ${(this.state.formUpdated && !this.state.showFeedback)
                                      ? "mr-0" : "mr-4"} `}
                                    type="button"
                                    data-toggle="modal"
                                    data-target="#newDeleteModal">
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
                        data-target="#newCancelModal">
                        Discard changes
                      </button>
                    )}
                    {((this.state.formUpdated && this.state.enableSaveAction)
                      || (this.state.roleData && this.state.roleData.status
                        && this.state.roleData.status === APP.NODE_STATUS.DRAFT)) && (
                        <button
                          type="button"
                          className={`btn save-button mt-sm-2 mt-md-2 mt-0 mr-3
                            ${this.state.formUpdated && (!this.props.review || this.props.review === "false")
                              ? "review-secondary-button-1"
                              : "custom-primary-button"
                            } `}
                          onClick={() => {
                            this.setState(
                              {
                                saveAsDraft: false,
                              },
                              () => {
                                this.saveRole();
                              }
                            );
                          }}
                          disabled={!this.state.enableSaveAction}>
                          {((this.props.review || this.props.review === "true")) ? "Save" : "Send for review"}
                        </button>
                      )}
                    {(this.state.formUpdated && (!this.props.review || this.props.review === "false")) && (
                      <button
                        type="button"
                        className="btn save-button custom-primary-button mt-0 mt-sm-2 mt-md-2 mt-lg-0"
                        onClick={() => {
                          this.setState(
                            {
                              saveAsDraft: true,
                            },
                            () => {
                              this.saveRole();
                            }
                          );
                        }}>
                        Save as draft
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Review comments */}
            {this.state.roleData && this.state.roleData.status &&
              ((this.state.roleData.status && this.state.roleData.status === APP.NODE_STATUS.REJECTED
                && this.state.roleData.reviewComments)
                || (this.state.roleData.secondaryStatus && this.state.roleData.secondaryStatus === APP.NODE_STATUS.REJECTED &&
                  this.state.roleData.secondaryReviewComments))
              && (
                <div className="row mb-3">
                  <div className="col-8">
                    <div className="review-comment-box-1">
                      <label>Reviewer’s comment</label>
                      <p>{this.state.roleData.secondaryReviewComments
                        ? this.state.roleData.secondaryReviewComments
                        : this.state.roleData.reviewComments}</p>
                    </div>
                  </div>
                </div>
              )}

            <form onSubmit={this.saveRole}>
              <div className="row">
                <label
                  className="col-xl-4 col-12">Role ID</label>
                <div className="col-xl-8 col-12 mb-4">
                  <input
                    type="text"
                    id="expertID"
                    className="form-control"
                    placeholder="RID"
                    aria-label="id"
                    value={this.state.roleData.id || ""}
                    aria-describedby="basicId"
                    disabled
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-xl-4 col-12">
                  <label>Role Label*</label>
                  <span
                    className="material-icons info-icon pl-2 align-middle pointer-style"
                    data-toggle="tooltip"
                    data-trigger="hover click"
                    title="The role label is the name of the role. It succinctly gives an idea of the activities that would be carried out to perform this role (e.g. team manager, project manager). Recommend to use a noun."
                  >
                    info
                  </span>
                </div>
                <div className="col-xl-8 col-12 mb-4">
                  <input
                    type="text"
                    id={APP.COLLECTIONS.ROLE + APP.FIELD_NAME.LABEL + "value"}
                    className="form-control"
                    placeholder="Role Label"
                    aria-label="label"
                    aria-describedby="basicLabel"
                    name="roleLabel"
                    value={this.state.roleData.name}
                    onChange={this.onRoleChange}
                    autoComplete="off"
                    spellCheck="true"
                    onKeyUp={(event) => this.getSimilarRoles(event)}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-xl-4 col-12">
                  <label>Role Description*</label>
                  <span
                    className="material-icons info-icon pl-2 align-middle pointer-style"
                    data-toggle="tooltip"
                    data-trigger="hover click"
                    title="The role description should describe the set of activities that would be carried out to perform this role. It should answer the following: What are the overall objectives of the associated activities?"
                  >
                    info
                  </span>
                </div>
                <div className="col-xl-8 col-12 mb-4">
                  <textarea
                    className="form-control"
                    id={APP.COLLECTIONS.ROLE + APP.FIELD_NAME.DESCRITPION + "value"}
                    spellCheck="true"
                    rows={
                      this.state.roleData.description &&
                        this.state.roleData.description.length > 200
                        ? (this.state.roleData.description.length > 800
                          ? 15 : this.state.roleData.description.length / 55)
                        : 4
                    }
                    placeholder="Role Description..."
                    name="roleDescription"
                    value={this.state.roleData.description}
                    onChange={this.onRoleChange}
                    autoComplete="off"
                    onKeyUp={(event) => {
                      if (!this.state.keyCodes.includes(event.keyCode)) {
                        if (event.keyCode === 32) {
                          this.getSimilarRoles(event);
                        }
                      }
                      this.getLetterCount(event);
                    }}
                    required
                  ></textarea>
                  <p
                    className={`mb-4 ${this.state.letterCount < 0
                      ? "change-text-color"
                      : "change-text-color-1"
                      }`}>
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
                                roleData: {
                                  ...this.state.roleData,
                                  name: "",
                                  description: "",
                                },
                                letterCount: 200,
                                saveAsDraft: false,
                                roleResponse: {},
                                enableSaveAction: false,
                                formUpdated: false,
                              },
                              () => {
                                if (this.state.id !== 0) {
                                  this.getRoleDetails(this.state.id, "ROLE");
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
                  <div id="officerColumn4" className="ml-3 mt-3">
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
                          href="#pills-activity"
                          role="tab"
                          aria-controls="pills-home"
                          aria-selected="true"
                          onClick={() =>
                            this.setState({
                              getCompetency: false,
                              getSelectedCompetencyID: "",
                              getPosition: false,
                              getSelectedPositionID: "",
                            })
                          }
                        >
                          Activities
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link  text-center custom-officer-margin"
                          id="pills-home-tab"
                          data-toggle="pill"
                          href="#pills-competency"
                          role="tab"
                          aria-controls="pills-home"
                          aria-selected="true"
                          onClick={() =>
                            this.setState({
                              getPosition: false,
                              getSelectedPositionID: "",
                              getActivity: false,
                              getSelectedActivityID: "",
                            })
                          }
                        >
                          Competencies
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link text-center custom-officer-margin"
                          id="pills-home-tab"
                          data-toggle="pill"
                          href="#pills-ap"
                          role="tab"
                          aria-controls="pills-home"
                          aria-selected="true"
                          onClick={() =>
                            this.setState({
                              getCompetency: false,
                              getSelectedCompetencyID: "",
                              getActivity: false,
                              getSelectedActivityID: "",
                            })
                          }
                        >
                          Associated Positions
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="tab-content m-2" id="pills-tabContent">
                    <div
                      className="tab-pane fade"
                      id="pills-competency"
                      role="tabpanel"
                      aria-labelledby="pills-home-tab"
                    >
                      <button
                        type="button"
                        id={APP.COLLECTIONS.ROLE + MAP_COMPETENCY + "value"}
                        className="btn new-secondary-btn mt-2 mb-4"
                        data-toggle="modal"
                        data-target="#newActivityModal"
                        onClick={() => {
                          this.getCompetencyList();
                          this.setState({
                            showActivityLog: true,
                            getPosition: false,
                            getCompetency: false,
                            getActivity: false,
                          });
                        }}>
                        Add Competency
                      </button>

                      <div
                        className="modal fade fadeInUp"
                        id="newActivityModal"
                        tabIndex="-1"
                        role="dialog"
                        aria-labelledby="newActivityModalTitle"
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
                                    id="newActivityLongTitle">
                                    Map an existing competency
                                  </h5>
                                </div>

                                {/* Search for list of competencies */}
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
                                      name="searchCompetencyKeyword"
                                      id="competencySearch"
                                      onChange={this.onRoleChange}
                                      value={this.state.competencySearchkeyword}
                                      autoComplete="off"
                                    />
                                  </div>
                                  <div className="col-2">
                                    {this.state.clearSearchCompetencyRole && (
                                      <span
                                        className="material-icons competency-area-close-button-3"
                                        onClick={() => {
                                          this.setState(
                                            {
                                              clearSearchInputCompetencyRole: true,
                                            },
                                            () => {
                                              document.getElementById(
                                                "competencySearch"
                                              ).value = "";
                                              this.searchCompetency();
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
                                  <div id="competencyList">
                                    {this.state.searchCompetencyList && this.state.searchCompetencyList.length > 0 && (
                                      <div
                                        style={{
                                          height: "25em",
                                          width: "100%",
                                        }}>
                                        <AutoSizer>
                                          {({ height, width }) => (
                                            <List
                                              width={width}
                                              height={height}
                                              rowHeight={85}
                                              rowRenderer={({ index, key, style }) => {
                                                return (
                                                  <div key={key} style={style}>
                                                    <dd key={key}>
                                                      <div className="flex">
                                                        {this.state.selectedCompetencyList.includes(
                                                          this.state.searchCompetencyList[index].id
                                                        ) && (
                                                            <input
                                                              checked
                                                              type="checkbox"
                                                              className="mt-4 mr-3 custom-search-checkbox"
                                                              onChange={() =>
                                                                this.selectionToggle(
                                                                  this.state.searchCompetencyList[index].id
                                                                )
                                                              }
                                                            />
                                                          )}
                                                        {!this.state.selectedCompetencyList.includes(
                                                          this.state.searchCompetencyList[index].id
                                                        ) && (
                                                            <input
                                                              type="checkbox"
                                                              className="mt-4 mr-3 custom-search-checkbox"
                                                              onChange={() =>
                                                                this.selectionToggle(
                                                                  this.state.searchCompetencyList[index].id
                                                                )
                                                              }
                                                            />
                                                          )}
                                                        <div
                                                          className={`col-xs-12 col-sm-12 col-md-8 col-lg-10 col-xl-10 card mb-3 cca-card pointer-style competency-border-1 ${this.state.selectedCompetencyList.includes(
                                                            this.state.searchCompetencyList[index].id
                                                          )
                                                            ? "on-select-card"
                                                            : ""
                                                            }`}>
                                                          <div
                                                            className="ml-0 pl-2"
                                                            onClick={() => {
                                                              this.selectionToggle(
                                                                this.state.searchCompetencyList[index].id
                                                              );
                                                            }}>
                                                            <p className="custom-heading-1 card-spacing-1">
                                                              {this.state.searchCompetencyList[index].name}
                                                            </p>
                                                            <p className="custom-sub-heading-1 custom-line-height-1">
                                                              {this.state.searchCompetencyList[index].id}
                                                            </p>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </dd>
                                                  </div>
                                                );
                                              }}
                                              rowCount={this.state.searchCompetencyList.length} />
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

                                {/* Search for already added competencies */}
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
                                      id="competencySearchTwo"
                                      onKeyUp={this.searchCompetencyTwo}
                                      autoComplete="off"
                                    />
                                  </div>
                                  <div className="col-2">
                                    {this.state
                                      .clearSearchCompetencyRoleTwo && (
                                        <span
                                          className="material-icons competency-area-close-button-3"
                                          onClick={() => {
                                            this.setState(
                                              {
                                                clearSearchInputCompetencyRoleTwo: true,
                                              },
                                              () => {
                                                document.getElementById(
                                                  "competencySearchTwo"
                                                ).value = "";
                                                this.searchCompetencyTwo();
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
                                  <div id="competencyListTwo">
                                    {this.state.mappedCompetency &&
                                      this.state.mappedCompetency.map(
                                        (i, j) => {
                                          return (
                                            <dd key={i.id}>
                                              <div className="flex">
                                                <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10 card mb-3 cca-card competency-border-1">
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
                                        }
                                      )}
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
                                      pathname: "/collection-competencies/0",
                                      state: {
                                        isNewCompetency: true,
                                        id: 0,
                                        type: "COMPETENCY",
                                      },
                                    })
                                  }
                                >
                                  Create a new Competency
                                </button>
                                <button
                                  type="button"
                                  className="btn save-button mr-2 custom-primary-button"
                                  data-dismiss="modal"
                                  onClick={this.mapCompetencyToRole}
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Search for mapped competencies */}
                      {this.state.mappedCompetency && this.state.mappedCompetency.length > 0 && (
                        <div className="row col-12">
                          <div
                            className="col-3 mb-4 p-0"
                            id="officerBucketsList"
                          >
                            <input
                              type="text"
                              style={{ width: "110%", paddingLeft: "1.75rem" }}
                              className="form-control mb-4 custom-search-5 custom-search-bar-2 form-control-4"
                              placeholder="Search..."
                              name="search"
                              id="mappedCompetencySearch"
                              onKeyUp={this.searchMappedCompetency}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-2">
                            {this.state.clearSearchMappedCompetencyRole && (
                              <span
                                className="material-icons competency-area-close-button-3"
                                onClick={() => {
                                  this.setState(
                                    {
                                      clearSearchInputMappedCompetencyRole: true,
                                    },
                                    () => {
                                      document.getElementById(
                                        "mappedCompetencySearch"
                                      ).value = "";
                                      this.searchMappedCompetency();
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

                      <div id="mappedCompetencyList">
                        <div className="row col-12">
                          {this.state.mappedCompetency &&
                            this.state.mappedCompetency.map(
                              (value, index) => {
                                return (
                                  <div
                                    className={`col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 card mr-3 mb-3 cca-card pointer-style competency-border-1 custom-fixed-width-2 ${this.state.getSelectedCompetencyID ===
                                      value.id
                                      ? "on-select-card-2"
                                      : ""
                                      }`}
                                    key={value.id}
                                    onClick={() =>
                                      this.selectedCompetency(value.id)
                                    }
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
                              }
                            )}
                        </div>
                      </div>
                    </div>

                    <div
                      className="tab-pane fade"
                      id="pills-ap"
                      role="tabpanel"
                      aria-labelledby="pills-profile-tab"
                    >
                      {/* Search for associated positions*/}
                      {this.state.mappedPosition && this.state.mappedPosition.length > 0
                        ? (
                          <div className="row col-12">
                            <div
                              className="col-3 mb-4 p-0"
                              id="officerBucketsList"
                            >
                              <input
                                type="text"
                                style={{ width: "110%", paddingLeft: "1.75rem" }}
                                className="form-control mb-4 custom-search-5 custom-search-bar-2 form-control-4"
                                placeholder="Search..."
                                name="search"
                                autoComplete="off"
                                id="mappedPositionSearch"
                                onKeyUp={this.searchMappedPosition}
                              />
                            </div>
                            <div className="col-2">
                              {this.state.clearSearchMappedPositionRole && (
                                <span
                                  className="material-icons competency-area-close-button-3"
                                  onClick={() => {
                                    this.setState(
                                      {
                                        clearSearchInputMappedPositionRole: true,
                                      },
                                      () => {
                                        document.getElementById(
                                          "mappedPositionSearch"
                                        ).value = "";
                                        this.searchMappedPosition();
                                      }
                                    );
                                  }}
                                >
                                  close
                                </span>
                              )}
                            </div>
                          </div>
                        )
                        : (
                          <div id="emptyState">
                            <p> No associated positions</p>
                          </div>
                        )}

                      <div id="mappedPositionList">
                        <div className="row col-12">
                          {this.state.mappedPosition &&
                            this.state.mappedPosition.map((value, index) => {
                              return (
                                <div
                                  className={`col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 card mr-3 mb-3 cca-card pointer-style position-border-1 custom-fixed-width-2 ${this.state.getSelectedPositionID ===
                                    value.id
                                    ? "on-select-card-2"
                                    : ""
                                    }`}
                                  key={value.id}
                                  onClick={() =>
                                    this.selectedPosition(value.id)
                                  }
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
                      id="pills-activity"
                      role="tabpanel"
                      aria-labelledby="pills-activity-tab">
                      <button
                        type="button"
                        id={APP.COLLECTIONS.ROLE + MAP_ACTIVITY + "value"}
                        className="btn new-secondary-btn mt-2 mb-4"
                        data-toggle="modal"
                        data-target="#newActivityToRoleModal"
                        onClick={() => {
                          this.getActivityList();
                          this.setState({
                            getRole: false,
                            showActivityLog: true,
                            getActivity: false,
                          });
                        }}>
                        Add Activity
                      </button>

                      <div
                        className="modal fade fadeInUp"
                        id="newActivityToRoleModal"
                        tabIndex="-1"
                        role="dialog"
                        aria-labelledby="newRoleActivityModalTitle"
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
                                    id="newRoleActivityModalLongTitle"
                                  >
                                    Map an existing activity
                                  </h5>
                                </div>

                                {/* Search for list of activities */}
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
                                      name="searchActivityKeyword"
                                      id="activitySearch"
                                      onChange={this.onRoleChange}
                                      value={this.state.activitySearchkeyword}
                                      autoComplete="off"
                                    />
                                  </div>
                                  <div className="col-2">
                                    {this.state.clearSearchActivityRole && (
                                      <span
                                        className="material-icons competency-area-close-button-3"
                                        onClick={() => {
                                          this.setState(
                                            {
                                              clearSearchInputActivityRole: true,
                                            },
                                            () => {
                                              document.getElementById(
                                                "activitySearch"
                                              ).value = "";
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

                                <div className="modal-body remove-scroll-x">
                                  <div id="activityListSearch">
                                    {this.state.searchActivityList && this.state.searchActivityList.length > 0 && (
                                      <div
                                        style={{
                                          height: "25em",
                                          width: "100%",
                                        }}>
                                        <AutoSizer>
                                          {({ height, width }) => (
                                            <List
                                              width={width}
                                              height={height}
                                              rowHeight={85}
                                              rowRenderer={({ index, key, style }) => {
                                                return (
                                                  <div key={key} style={style}>
                                                    <dd key={key}>
                                                      <div className="flex">
                                                        {this.state.selectedActivityList.includes(
                                                          this.state.searchActivityList[index].id
                                                        ) && (
                                                            <input
                                                              checked
                                                              type="checkbox"
                                                              className="mt-4 mr-3 custom-search-checkbox"
                                                              onChange={() =>
                                                                this.selectionToggleActivity(
                                                                  this.state.searchActivityList[index].id
                                                                )
                                                              }
                                                            />
                                                          )}
                                                        {!this.state.selectedActivityList.includes(
                                                          this.state.searchActivityList[index].id
                                                        ) && (
                                                            <input
                                                              type="checkbox"
                                                              className="mt-4 mr-3 custom-search-checkbox"
                                                              onChange={() =>
                                                                this.selectionToggleActivity(
                                                                  this.state.searchActivityList[index].id
                                                                )
                                                              }
                                                            />
                                                          )}

                                                        <div
                                                          className={`col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 card mb-3 cca-card pointer-style activity-border-1 ${this.state.selectedActivityList.includes(
                                                            this.state.searchActivityList[index].id
                                                          )
                                                            ? "on-select-card"
                                                            : ""
                                                            }`}>
                                                          <div
                                                            className="ml-0 pl-2"
                                                            onClick={() =>
                                                              this.selectionToggleActivity(
                                                                this.state.searchActivityList[index].id
                                                              )
                                                            }>
                                                            <p className="custom-heading-1 card-spacing-1 description-preview">
                                                              {this.state.searchActivityList[index].name
                                                                ? this.state.searchActivityList[index].name
                                                                : this.state.searchActivityList[index].description}
                                                            </p>
                                                            <p className="custom-sub-heading-1 custom-line-height-1">
                                                              {this.state.searchActivityList[index].id}
                                                            </p>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </dd>
                                                  </div>
                                                );
                                              }}
                                              rowCount={this.state.searchActivityList.length} />
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

                                {/* Search for already added activities */}
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
                                      id="activitySearchTwo"
                                      onKeyUp={this.searchActivityTwo}
                                      autoComplete="off"
                                    />
                                  </div>
                                  <div className="col-2">
                                    {this.state
                                      .clearSearchActivityRoleTwo && (
                                        <span
                                          className="material-icons competency-area-close-button-3"
                                          onClick={() => {
                                            this.setState(
                                              {
                                                clearSearchInputActivityRoleTwo: true,
                                              },
                                              () => {
                                                document.getElementById(
                                                  "activitySearchTwo"
                                                ).value = "";
                                                this.searchActivityTwo();
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
                                  <div id="activityListTwo">
                                    {this.state.mappedActivity &&
                                      this.state.mappedActivity.map(
                                        (i, j) => {
                                          return (
                                            <dd key={i.id}>
                                              <div className="flex">
                                                <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 card mb-3 cca-card activity-border-1">
                                                  <div className="ml-0 pl-2">
                                                    <p className="custom-heading-1 card-spacing-1 description-preview">
                                                      {i.name
                                                        ? i.name
                                                        : i.description}
                                                    </p>
                                                    <p className="custom-sub-heading-1 custom-line-height-1">
                                                      {i.id}
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            </dd>
                                          );
                                        }
                                      )}
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
                                      pathname: "/collection-activities/0",
                                      state: {
                                        isNewActivity: true,
                                        id: 0,
                                        type: "ACTIVITY",
                                      },
                                    })
                                  }
                                >
                                  Create a new Activity
                                </button>
                                <button
                                  type="button"
                                  className="btn save-button mr-2 custom-primary-button"
                                  data-dismiss="modal"
                                  onClick={this.mapActivityToRole}
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Search for mapped activities*/}
                      {this.state.mappedActivity && this.state.mappedActivity.length > 0 && (
                        <div className="row col-12">
                          <div
                            className="col-3 mb-4 p-0"
                            id="officerBucketsList"
                          >
                            <input
                              type="text"
                              style={{ width: "110%", paddingLeft: "1.75rem" }}
                              className="form-control mb-4 custom-search-5 custom-search-bar-2 form-control-4"
                              placeholder="Search..."
                              name="search"
                              id="activityMappedSearch"
                              onKeyUp={this.searchMappedActivity}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-2">
                            {this.state.clearSearchMappedActivityRole && (
                              <span
                                className="material-icons competency-area-close-button-3"
                                onClick={() => {
                                  this.setState(
                                    {
                                      clearSearchInputMappedActivityRole: true,
                                    },
                                    () => {
                                      document.getElementById(
                                        "activityMappedSearch"
                                      ).value = "";
                                      this.searchMappedActivity();
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

                      <div id="mappedActivityList">
                        <div className="row col-12">
                          {this.state.mappedActivity &&
                            this.state.mappedActivity.map((value, index) => {
                              return (
                                <div
                                  className={`col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 card mr-3 mb-3 cca-card pointer-style activity-border-1 custom-fixed-width-2 ${this.state.getSelectedActivityID ===
                                    value.id
                                    ? "on-select-card-2"
                                    : ""
                                    }`}
                                  key={value.id}
                                  onClick={() =>
                                    this.selectedActivity(value.id)
                                  }
                                >
                                  <div className="ml-0 pl-2">
                                    <p className="custom-heading-1 card-spacing-1 description-preview">
                                      {value.name ? value.name : value.description}
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
              aria-hidden="true">
              <div
                className="modal-dialog modal-dialog-centered"
                role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5
                      className="modal-title"
                      id="newDeleteLongTitle"
                    >
                      Do you want to delete this Role?
                    </h5>
                  </div>
                  <div className="modal-body remove-scroll-x">
                    <p>
                      The selected Role details and all the mapping
                      related to this Role will be deleted.
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
                            this.state.roleData.id,
                            "ROLE"
                          )
                        }>
                        Yes, delete
                      </button>

                      <button
                        type="button"
                        className="btn save-button mr-2 custom-primary-button-3"
                        data-dismiss="modal">
                        No
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.getCompetency && (
          <ColumnFive
            {...this.props}
            roleId={this.state.getSelectedCompetencyID}
            type="COMPETENCY"
            childType={["COMPETENCIESLEVEL"]}
            parentType={["ROLE"]}
            selectionFunction={this.unmapCompetency}
            unMapFunction={this.mapCompetencyToRole}
            btnText="Jump to Competency"
            url="/collection-competencies/"
            stateDataKey="isNewCompetency"
            searchBarStyle="custom-search-bar-3"
            customHeight="custom-full-height-4"
          />
        )}
        {this.state.getPosition && (
          <ColumnFive
            {...this.props}
            roleId={this.state.getSelectedPositionID}
            type="POSITION"
            childType={["ROLE"]}
            btnText="Jump to Position"
            url="/collection-positions/"
            stateDataKey="isNewPosition"
            searchBarStyle="custom-search-bar-3"
            customHeight="custom-full-height-4"
          />
        )}
        {this.state.getActivity && (
          <ColumnFive
            {...this.props}
            roleId={this.state.getSelectedActivityID}
            type="ACTIVITY"
            childType={["KNOWLEDGERESOURCE"]}
            parentType={["ROLE"]}
            selectionFunction={this.unmapActivity}
            unMapFunction={this.mapActivityToRole}
            btnText="Jump to Activity"
            url="/collection-activities/"
            stateDataKey="isNewCompetency"
            searchBarStyle="custom-search-bar-3"
            customHeight="custom-full-height-4"
          />
        )}
        {this.state.showActivityLog && (
          <ColumnSix
            {...this.props}
            customHeight="custom-full-height-4"
            activityLogs={this.state.activityLogs}
            nodeData={this.state.roleData}
            activeTabId={this.state.columnSixTabRef}
            searchData={this.state.searchResultRoles}
            searchHeading="Similar Roles"
            searchClass="role-border-1"
            searchClass2="activity-border-1"
            type="ROLE"
            btnText="Jump to Role"
            url="/collection-roles/"
            stateDataKey="isNewRole"
            actioBtnText="Copy info to new role"
            titleSecondary="Activities"
            functionName="getChildForParent"
            receiveData={this.receiveData}
          />
        )}
      </div>
    );
  }
}

export default ColumnThree;
export { ColumnThree };
