import React from "react";
import { MasterService } from "../../../../services/master.service";
import Notify from "../../../../helpers/notify";
import { APP } from "../../../../constants";
import ColumnFive from "./ColumnFive";
import ColumnSix from "./ColumnSix";
import CryptoJS from "crypto-js";
import RatingAndFeedback from "../common/RatingAndFeedback";
import { List } from "react-virtualized";
import AutoSizer from "react-virtualized-auto-sizer";

const MAP_ROLE = "Map role";
const formFields = [
  APP.FIELD_NAME.LABEL,
  APP.FIELD_NAME.DESCRITPION,
  APP.FIELD_NAME.MDO,
  MAP_ROLE,
];

class ColumnThree extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      positionDetails: [],
      positionData: {
        name: "",
        description: "",
      },
      positionResponse: {},
      enableSaveAction: false,
      formUpdated: false,
      rolesList: [],
      selectedRoleList: [],
      mappedRoles: [],
      searchResultPositions: [],
      getRole: false,
      getSelectedRoleID: "",
      letterCount: 200,
      keyCodes: [8, 46, 37, 39, 38, 40],
      comments: [],
      commentText: "",
      changeRating: true,
      clearSearchMappedRolePOS: false,
      clearSearchInputMappedRolePOS: false,
      clearSearchRolePOSTwo: false,
      clearSearchInputRolePOSTwo: false,
      clearSearchRolePOS: false,
      clearSearchInputRolePOS: false,
      roles: "",
      currentDept: "",
      showActivityLog: true,
      activityLogs: [],
      saveAsDraft: false,
      clearSearchDeptPOS: false,
      clearSearchInputDeptPOS: false,
      showFeedback: false,
      roleSearchkeyword: "",
      searchRoleList: [],
      columnSixTabRef: "",
      sectorList: [],
      modalList: [],
      selectedSectorKey: "",
      selectedSectorDetails: [],
      newPositionSector: "",
      enableNewSector: false,
      enableNewSectorAddition: false,
    };
    this.savePosition = this.savePosition.bind(this);
    this.onPositionChange = this.onPositionChange.bind(this);
    this.getPositionDetails = this.getPositionDetails.bind(this);
    this.getRolesList = this.getRolesList.bind(this);
    this.selectionToggle = this.selectionToggle.bind(this);
    this.mapRolesToPosition = this.mapRolesToPosition.bind(this);
    this.getRolesMapped = this.getRolesMapped.bind(this);
    this.searchRole = this.searchRole.bind(this);
    this.searchRoleTwo = this.searchRoleTwo.bind(this);
    this.searchMappedRole = this.searchMappedRole.bind(this);
    this.getSimilarPositions = this.getSimilarPositions.bind(this);
    this.selectedRole = this.selectedRole.bind(this);
    this.receiveData = this.receiveData.bind(this);
    this.getLetterCount = this.getLetterCount.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.checkClickTwo = React.createRef();
    this.checkClickActivityTwo = this.checkClickActivityTwo.bind(this);
    this.unmapRole = this.unmapRole.bind(this);
    this.nameAvatar = this.nameAvatar.bind(this);
    this.checkAccess = this.checkAccess.bind(this);
    this.getCurrentDepartment = this.getCurrentDepartment.bind(this);
    this.resetPosHandler = this.resetPosHandler.bind(this);
    this.getPositionsLogs = this.getPositionsLogs.bind(this);
    this.searchForDeptOnePOS = this.searchForDeptOnePOS.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    // To fetch the data when the page loads for the first time or on refresh
    if (this.props.history.location.state) {
      if (this.props.history.location.state.id !== "0") {
        this.setState(
          {
            id: this.props.history.location.state.id,
          },
          () => {
            if (this.state.id !== 0) {
              // To get position details based on ID
              this.getPositionDetails(
                this.state.id,
                this.props.history.location.state.type
              );
              // To get mapped roles for the position based on ID
              this.getRolesMapped(this.state.id, "ROLE");
              this.getPositionsLogs(this.state.id, "POSITION");
            } else {
              this.updateFormFieldAccess();
            }
          }
        );
      }
    }
    this.checkAccess();
    this.getCurrentDepartment();
    this.getPositionSectorList();

    document
      .getElementById("masterColumn3")
      .addEventListener("mousedown", (event) => {
        if (
          event.path &&
          event.path.length > 3 &&
          event.path[4].id !== "mappedRolesList"
        ) {
          this.resetPosHandler();
        }
      });
  }

  componentWillUnmount() {
    document
      .getElementById("masterColumn3")
      .removeEventListener("mousedown", function () {});

    this._isMounted = false;
    this.setState = (state, callback) => {
      return;
    };
  }

  resetPosHandler = () => {
    this.setState({
      getRole: false,
      showActivityLog: true,
      getSelectedRoleID: "",
    });
  };

  receiveData = (name, description) => {
    if (name && description) {
      this.setState(
        {
          positionData: {
            ...this.state.positionData,
            name: name,
            description: description,
          },
        },
        () => {
          this.setState({
            letterCount: 200 - this.state.positionData.description.length,
          });
        }
      );
    }
  };

  searchRole = () => {
    // To search for a role from role list in the modal
    // Declare variables
    let input, filter, ul, li, a, i, txtValue;
    if (!this.state.clearSearchInputRolePOS) {
      this.setState({
        clearSearchRolePOS: true,
      });
    } else {
      this.setState({
        clearSearchRolePOS: false,
        clearSearchInputRolePOS: false,
      });
    }

    input = document.getElementById("roleSearch");

    if (input.value.length === 0) {
      this.setState({
        clearSearchRolePOS: false,
        clearSearchInputRolePOS: false,
      });
    }

    if (!this.state.clearSearchInputRolePOS) {
      filter = input.value.toUpperCase();
    } else {
      filter = "";
    }

    ul = document.getElementById("roleList");
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

  searchRoleTwo = () => {
    // To search for a role from role list in the modal
    // Declare variables
    let input, filter, ul, li, a, i, txtValue;
    if (!this.state.clearSearchInputRolePOSTwo) {
      this.setState({
        clearSearchRolePOSTwo: true,
      });
    } else {
      this.setState({
        clearSearchRolePOSTwo: false,
        clearSearchInputRolePOSTwo: false,
      });
    }

    input = document.getElementById("roleSearchTwo");

    if (input.value.length === 0) {
      this.setState({
        clearSearchRolePOSTwo: false,
        clearSearchInputRolePOSTwo: false,
      });
    }

    if (!this.state.clearSearchInputRolePOSTwo) {
      filter = input.value.toUpperCase();
    } else {
      filter = "";
    }

    ul = document.getElementById("roleListTwo");
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

  searchMappedRole = () => {
    // To search for a role from the mapped role list for a position
    // Declare variables
    let input, filter, ul, li, a, i, txtValue;
    if (!this.state.clearSearchInputMappedRolePOS) {
      this.setState({
        clearSearchMappedRolePOS: true,
      });
    } else {
      this.setState({
        clearSearchMappedRolePOS: false,
        clearSearchInputMappedRolePOS: false,
      });
    }

    input = document.getElementById("roleMappedSearch");

    if (input.value.length === 0) {
      this.setState({
        clearSearchMappedRolePOS: false,
        clearSearchInputMappedRolePOS: false,
      });
    }

    if (!this.state.clearSearchInputMappedRolePOS) {
      filter = input.value.toUpperCase();
    } else {
      filter = "";
    }

    ul = document.getElementById("mappedRolesList");
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

  getSimilarPositions = (event) => {
    // To get similar roles while typing in the field
    if (event && !event.custom) {
      event.preventDefault();
    }

    this.setState({
      getRole: false,
    });

    // For Name
    if (
      event.target.name === "posLabel" &&
      this.state.positionData.name.length > 1
    ) {
      if (!event.custom) {
        this.setState({
          columnSixTabRef: APP.PARAMETERS.SIMILAR_ITEM_TAB_REF,
        });
      }
      let searchPayloadNamePOS = {
        searches: [
          {
            type: "POSITION",
            field: "name",
            keyword: this.state.positionData.name,
          },
        ],
      };
      MasterService.searchNodes(searchPayloadNamePOS).then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState(
            {
              searchResultPositions: [],
            },
            () => {
              const resultSet = [];
              response.data.responseData.forEach((searchObj) => {
                if (searchObj.id !== this.state.positionData.id) {
                  resultSet.push(searchObj);
                }
              });
              this.setState({
                searchResultPositions: [
                  ...this.state.searchResultPositions,
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
        searchResultPositions: [],
      });
    }

    // For Description
    if (
      event.target.name === "posDescription" &&
      this.state.positionData.description.length > 1
    ) {
      let searchPayloadDescriptionPOS = {
        searches: [
          {
            type: "POSITION",
            field: "description",
            keyword: this.state.positionData.description,
          },
        ],
      };
      MasterService.searchNodes(searchPayloadDescriptionPOS).then(
        (response) => {
          if (
            response &&
            response.data.statusInfo.statusCode === APP.CODE.SUCCESS
          ) {
            this.setState(
              {
                searchResultPositions: [],
              },
              () => {
                this.setState({
                  searchResultPositions: [
                    ...this.state.searchResultPositions,
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
        searchResultPositions: [],
      });
    }

    // For Department
    if (
      event.target.name === "posDepartment" &&
      this.state.positionData.additionalProperties &&
      this.state.positionData.additionalProperties.Department &&
      this.state.positionData.additionalProperties.Department.length > 1
    ) {
      let searchPayloadDepartmentPOS = {
        searches: [
          {
            type: "POSITION",
            field: "department",
            keyword: this.state.positionData.additionalProperties.Department,
          },
        ],
      };
      MasterService.searchNodes(searchPayloadDepartmentPOS).then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState(
            {
              searchResultPositions: [],
            },
            () => {
              this.setState({
                searchResultPositions: [
                  ...this.state.searchResultPositions,
                  response.data.responseData,
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
        searchResultPositions: [],
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

  checkClickActivityTwo = (event) => {
    event.preventDefault();
    if (
      this.checkClickTwo.current !== null &&
      this.checkClick.current === null
    ) {
      document.addEventListener("mousedown", this.checkClickActivityTwo);
      if (
        this.checkClickTwo &&
        !this.checkClickTwo.current.contains(event.target)
      ) {
        this.setState({
          getRole: false,
          showActivityLog: true,
          getSelectedRoleID: "",
        });
      }
    } else {
      document.removeEventListener("mousedown", this.checkClickActivityTwo);
    }
  };

  savePosition = (e) => {
    // To submit/save the position details
    if (e) {
      e.preventDefault();
    }

    let positionPayload = {
      type: APP.COLLECTIONS.POSITION,
      source: "FRAC",
      name: this.state.positionData.name,
      description: this.state.positionData.description,
      additionalProperties: {},
    };
    // position id
    if (this.state.id) {
      positionPayload.id = this.state.id;
    }
    // Set department
    if (
      this.state.positionData.additionalProperties &&
      this.state.positionData.additionalProperties.Department
    ) {
      positionPayload.additionalProperties.Department =
        this.state.positionData.additionalProperties.Department;
    }
    // setSector
    if (
      this.state.positionData.additionalProperties &&
      this.state.positionData.additionalProperties.sector
    ) {
      positionPayload.additionalProperties.sector =
        this.state.positionData.additionalProperties.sector;
    }
    if (
      this.state.id === 0 &&
      !JSON.stringify(this.state.roles).includes(APP.USER_ROLES.FRAC_ADMIN) &&
      !JSON.stringify(this.state.roles).includes(APP.USER_ROLES.REVIEWER_ONE) &&
      !JSON.stringify(this.state.roles).includes(APP.USER_ROLES.REVIEWER_TWO)
    ) {
      positionPayload.additionalProperties.Department = this.state.currentDept;
    }
    // Set draft status
    if (this.state.saveAsDraft) {
      positionPayload.status = "DRAFT";
    }

    if (
      (positionPayload.name &&
        positionPayload.name.length > 1 &&
        positionPayload.additionalProperties &&
        positionPayload.additionalProperties.Department &&
        positionPayload.additionalProperties.Department.length > 0 &&
        positionPayload.additionalProperties.Department !== "Select a MDO") ||
      this.state.saveAsDraft
    ) {
      MasterService.addDataNode(positionPayload).then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          if (this.state.id === 0) {
            Notify.dark("Position created successfully");
          } else {
            Notify.dark("Position updated successfully");
          }

          this.setState(
            {
              getRole: false,
              saveAsDraft: false,
            },
            () => {
              setTimeout(() => {
                if (this.state.id !== 0) {
                  this.getPositionsLogs(this.state.id, "POSITION");
                }
              }, 800);
            }
          );
          const pathName =
            this.props.review && this.props.review === "true"
              ? APP.ROUTES_PATH.REVIEW_POSITION
              : APP.COLLECTIONS_PATH.POSITION;
          this.props.history.push({
            pathname: pathName + response.data.responseData.id,
            state: {
              isNewPosition: false,
              id: response.data.responseData.id,
              type: "POSITION",
              stayOn: true,
              showColumnThree: true,
            },
          });
          if (this.state.id !== 0) {
            setTimeout(() => {
              this.getPositionDetails(
                response.data.responseData.id,
                "POSITION"
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

  getPositionDetails = (id, type) => {
    // Get position details by id and type
    if (id !== 0) {
      this.setState({
        positionData: {
          id: "",
          name: "",
          description: "",
          additionalProperties: {
            Department: "",
          },
        },
      });
      setTimeout(() => {
        MasterService.getDataByNodeId(id, type).then((response) => {
          if (
            response &&
            response.data.statusInfo.statusCode === APP.CODE.SUCCESS
          ) {
            this.setState(
              {
                positionData: response.data.responseData,
                positionResponse: response.data.responseData,
              },
              () => {
                if (this.props.review || this.props.review === "true") {
                  const event = { target: { name: "posLabel" }, custom: true };
                  this.getSimilarPositions(event);
                }
                this.formValidation();
                this.updateFormFieldAccess();
                if (this.state.positionData.description) {
                  this.setState({
                    letterCount:
                      this.state.letterCount -
                      this.state.positionData.description.length,
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
        positionData: {
          id: "",
          name: "",
          description: "",
          additionalProperties: {
            Department: "",
          },
        },
      });
    }
  };

  updateFormFieldAccess() {
    let disable = false;
    if (
      this.state.id &&
      this.state.positionData.secondaryStatus &&
      this.state.positionData.secondaryStatus === APP.NODE_STATUS.VERIFIED &&
      !this.state.roles.includes(APP.USER_ROLES.FRAC_ADMIN) &&
      !this.state.roles.includes(APP.USER_ROLES.REVIEWER_TWO)
    ) {
      disable = true;
    }

    formFields.forEach((field) => {
      const elementId = APP.COLLECTIONS.POSITION + field + "value";
      const element = document.getElementById(elementId);
      if (element) {
        element.disabled = disable;
      }
      if (field === APP.FIELD_NAME.MDO) {
        const elementId1 = APP.COLLECTIONS.POSITION + field + "value1";
        const element1 = document.getElementById(elementId1);
        if (element1) {
          element1.disabled = disable;
        }
      }
    });
  }

  onPositionChange = (e) => {
    // Catch the changes done in the input fields
    e.preventDefault();
    let onlyAlphabet = /^[/+#\-_()., A-Za-z ]*$/;

    switch (e.target.name) {
      case "posLabel":
        if (!onlyAlphabet.test(e.target.value)) {
          return false;
        }

        this.setState(
          {
            positionData: {
              ...this.state.positionData,
              name: e.target.value,
            },
          },
          () => {
            this.formValidation();
          }
        );
        break;
      case "posDescription":
        this.setState(
          {
            positionData: {
              ...this.state.positionData,
              description: e.target.value,
            },
          },
          () => {
            this.formValidation();
          }
        );
        break;

      case "posDepartment":
        if (!onlyAlphabet.test(e.target.value)) {
          return false;
        }
        this.setState(
          {
            positionData: {
              ...this.state.positionData,
              additionalProperties: {
                ...this.state.positionData.additionalProperties,
                Department: e.target.value,
              },
            },
          },
          () => {
            this.formValidation();
          }
        );
        break;

      case "searchRole":
        this.setState(
          {
            roleSearchkeyword: e.target.value,
          },
          () => {
            this.getRoleSearch();
          }
        );
        break;
      default:
        break;
    }
  };

  getRolesList = () => {
    // Get all roles list
    MasterService.getNodesByType("ROLE").then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        this.setState({
          rolesList: response.data.responseData,
          searchRoleList: response.data.responseData,
        });
        if (this.state.mappedRoles) {
          this.state.mappedRoles.map((k, l) => {
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

  getRoleSearch() {
    this.setState({
      searchRoleList: this.state.rolesList.filter(
        (obj) =>
          (obj.name &&
            obj.name
              .toLowerCase()
              .includes(this.state.roleSearchkeyword.toLowerCase())) ||
          (obj.id &&
            obj.id
              .toLowerCase()
              .includes(this.state.roleSearchkeyword.toLowerCase()))
      ),
    });
  }

  selectionToggle = (id) => {
    // Enable multiple selection from the list in the modal
    if (this.state.mappedRoles) {
      this.state.mappedRoles.map((k, l) => {
        this.setState((prevState) => ({
          selectedRoleList: [k.id, ...prevState.selectedRoleList],
        }));
        return null;
      });
    }
    this.setState(
      {
        selectedRoleList: [...this.state.selectedRoleList, id],
      },
      () => {
        this.state.selectedRoleList.forEach((i, j) => {
          if (
            this.state.selectedRoleList.indexOf(i) !== j &&
            this.state.selectedRoleList.includes(id)
          ) {
            if (this.state.selectedRoleList.indexOf(id) > -1) {
              this.state.selectedRoleList.splice(
                this.state.selectedRoleList.indexOf(id),
                1
              );
              this.state.selectedRoleList.splice(
                this.state.selectedRoleList.indexOf(i),
                1
              );
            }
            this.setState({
              selectedRoleList: this.state.selectedRoleList,
            });
          }
        });
      }
    );
  };

  mapRolesToPosition = () => {
    // Map roles to the position
    let mapPayload = {
      parent: "POSITION",
      parentId: this.state.id,
      child: "ROLE",
      childIds: this.state.selectedRoleList,
    };
    MasterService.mapNodes(mapPayload).then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        if (
          this.state.selectedRoleList.length ===
            this.state.mappedRoles.length ||
          this.state.selectedRoleList.length < this.state.mappedRoles.length
        ) {
          Notify.dark("Unmapped successfully");
        } else {
          Notify.dark("Mapped successfully");
        }
        this.setState({
          selectedRoleList: [],
          showActivityLog: true,
        });
        setTimeout(() => {
          this.getRolesMapped(this.state.id, "ROLE");
          if (this.state.id !== 0) {
            this.getPositionsLogs(this.state.id, "POSITION");
          }
        }, 800);
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  getRolesMapped = (id, type) => {
    // To get mapped roles for a position
    MasterService.getChildForParent(id, type).then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        this.setState({
          mappedRoles: response.data.responseData,
        });
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  // Text character counter
  getLetterCount = (event) => {
    if (
      event.target.name === "posDescription" &&
      this.state.positionData.description
    ) {
      this.setState({
        letterCount: 200 - this.state.positionData.description.length,
      });
    }
  };

  // Method to delete an Position
  deleteItem = (id, type) => {
    MasterService.deleteNode(id, type).then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        Notify.dark("Position deleted successfully");
        this.setState({
          getRole: false,
        });
        const pathName =
          this.props.review && this.props.review === "true"
            ? APP.ROUTES_PATH.REVIEW_POSITION
            : APP.COLLECTIONS_PATH.POSITION;
        this.props.history.push({
          pathname: pathName,
          state: {
            isNewPosition: false,
            type: "POSITION",
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

  unmapRole = (id) => {
    if (this.state.mappedRoles) {
      let tempArray = [];
      this.state.mappedRoles.map((i, j) => {
        if (i.id !== id) {
          tempArray.push(i);
        }
        return null;
      });
      this.setState({
        mappedRoles: tempArray,
      });
      tempArray.map((k, l) => {
        this.setState((prevState) => ({
          selectedRoleList: [k.id, ...prevState.selectedRoleList],
        }));
        return null;
      });
      this.setState({
        getRole: false,
      });
    }
  };

  nameAvatar = (value) => {
    let generatedString = value
      .split(/\s/)
      .reduce((res, letter) => (res += letter.slice(0, 1)), "");
    return generatedString;
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
            this.getPositionDetails(
              this.state.id,
              this.props.history.location.state.type
            );
          }
        }
      );
    }
    // }, 300);
  };

  getCurrentDepartment = () => {
    let bytes = CryptoJS.AES.decrypt(
      localStorage.getItem("department"),
      "igotcheckIndia*"
    );
    let originalText = bytes.toString(CryptoJS.enc.Utf8);
    this.setState({
      currentDept: originalText,
    });
  };

  getPositionsLogs = (id, type) => {
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

  searchForDeptOnePOS = () => {
    // Declare variables
    let input, filter, ul, li, i, txtValue;
    if (!this.state.clearSearchInput) {
      this.setState({
        clearSearchDeptPOS: true,
      });
    } else {
      this.setState({
        clearSearchDeptPOS: false,
        clearSearchInputDeptPOS: false,
      });
    }

    input = document.getElementById("deptSearchOne");

    if (input.value.length === 0) {
      this.setState({
        clearSearchDeptPOS: false,
        clearSearchInputDeptPOS: false,
      });
    }

    if (!this.state.clearSearchInputDeptPOS) {
      filter = input.value.toUpperCase();
    } else {
      filter = "";
    }

    ul = document.getElementById("deptListOne");
    li = ul.getElementsByTagName("button");

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      txtValue = li[i].textContent || li[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.department !== this.props.department) {
      this.props.history.push({
        pathname: "/collection-positions/",
        state: {
          isNewPosition: false,
          type: "POSITION",
        },
      });
    }
    if (this.props.match.params.id !== "0") {
      if (prevProps.location.state.id !== this.props.location.state.id) {
        this.setState(
          {
            id: this.props.location.state.id,
            getRole: false,
            letterCount: 200,
            getSelectedRoleID: "",
            searchResultPositions: [],
            showActivityLog: true,
            rating: 0,
            comments: [],
            commentText: "",
            receivedRating: "",
            averageRating: "",
            activityLogs: [],
            mappedRoles: [],
            selectedRoleList: [],
            positionData: {
              name: "",
              description: "",
            },
            positionResponse: {},
            formUpdated: false,
            enableSaveAction: false,
            roleSearchkeyword: "",
            searchRoleList: [],
          },
          () => {
            if (this.state.id !== 0) {
              this.getPositionDetails(
                this.state.id,
                this.props.history.location.state.type
              );
              this.getRolesMapped(this.state.id, "ROLE");
              this.getPositionsLogs(this.state.id, "POSITION");
              this.getPositionSectorList();
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
          positionData: {
            id: "",
            name: "",
            description: "",
          },
          formUpdated: false,
          enableSaveAction: false,
          positionResponse: {},
          mappedRoles: [],
          selectedRoleList: [],
          letterCount: 200,
          searchResultPositions: [],
          showActivityLog: true,
          rating: 0,
          comments: [],
          commentText: "",
          receivedRating: "",
          averageRating: "",
          activityLogs: [],
        });
      }
    }
    // Review
    if (
      this.props.review &&
      this.props.review === "true" &&
      this.props.selectedNodeStatus &&
      this.props.selectedNodeStatus !== this.state.positionData.status
    ) {
      this.setState({
        positionData: {
          ...this.state.positionData,
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
    const posData = this.state.positionData;
    if (
      posData.name &&
      posData.description &&
      ((posData.additionalProperties &&
        posData.additionalProperties.Department) ||
        (!JSON.stringify(this.state.roles).includes(
          APP.USER_ROLES.FRAC_ADMIN
        ) &&
          !JSON.stringify(this.state.roles).includes(
            APP.USER_ROLES.REVIEWER_ONE
          ) &&
          !JSON.stringify(this.state.roles).includes(
            APP.USER_ROLES.REVIEWER_TWO
          )))
    ) {
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
    const posData = JSON.parse(JSON.stringify(this.state.positionData));
    if (
      JSON.stringify(this.state.positionResponse) !== JSON.stringify(posData)
    ) {
      changesDetected = true;
    }
    this.setState({
      formUpdated: changesDetected,
    });
  }

  // Function to get all position sector list
  getPositionSectorList = () => {
    let type = APP.PARAMETERS.SECTOR;
    MasterService.getNodesByType(type).then((response) => {
      if (response && response.status === 200) {
        this.setState({
          sectorList: response.data.responseData,
        });
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  // Function to get all sector list with count
  getPropertyListWithCount = () => {
    this.setState({
      selectedSectorKey: "",
    });
    MasterService.getPropertyListWithCount(APP.PARAMETERS.SECTOR).then(
      (response) => {
        if (response && response.status === 200) {
          this.setState({
            modalList: response.data.responseData.keyValues,
          });
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      }
    );
  };

  // Fucntion to search property
  searchProperty = () => {
    let input, filter, ul, li, a, i, txtValue;
    input = document.getElementById(
      APP.COLLECTIONS.POSITION + APP.FIELD_NAME.SECTOR + "value1"
    );
    if (input) {
      filter = input.value.toUpperCase();
      ul = document.getElementById("caListMain");
      li = ul.getElementsByTagName("h4");

      // Loop through all list items, and hide those who don't match the search query
      for (i = 0; i < li.length; i++) {
        a = li[i];
        txtValue = a.innerHTML;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
          ul.getElementsByTagName("hr")[i].style.display = "";
        } else {
          if (
            this.state.enableSaveAction &&
            this.state.positionData.additionalProperties &&
            this.state.positionData.additionalProperties.sector
          ) {
            li[i].style.display = "";
            ul.getElementsByTagName("hr")[i].style.display = "";
          } else {
            li[i].style.display = "none";
            ul.getElementsByTagName("hr")[i].style.display = "none";
          }
        }
      }
    }
  };

  // Function to get selected position sector details
  getSelectedSectorDetails = () => {
    let payload = {
      type: APP.COLLECTIONS.POSITION,
      filters: [
        {
          field: APP.PARAMETERS.SECTOR,
          values: [this.state.selectedSectorKey],
        },
      ],
    };

    MasterService.filterNodes(payload).then((response) => {
      if (response && response.status === 200) {
        this.setState({
          selectedSectorDetails: response.data.responseData,
        });
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  setPropertyValue = (field, value) => {
    if (field === APP.PARAMETERS.SECTOR) {
      this.setState(
        {
          positionData: {
            ...this.state.positionData,
            additionalProperties: {
              ...this.state.positionData.additionalProperties,
              sector: value,
            },
          },
        },
        () => {
          this.formValidation();
        }
      );
    }
  };

  // Function to handle competency area changes
  onCompetencyAreaChange = (e) => {
    e.preventDefault();
    this.setState({
      newPositionSector: e.target.value,
      enableNewSector: true,
    });
  };

  // Function to create new competency area
  createNewSector = () => {
    let payload = {
      type: APP.PARAMETERS.SECTOR,
      name: this.state.newPositionSector,
    };

    MasterService.addDataNode(payload).then((response) => {
      if (response && response.status === 200) {
        Notify.dark("New position sector is created");
        setTimeout(() => {
          this.getPositionSectorList();
        }, 500);
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  // Function to clear competency sector
  clearPositionSector = () => {
    this.setState(
      {
        positionData: {
          ...this.state.positionData,
          additionalProperties: {
            ...this.state.positionData.additionalProperties,
            sector: undefined,
          },
        },
      },
      () => {
        this.formValidation();
      }
    );
  };

  render() {
    return (
      <div className="row p-0 col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xsl-8 m-0">
        <div
          className={`bordered custom-full-height-4 custom-body-bg ${
            this.state.getRole || this.state.showActivityLog
              ? "col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8"
              : "col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
          }`}
          id="masterColumn3"
        >
          {/* <div> */}
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
                        {this.state.positionData.status !==
                          APP.NODE_STATUS.DRAFT && (
                          <React.Fragment>
                            {(!this.state.positionData.secondaryStatus ||
                              this.state.positionData.secondaryStatus ===
                                APP.NODE_STATUS.UNVERIFIED) && (
                              <React.Fragment>
                                {this.state.positionData.status &&
                                this.state.positionData.status ===
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
                                    this.state.positionData.status ===
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
                            {this.state.positionData.secondaryStatus &&
                              this.state.positionData.secondaryStatus ===
                                APP.NODE_STATUS.VERIFIED && (
                                <p className="status-verified status-text">
                                  Verified
                                </p>
                              )}
                            {this.state.positionData.secondaryStatus &&
                              this.state.positionData.secondaryStatus ===
                                APP.NODE_STATUS.REJECTED && (
                                <p className="status-rejected status-text">
                                  Rejected
                                </p>
                              )}
                          </React.Fragment>
                        )}
                        {this.state.positionData.status ===
                          APP.NODE_STATUS.DRAFT && (
                          <p className="status-draft status-text">Draft</p>
                        )}
                      </div>
                    ) : (
                      // similar competency
                      <React.Fragment>
                        {this.state.searchResultPositions[0] &&
                        this.state.searchResultPositions[0].length > 0 ? (
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
                              {this.state.searchResultPositions[0].length}{" "}
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
                    (!this.props.review || this.props.review === "false") && (
                      <React.Fragment>
                        <div className="d-inline-block">
                          {this.state.formUpdated && this.state.showFeedback && (
                            <div id="feedback-btn" className="col-6">
                              <RatingAndFeedback {...this.props} />
                            </div>
                          )}

                          {this.state.formUpdated && !this.state.showFeedback && (
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
                  {((this.state.formUpdated && this.state.enableSaveAction) ||
                    (this.state.positionData &&
                      this.state.positionData.status &&
                      this.state.positionData.status ===
                        APP.NODE_STATUS.DRAFT)) && (
                    <button
                      type="button"
                      className={`btn save-button mt-sm-2 mt-md-2 mt-lg-0 mr-3
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
                            this.savePosition();
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
                    (!this.props.review || this.props.review === "false") && (
                      <button
                        type="button"
                        className={`btn save-button custom-primary-button mt-sm-2 mt-md-2 mr-3 mt-0 `}
                        onClick={() => {
                          this.setState(
                            {
                              saveAsDraft: true,
                            },
                            () => {
                              this.savePosition();
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
          {this.state.positionData &&
            ((this.state.positionData.status &&
              this.state.positionData.status === APP.NODE_STATUS.REJECTED &&
              this.state.positionData.reviewComments) ||
              (this.state.positionData.secondaryStatus &&
                this.state.positionData.secondaryStatus ===
                  APP.NODE_STATUS.REJECTED &&
                this.state.positionData.secondaryReviewComments)) && (
              <div className="row mb-3">
                <div className="col-8">
                  <div className="review-comment-box-1">
                    <label>Reviewer’s comment</label>
                    <p>
                      {this.state.positionData.secondaryReviewComments
                        ? this.state.positionData.secondaryReviewComments
                        : this.state.positionData.reviewComments}
                    </p>
                  </div>
                </div>
              </div>
            )}
          <form onSubmit={this.savePosition}>
            <div className="row">
              <label className="col-xl-4 col-12">Position ID</label>
              <div className="col-xl-8 col-12 mb-4">
                <input
                  type="text"
                  id="expertID"
                  className="form-control"
                  placeholder="PID"
                  aria-label="id"
                  value={this.state.positionData.id || ""}
                  aria-describedby="basicId"
                  disabled
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xl-4 col-12">
                <label>Position Label*</label>
                <span
                  className="material-icons info-icon pl-2 align-middle pointer-style"
                  data-toggle="tooltip"
                  data-trigger="hover click"
                  title="The position label is the name of the position.It summarises all the associated roles in a succinct manner and gives a sense of where this position is placed in the hierarchy of the MDO s(and thereby leadership expectations from the position)."
                >
                  info
                </span>
              </div>
              <div className="col-xl-8 col-12 mb-4">
                {/* <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 p-0 mb-4 custom-fixed-width"> */}
                <input
                  type="text"
                  id={APP.COLLECTIONS.POSITION + APP.FIELD_NAME.LABEL + "value"}
                  className="form-control"
                  name="posLabel"
                  placeholder="Position Label"
                  aria-label="label"
                  aria-describedby="basicLabel"
                  value={this.state.positionData.name}
                  onChange={this.onPositionChange}
                  autoComplete="off"
                  spellCheck="true"
                  onKeyUp={(event) => this.getSimilarPositions(event)}
                  required
                />
                {/* </div> */}
              </div>
            </div>
            <div className="row">
              <div className="col-xl-4 col-12">
                <label>Position Description</label>
                <span
                  className="material-icons info-icon pl-2 align-middle pointer-style"
                  data-toggle="tooltip"
                  data-trigger="hover click"
                  title="The position description should answer the following: Why does this position exist in the MDO? What are its overall objectives/purpose? And how does it go about achieving its objectives?"
                >
                  info
                </span>
              </div>
              <div className="col-xl-8 col-12 mb-4">
                {/* <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 p-0 mb-1 custom-fixed-width"> */}
                <textarea
                  className="form-control"
                  id={
                    APP.COLLECTIONS.POSITION +
                    APP.FIELD_NAME.DESCRITPION +
                    "value"
                  }
                  name="posDescription"
                  spellCheck="true"
                  rows={
                    this.state.positionData.description &&
                    this.state.positionData.description.length > 200
                      ? this.state.positionData.description.length > 800
                        ? 15
                        : this.state.positionData.description.length / 55
                      : 4
                  }
                  placeholder="Position Description..."
                  value={this.state.positionData.description}
                  onChange={this.onPositionChange}
                  autoComplete="off"
                  onKeyUp={(event) => {
                    if (!this.state.keyCodes.includes(event.keyCode)) {
                      if (event.keyCode === 32) {
                        this.getSimilarPositions(event);
                      }
                    }
                    this.getLetterCount(event);
                  }}
                ></textarea>
                {/* </div> */}
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
            <div className="row">
              <div className="col-xl-4 col-12">
                <label>
                  <span>Ministry, department, organisation (MDO)*</span>
                  <span
                    className="material-icons info-icon pl-2 align-middle pointer-style"
                    data-toggle="tooltip"
                    data-trigger="hover click"
                    title="The ministry, department or organisation this position exists in."
                  >
                    info
                  </span>
                </label>
              </div>
              <div className="col-xl-8 col-12 mb-4">
                {this.state.roles.length > 0 &&
                  (JSON.stringify(this.state.roles).includes(
                    APP.USER_ROLES.FRAC_ADMIN
                  ) ||
                    JSON.stringify(this.state.roles).includes(
                      APP.USER_ROLES.REVIEWER_ONE
                    ) ||
                    JSON.stringify(this.state.roles).includes(
                      APP.USER_ROLES.REVIEWER_TWO
                    )) && (
                    // <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 p-0 custom-fixed-width">
                    <div className="btn-group w-100 p-0">
                      <button
                        type="button"
                        id={
                          APP.COLLECTIONS.POSITION +
                          APP.FIELD_NAME.MDO +
                          "value"
                        }
                        className="btn mb-3 custom-dropdown-menu-3 col-12"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        {(this.state.positionData.additionalProperties &&
                          this.state.positionData.additionalProperties
                            .Department) ||
                          "Select a MDO"}
                      </button>
                      <button
                        type="button"
                        id={
                          APP.COLLECTIONS.POSITION +
                          APP.FIELD_NAME.MDO +
                          "value1"
                        }
                        className="btn dropdown-toggle dropdown-toggle-split mb-3 custom-dropdown-toggle-menu-2"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <span className="sr-only">Toggle Dropdown</span>
                      </button>
                      <div
                        className="dropdown-menu right-dropdown-menu-2 col-12"
                        role="menu"
                        id="dropdownForDeptOne"
                      >
                        <div className="row col-12 p-0 ml-1">
                          <div className="col-9 " id="officerBucketsList">
                            <input
                              type="text"
                              style={{ width: "133%" }}
                              className="form-control mb-3 custom-search-5 form-control-3"
                              placeholder="Search..."
                              aria-label="Search"
                              id="deptSearchOne"
                              onKeyUp={this.searchForDeptOnePOS}
                              aria-describedby="basic-addon1"
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-3">
                            {this.state.clearSearchDeptPOS && (
                              <span
                                className="material-icons competency-area-close-button"
                                onClick={() => {
                                  this.setState(
                                    {
                                      clearSearchInputDeptPOS: true,
                                    },
                                    () => {
                                      document.getElementById(
                                        "deptSearchOne"
                                      ).value = "";
                                      this.searchForDeptOnePOS();
                                    }
                                  );
                                }}
                              >
                                close
                              </span>
                            )}
                          </div>
                        </div>

                        <div id="deptListOne">
                          <button
                            type="button"
                            className="dropdown-item p-1 custom-dropdown-item"
                            onClick={() =>
                              this.setState({
                                positionData: {
                                  ...this.state.positionData,
                                  additionalProperties: {
                                    ...this.state.positionData
                                      .additionalProperties,
                                    Department: "",
                                  },
                                },
                              })
                            }
                          >
                            Select a MDO
                          </button>
                          {this.props.allDepartments &&
                            this.props.allDepartments.map((value, index) => {
                              return (
                                <button
                                  type="button"
                                  key={value.orgName + index}
                                  className="dropdown-item p-1 custom-dropdown-item"
                                  onClick={() =>
                                    this.setState(
                                      {
                                        positionData: {
                                          ...this.state.positionData,
                                          additionalProperties: {
                                            ...this.state.positionData
                                              .additionalProperties,
                                            Department: value.orgName,
                                          },
                                        },
                                      },
                                      () => {
                                        this.formValidation();
                                      }
                                    )
                                  }
                                >
                                  {value.orgName}
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                    //      {/* </div> */}
                  )}
                {(this.state.roles.length === 0 ||
                  this.state.roles.length > 0) &&
                  !JSON.stringify(this.state.roles).includes(
                    APP.USER_ROLES.FRAC_ADMIN
                  ) &&
                  !JSON.stringify(this.state.roles).includes(
                    APP.USER_ROLES.REVIEWER_ONE
                  ) &&
                  !JSON.stringify(this.state.roles).includes(
                    APP.USER_ROLES.REVIEWER_TWO
                  ) && (
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 p-0 custom-fixed-width">
                      <input
                        type="text"
                        id="disabledInput"
                        className="form-control"
                        name="posDepartment"
                        placeholder="MDO"
                        aria-label="dept"
                        aria-describedby="basicDpt"
                        value={this.state.currentDept}
                        disabled
                      />
                    </div>
                  )}
              </div>
            </div>

            {/* sector */}
            <div
              id={APP.COLLECTIONS.POSITION + APP.FIELD_NAME.LABEL}
              className="row"
            >
              <div className="col-xl-4 col-12">
                <label>Position Sector</label>
              </div>
              <div className="col-xl-8 col-12 mb-4">
                <div className="input-group">
                  <input
                    id={
                      APP.COLLECTIONS.POSITION +
                      APP.FIELD_NAME.SECTOR +
                      "value1"
                    }
                    type="text"
                    className="form-control"
                    placeholder="Position Sector"
                    aria-label="label"
                    aria-describedby="basicLabel"
                    value={
                      this.state.positionData.additionalProperties &&
                      this.state.positionData.additionalProperties.sector
                        ? this.state.positionData.additionalProperties.sector
                        : ""
                    }
                    onChange={(event) =>
                      this.setPropertyValue(
                        APP.PARAMETERS.SECTOR,
                        event.target.value
                      )
                    }
                    onKeyUp={this.searchProperty()}
                    name="positionSector"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    autoComplete="off"
                  />
                  {this.state.positionData.additionalProperties &&
                    this.state.positionData.additionalProperties.sector && (
                      <div
                        id={
                          APP.COLLECTIONS.POSITION +
                          APP.FIELD_NAME.SECTOR +
                          "value2"
                        }
                        onClick={this.clearPositionSector}
                      >
                        <span className="competency-area-close-button-2">
                          <label
                            className="pointer-style"
                            style={{ marginTop: "0.40em" }}
                          >
                            Remove
                          </label>
                        </span>
                      </div>
                    )}

                  <div className="dropdown-menu right-dropdown-menu-2 col-12 ca-dropdown">
                    <h4
                      className="dropdown-item p-1 area-dd-header"
                      data-toggle="modal"
                      data-target="#newAreaModal"
                      onClick={() => {
                        this.getPropertyListWithCount();
                      }}
                    >
                      Create new or view all sector
                      <span className="material-icons float-right ca-navigation">
                        navigate_next
                      </span>
                    </h4>
                    <hr />
                    <div id="caListMain">
                      {this.state.sectorList &&
                        this.state.sectorList.map((value, index) => {
                          return (
                            <React.Fragment key={index}>
                              {value && value.name && (
                                <React.Fragment>
                                  <h4
                                    key={index}
                                    className="dropdown-item p-1"
                                    onClick={() =>
                                      this.setState(
                                        {
                                          positionData: {
                                            ...this.state.positionData,
                                            additionalProperties: {
                                              ...this.state.positionData
                                                .additionalProperties,
                                              sector: value.name,
                                            },
                                          },
                                        },
                                        () => {
                                          this.formValidation();
                                          this.searchProperty();
                                        }
                                      )
                                    }
                                  >
                                    {value.name}
                                  </h4>
                                  <hr key={index - 1} />
                                </React.Fragment>
                              )}
                            </React.Fragment>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Modal for competency area, sector */}
            <div
              className="modal fade fadeInUp"
              id="newAreaModal"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="newAreaModalTitle"
              aria-hidden="true"
            >
              <div
                className="modal-dialog modal-dialog-centered modal-lg"
                role="document"
              >
                <div className="modal-content">
                  <div className="row ml-0 w-100">
                    {/* Column one */}
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 pt-2">
                      <div className="modal-header">
                        <h5 className="modal-title" id="newAreaModalLongTitle">
                          Choose position sector
                        </h5>
                      </div>

                      <div className="row col-12">
                        <div className="col-10 mb-1" id="officerBucketsList">
                          <h6>Search by an sector</h6>
                          <input
                            type="text"
                            style={{ paddingLeft: "1.75rem" }}
                            className="form-control mb-3 custom-search-5 custom-search-bar-3 mt-3"
                            placeholder="Search..."
                            name="search"
                            value={this.keyword}
                            id="caSelectionSearch"
                            onKeyUp={this.searchCASelection}
                            autoComplete="off"
                          />
                        </div>
                        <div className="col-2">
                          {this.state.clearSearchCompArea && (
                            <span
                              className="material-icons competency-area-close-button-5"
                              onClick={() => {
                                this.setState(
                                  {
                                    clearSearchInputCompArea: true,
                                  },
                                  () => {
                                    document.getElementById(
                                      "caSelectionSearch"
                                    ).value = "";
                                    this.searchCASelection();
                                  }
                                );
                              }}
                            >
                              close
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="pl-3">
                        {this.state.modalList.length} sectors
                      </p>
                      <div className="modal-body remove-scroll-x">
                        <div id="caListOne">
                          {this.state.modalList &&
                            this.state.modalList.map((i, j) => {
                              return (
                                <dd key={i.key}>
                                  <div className="flex">
                                    <div
                                      className={`col-xs-12 col-sm-12 col-md-8 col-lg-10 col-xl-10 card mb-3 cca-card pointer-style ${
                                        i.key === this.state.selectedSectorKey
                                          ? "on-select-card-3"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        this.setState(
                                          {
                                            selectedSectorKey: i.key,
                                          },
                                          () => this.getSelectedSectorDetails()
                                        )
                                      }
                                    >
                                      <div className="ml-0 pl-2">
                                        <p className="custom-heading-1 card-spacing-1">
                                          {i.key}
                                        </p>
                                        <p className="custom-sub-heading-1 custom-line-height-1">
                                          {i.value + " mappings"}
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
                    {/* Column two */}
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 custom-content-background pt-2">
                      {this.state.selectedSectorKey && (
                        <div className="modal-header">
                          <div className="col-12 p-0">
                            <h6>Sector label</h6>
                            <div className="">
                              <input
                                type="text"
                                id="areaLabel"
                                className="form-control"
                                placeholder="Area Label"
                                aria-label="label"
                                value={this.state.selectedSectorKey}
                                aria-describedby="basicLabel"
                                name="areaLabel"
                                autoComplete="off"
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      {!this.state.selectedSectorKey && (
                        <div className="m-5 vertical-center-6" id="emptyState">
                          <center>
                            <h1 className="pb-2">No sector selected</h1>
                            <p className="pb-2">
                              Choose from the list of sectors
                            </p>
                            <img
                              src="../../img/empty/lists_empty.svg"
                              alt="empty list"
                            ></img>
                          </center>
                        </div>
                      )}
                      <div className="modal-body remove-scroll-x pt-0">
                        {this.state.selectedSectorKey && (
                          <React.Fragment>
                            <h6>Positions in this sector</h6>
                            <button
                              type="button"
                              className="btn save-button-3 mr-2 custom-primary-button mt-2 mb-2"
                              onClick={() =>
                                this.setPropertyValue(
                                  APP.PARAMETERS.SECTOR,
                                  this.state.selectedSectorKey
                                )
                              }
                              data-dismiss="modal"
                            >
                              Add to this position
                            </button>
                            <div id="selectedSectorDetailsList">
                              {this.state.selectedSectorDetails &&
                                this.state.selectedSectorDetails.map((i, j) => {
                                  return (
                                    <dd key={i.id}>
                                      <div className="flex mt-4">
                                        <div className="col-xs-12 col-sm-12 col-md-8 col-lg-10 col-xl-10 card mb-3 cca-card pointer-style competency-border-1">
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
                          </React.Fragment>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <div className="row">
                      <button
                        type="button"
                        className="btn save-button mr-2 custom-primary-button-3"
                        data-dismiss="modal"
                        onClick={() =>
                          this.setState({
                            selectedSectorKey: "",
                            newPositionSector: "",
                          })
                        }
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        className="btn save-button mr-2 custom-primary-button custom-primary-button-3"
                        data-dismiss="modal"
                        data-toggle="modal"
                        data-target="#newCreateAreaModal"
                        onClick={() =>
                          this.setState({
                            selectedSectorKey: "",
                            newPositionSector: "",
                            enableNewSector: false,
                            enableNewSectorAddition: false,
                          })
                        }
                      >
                        Create new sector
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Modal for creating new competency area, sector */}
            <div
              className="modal fade fadeInUp"
              id="newCreateAreaModal"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="newCreateAreaModalTitle"
              aria-hidden="true"
            >
              <div
                className="modal-dialog modal-dialog-centered modal-lg"
                role="document"
              >
                <div className="modal-content">
                  <div className="row ml-0 w-100">
                    {/* Column one */}
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 pt-2">
                      <div className="modal-header">
                        <div className="row">
                          <span
                            className="material-icons back-arrow-1"
                            data-dismiss="modal"
                            data-toggle="modal"
                            data-target="#newAreaModal"
                          >
                            arrow_back
                          </span>
                          <h5
                            className="modal-title"
                            id="newCreateAreaModalLongTitle"
                          >
                            Create a position sector
                          </h5>
                        </div>
                      </div>

                      <div className="modal-body remove-scroll-x">
                        <div id="">
                          <dd>
                            <div className="flex">
                              <div className="col-xs-12 col-sm-12 col-md-8 col-lg-10 col-xl-10 card mb-3 cca-card pointer-style on-select-card-3">
                                <div className="ml-0 pl-2">
                                  <p className="custom-heading-1 card-spacing-1">
                                    {this.state.newPositionSector ||
                                      "*New sector"}
                                  </p>
                                  <p className="custom-sub-heading-1 custom-line-height-1">
                                    0 positions
                                  </p>
                                </div>
                              </div>
                            </div>
                          </dd>
                        </div>
                      </div>
                    </div>

                    {/* Column two */}
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 custom-content-background pt-2">
                      <div className="modal-header">
                        <div className="col-12 p-0">
                          <h6>Sector label*</h6>
                          <div className="">
                            <input
                              type="text"
                              id="newAreaLabel"
                              className="form-control"
                              placeholder="Label"
                              aria-label="label"
                              value={this.state.newPositionSector}
                              onChange={this.onCompetencyAreaChange}
                              aria-describedby="basicLabel"
                              name="newAreaLabel"
                              autoComplete="off"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row ml-3 mb-3">
                        {this.state.enableNewSector && (
                          <React.Fragment>
                            <button
                              type="button"
                              className="btn save-button-3 mr-2 custom-primary-button mb-2"
                              onClick={() =>
                                this.setState(
                                  {
                                    enableNewSectorAddition: true,
                                    enableNewSector: false,
                                  },
                                  () => this.createNewSector()
                                )
                              }
                            >
                              Submit
                            </button>
                            <button
                              type="button"
                              className="btn save-button-3 mb-2 custom-primary-button-3"
                              onClick={() => {
                                this.setState({
                                  newPositionSector: "",
                                  enableNewSector: false,
                                });
                              }}
                            >
                              Discard
                            </button>
                          </React.Fragment>
                        )}

                        {!this.state.enableNewSector && (
                          <React.Fragment>
                            <button
                              type="button"
                              className="btn save-button-3 mr-2 custom-primary-button-disabled mb-2"
                              disabled
                            >
                              Submit
                            </button>
                            <button
                              type="button"
                              className="btn save-button-3 mb-2 custom-primary-button-3"
                              data-dismiss="modal"
                            >
                              Discard
                            </button>
                          </React.Fragment>
                        )}
                      </div>

                      <div className="modal-body remove-scroll-x pt-0">
                        <h6>Positions in this sector</h6>
                        {this.state.enableNewSectorAddition && (
                          <button
                            type="button"
                            className="btn save-button-3 mr-2 custom-primary-button mt-2 mb-2"
                            onClick={() =>
                              this.setPropertyValue(
                                APP.PARAMETERS.SECTOR,
                                this.state.newPositionSector
                              )
                            }
                            data-dismiss="modal"
                          >
                            Add to this position
                          </button>
                        )}

                        {!this.state.enableNewSectorAddition && (
                          <button
                            type="button"
                            className="btn save-button-3 mr-2 custom-primary-button-disabled mt-2 mb-2"
                            disabled
                          >
                            Add to this position
                          </button>
                        )}
                        <div id="roleListTwo">
                          <p className="custom-sub-heading-1 pt-2">
                            No positions are added to this sector yet
                          </p>
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
                        onClick={() =>
                          this.setState({
                            selectedSectorKey: "",
                            newPositionSector: "",
                          })
                        }
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
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
                              positionData: {
                                ...this.state.positionData,
                                name: "",
                                description: "",
                                additionalProperties: {
                                  ...this.state.positionData
                                    .additionalProperties,
                                  Department: "",
                                },
                              },
                              letterCount: 200,
                              saveAsDraft: false,
                              formUpdated: false,
                              enableSaveAction: false,
                            },
                            () => {
                              if (this.state.id !== 0) {
                                this.getPositionDetails(
                                  this.state.id,
                                  "POSITION"
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
                        href="#pills-roles"
                        role="tab"
                        aria-controls="pills-home"
                        aria-selected="true"
                      >
                        Roles
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="tab-content m-2" id="pills-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="pills-roles"
                    role="tabpanel"
                    aria-labelledby="pills-home-tab"
                  >
                    <button
                      type="button"
                      id={APP.COLLECTIONS.POSITION + MAP_ROLE + "value"}
                      className="btn new-secondary-btn mt-2 mb-4"
                      data-toggle="modal"
                      data-target="#newRoleModal"
                      onClick={() => {
                        this.getRolesList();
                        this.setState({
                          getRole: false,
                        });
                      }}
                    >
                      Add Role
                    </button>

                    <div
                      className="modal fade fadeInUp"
                      id="newRoleModal"
                      tabIndex="-1"
                      role="dialog"
                      aria-labelledby="newRoleModalTitle"
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
                                  id="newRoleModalLongTitle"
                                >
                                  Map an existing role
                                </h5>
                              </div>
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
                                    name="searchRole"
                                    value={this.state.roleSearchkeyword}
                                    id="roleSearch"
                                    onChange={this.onPositionChange}
                                    autoComplete="off"
                                  />
                                </div>
                                <div className="col-2">
                                  {this.state.clearSearchRolePOS && (
                                    <span
                                      className="material-icons competency-area-close-button-3"
                                      onClick={() => {
                                        this.setState(
                                          {
                                            clearSearchInputRolePOS: true,
                                          },
                                          () => {
                                            document.getElementById(
                                              "roleSearch"
                                            ).value = "";
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

                              <div className="modal-body remove-scroll-x">
                                <div id="roleList">
                                  {this.state.searchRoleList &&
                                    this.state.searchRoleList.length > 0 && (
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
                                                  <div key={key} style={style}>
                                                    <dd
                                                      key={
                                                        this.state
                                                          .searchRoleList[index]
                                                          .id
                                                      }
                                                    >
                                                      <div className="flex">
                                                        {this.state.selectedRoleList.includes(
                                                          this.state
                                                            .searchRoleList[
                                                            index
                                                          ].id
                                                        ) && (
                                                          <input
                                                            checked
                                                            type="checkbox"
                                                            className="mt-4 mr-3 custom-search-checkbox"
                                                            onChange={() =>
                                                              this.selectionToggle(
                                                                this.state
                                                                  .searchRoleList[
                                                                  index
                                                                ].id
                                                              )
                                                            }
                                                          />
                                                        )}
                                                        {!this.state.selectedRoleList.includes(
                                                          this.state
                                                            .searchRoleList[
                                                            index
                                                          ].id
                                                        ) && (
                                                          <input
                                                            type="checkbox"
                                                            className="mt-4 mr-3 custom-search-checkbox"
                                                            onChange={() =>
                                                              this.selectionToggle(
                                                                this.state
                                                                  .searchRoleList[
                                                                  index
                                                                ].id
                                                              )
                                                            }
                                                          />
                                                        )}
                                                        <div
                                                          className={`col-xs-12 col-sm-12 col-md-8 col-lg-10 col-xl-10 card mb-3 cca-card pointer-style role-border-1 
                                                              ${
                                                                this.state.selectedRoleList.includes(
                                                                  this.state
                                                                    .searchRoleList[
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
                                                              this.selectionToggle(
                                                                this.state
                                                                  .searchRoleList[
                                                                  index
                                                                ].id
                                                              )
                                                            }
                                                          >
                                                            <p
                                                              className="custom-heading-1 card-spacing-1 truncateText"
                                                              title={
                                                                this.state
                                                                  .searchRoleList[
                                                                  index
                                                                ].name
                                                              }
                                                            >
                                                              {
                                                                this.state
                                                                  .searchRoleList[
                                                                  index
                                                                ].name
                                                              }
                                                            </p>
                                                            <p className="custom-sub-heading-1 custom-line-height-1">
                                                              {
                                                                this.state
                                                                  .searchRoleList[
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
                                                this.state.searchRoleList.length
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
                                    id="roleSearchTwo"
                                    onKeyUp={this.searchRoleTwo}
                                    autoComplete="off"
                                  />
                                </div>
                                <div className="col-2">
                                  {this.state.clearSearchRolePOSTwo && (
                                    <span
                                      className="material-icons competency-area-close-button-3"
                                      onClick={() => {
                                        this.setState(
                                          {
                                            clearSearchInputRolePOSTwo: true,
                                          },
                                          () => {
                                            document.getElementById(
                                              "roleSearchTwo"
                                            ).value = "";
                                            this.searchRoleTwo();
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
                                <div id="roleListTwo">
                                  {this.state.mappedRoles &&
                                    this.state.mappedRoles.map((i, j) => {
                                      return (
                                        <dd key={i.id}>
                                          <div className="flex">
                                            <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10 card mb-3 cca-card role-border-1">
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
                                    pathname: "/collection-roles/0",
                                    state: {
                                      isNewRole: true,
                                      id: 0,
                                      type: "ROLE",
                                    },
                                  })
                                }
                              >
                                Create a new Role
                              </button>
                              <button
                                type="button"
                                className="btn save-button mr-2 custom-primary-button"
                                data-dismiss="modal"
                                onClick={this.mapRolesToPosition}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {this.state.mappedRoles &&
                      this.state.mappedRoles.length > 0 && (
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
                              id="roleMappedSearch"
                              onKeyUp={this.searchMappedRole}
                              autoComplete="off"
                            />
                          </div>
                          <div className="col-2">
                            {this.state.clearSearchMappedRolePOS && (
                              <span
                                className="material-icons competency-area-close-button-3"
                                onClick={() => {
                                  this.setState(
                                    {
                                      clearSearchInputMappedRolePOS: true,
                                    },
                                    () => {
                                      document.getElementById(
                                        "roleMappedSearch"
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
                      )}

                    <div id="mappedRolesList">
                      <div className="row col-12">
                        {this.state.mappedRoles &&
                          this.state.mappedRoles.map((value, index) => {
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
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="newDeleteLongTitle">
                    Do you want to delete this Position?
                  </h5>
                </div>
                <div className="modal-body remove-scroll-x">
                  <p>
                    The selected Position details and all the mapping related to
                    this Position will be deleted.
                  </p>
                </div>
                <div className="modal-footer">
                  <div className="row">
                    <button
                      type="button"
                      className="btn save-button mr-2 danger-button-1"
                      data-dismiss="modal"
                      onClick={() =>
                        this.deleteItem(this.state.positionData.id, "POSITION")
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
          {/* </div> */}
        </div>

        {this.state.getRole && (
          <ColumnFive
            {...this.props}
            roleId={this.state.getSelectedRoleID}
            type="ROLE"
            childType={["ACTIVITY", "COMPETENCY"]}
            parentType={["POSITION"]}
            selectionFunction={this.unmapRole}
            unMapFunction={this.mapRolesToPosition}
            btnText="Jump to Role"
            url="/collection-roles/"
            stateDataKey="isNewRole"
            searchBarStyle="custom-search-bar-3"
            customHeight="custom-full-height-4"
          />
        )}
        {this.state.showActivityLog && (
          <ColumnSix
            {...this.props}
            customHeight="custom-full-height-4"
            activityLogs={this.state.activityLogs}
            nodeData={this.state.positionData}
            activeTabId={this.state.columnSixTabRef}
            searchData={this.state.searchResultPositions}
            searchHeading="Similar positions"
            emptyMessage="Similar positions will come up here based on what you type in the form fields"
            searchClass="position-border-1"
            searchClass2="role-border-1"
            type="POSITION"
            btnText="Jump to Position"
            url="/collection-positions/"
            stateDataKey="isNewPosition"
            actioBtnText="Copy info to new position"
            titleSecondary="Roles"
            functionName="getChildForParent"
            receiveData={this.receiveData}
            ref={this.checkClickTwo}
            onClick={(event) => this.checkClickActivityTwo(event)}
          />
        )}
      </div>
    );
  }
}

export default ColumnThree;
export { ColumnThree };
