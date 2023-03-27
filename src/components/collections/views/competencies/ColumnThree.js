import React from "react";
import { MasterService } from "../../../../services/master.service";
import { DashboardService } from "../../../../services/dashboard.service";
import Notify from "../../../../helpers/notify";
import { APP } from "../../../../constants";
import ColumnFive from "../positions/ColumnFive";
import ColumnSix from "../positions/ColumnSix";
import CryptoJS from "crypto-js";
import RatingAndFeedback from "../common/RatingAndFeedback";
import { capitalize } from "lodash";

const competencyType = ["Behavioural", "Domain", "Functional"]
const competencyLevels = [{ name: "5 levels", count: 5 }, { name: "4 levels", count: 4 }, { name: "3 levels", count: 3 }]
const sampleLevels = [
  {
    id: 1,
    label: "Basic",
    description: "Possesses basic knowledge and skills related to some elements of the competency and is able to apply them with moderate supervision"
  },
  {
    id: 2,
    label: "Proficient",
    description: "Able to demonstrate knowledge and skills related to most of the elements of the competency and apply them without need for constant supervision"
  },
  {
    id: 3,
    label: "Advanced",
    description: "Possesses strong knowledge and skills required for the competency and demonstrates an understanding of the interlinkages between competencies. Acts as an advisor on the topic, often producing manuals/notes to support colleagues."
  },
  {
    id: 4,
    label: "Expert",
    description: "Demonstrates excellence in all capabilities related to the competency compared to best industry benchmarks within the country. Is a person of authority on practices and/or systems related to the competency and is widely consulted on the same."
  },
  {
    id: 5,
    label: "Ustad",
    description: "Demonstrates complete mastery of the competency and use of it in unprecedented ways. Has a fundamental, outsized impact on their field of knowledge with few other people having similar capabilities."
  }
]
const defaultState = {
  id: "",
  roles: "",
  competencyData: {
    name: "",
    description: "",
    additionalProperties: {},
    children: []
  },
  competencyResponse: {
    name: "",
    description: "",
    additionalProperties: {},
    children: []
  },
  mappedRoles: [],
  mappedCL: [],
  activityLogs: [],
  caList: [],
  competencyAreaCount: 0,
  letterCount: 200,
  showActivityLog: true,
  getRole: false,
  getSelectedRoleID: "",
  searchResult: [],
  keyCodes: [8, 46, 37, 39, 38, 40],
  allDepartments: "",
  selectedCAKey: "",
  selectedCADetails: [],
  newCompetencyArea: "",
  enableNewCA: false,
  enableNewCAAddition: false,
  clearSearchMappedRoles: false,
  clearSearchInputMappedRoles: false,
  clearSearchDept: false,
  clearSearchInputDept: false,
  clearSearchCompArea: false,
  clearSearchInputCompArea: false,
  enableSaveAction: false,
  accessibleField: [],
  formUpdated: false,
  count: 0,
  validNode: false,
  competencyLevelCount: 0,
  mappedLevelCount: 0,
  sampleLevelCount: 5,
  sourceName: "",
  sourceURL: "",
  selectedSource: {},
  showFeedback: false,
  editSourceIndex: 0,
  columnSixTabRef: "",
  sectorList: [],
  modalList: [],
  modalName: ''
};

const formFields = [
  APP.FIELD_NAME.LABEL,
  APP.FIELD_NAME.DESCRITPION,
  APP.FIELD_NAME.COMP_TYPE,
  APP.FIELD_NAME.COD,
  APP.FIELD_NAME.COMP_AREA,
  APP.FIELD_NAME.COMP_LEVEL,
  APP.FIELD_NAME.COMP_SOURCE,
  APP.FIELD_NAME.SECTOR
]

class ColumnThree extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...JSON.parse(JSON.stringify(defaultState)) }
    this.saveCompetencies = this.saveCompetencies.bind(this);
    this.onCompetencyChange = this.onCompetencyChange.bind(this);
    this.getCompetencyDetails = this.getCompetencyDetails.bind(this);
    this.getSimilarCompetencies = this.getSimilarCompetencies.bind(this);
    this.receiveData = this.receiveData.bind(this);
    this.getLetterCount = this.getLetterCount.bind(this);
    this.getRolesMapped = this.getRolesMapped.bind(this);
    this.selectedRole = this.selectedRole.bind(this);
    this.searchMappedRoles = this.searchMappedRoles.bind(this);
    this.onCompetencyLevelChange = this.onCompetencyLevelChange.bind(this);
    this.getMappedCL = this.getMappedCL.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.checkAccess = this.checkAccess.bind(this);
    this.getAllDepartments = this.getAllDepartments.bind(this);
    this.clearCompetencyArea = this.clearCompetencyArea.bind(this);
    this.clearCompetencySector = this.clearCompetencySector.bind(this);
    this.getCompetencyAreaList = this.getCompetencyAreaList.bind(this);
    this.getSelectedCADetails = this.getSelectedCADetails.bind(this);
    this.onPositionSectorChange = this.onPositionSectorChange.bind(this);
    this.createNewCA = this.createNewCA.bind(this);
    this.searchCASelection = this.searchCASelection.bind(this);
    this.resetHandler = this.resetHandler.bind(this);
    this.getActivityLogs = this.getActivityLogs.bind(this);
    this.getPropertyListWithCount = this.getPropertyListWithCount.bind(this);
    this.searchProperty = this.searchProperty.bind(this);
    this.setModalValues = this.setModalValues.bind(this);
    this.setPropertyValue = this.setPropertyValue.bind(this);
  }

  componentDidMount() {
    if (this.props.history.location.state) {
      this.checkAccess();
      // edit competency
      if (this.props.history.location.state.id !== "0" && this.props.history.location.state.id !== 0) {
        this.loadCompetencyData(this.props.history.location.state.id);
      } else {
        this.setState({
          // showActivityLog: false
        })
        this.competencyLevelSelection(5);
      }
    }
    this.checkAccess();
    this.getCompetencyAreaList();
    this.getCompetencySectorList();
  }

  loadCompetencyData(id) {
    if (this.state.id !== 0) {
      this.setState(
        {
          id: id,
        },
        () => {
          this.getCompetencyDetails(this.state.id, APP.COLLECTIONS.COMPETENCY);
          this.getRolesMapped(this.state.id, APP.COLLECTIONS.ROLE);
          this.getActivityLogs(this.state.id, APP.COLLECTIONS.COMPETENCY);

        }
      );
    } else {
      this.updateFormFieldAccess();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.department !== this.props.department) {
      this.props.history.push({
        pathname: APP.COLLECTIONS_PATH.COMPETENCY,
        state: {
          isNewCompetency: false,
          type: APP.COLLECTIONS.COMPETENCY,
        },
      });
    }
    if (prevProps.location.state.id !== this.props.location.state.id) {
      if (document.getElementById("competencyForm")) {
        document.getElementById("competencyForm").reset();
      }
      this.setState({
        ...JSON.parse(JSON.stringify(defaultState)),
        id: this.props.location.state.id
      }, () => {
        this.checkAccess();
        if (this.props.location.state.id !== "0" && this.props.location.state.id !== 0) {
          this.loadCompetencyData(this.props.location.state.id)
        } else {
          this.setState({
            // showActivityLog: false
          })
          this.competencyLevelSelection(5);
        }
        this.getCompetencyAreaList();
        this.getCompetencySectorList();
        this.updateFormFieldAccess();
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

    if (document.getElementById("masterColumn3")) {
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
          if (this.state.getRole === true) {
            this.resetHandler();
          }
        });
    }

    // Review
    if (
      this.props.review &&
      this.props.review === "true" &&
      this.props.selectedNodeStatus &&
      this.state.competencyData &&
      this.props.selectedNodeStatus !== this.state.competencyData.status
    ) {
      this.setState({
        competencyData: {
          ...this.state.competencyData,
          status: this.props.selectedNodeStatus,
        },
      });
    }
  }

  resetHandler = () => {
    this.setState({
      getRole: false,
      showActivityLog: (this.props.location.state.id !== "0" && this.props.location.state.id !== 0) ? true : false,
      getSelectedRoleID: "",
    });
  };

  // Function to get competency details by id and type
  getCompetencyDetails = (id, type) => {
    if (id !== 0 && id !== "0") {
      MasterService.getDataByNodeId(id, type).then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState(
            {
              competencyResponse: response.data.responseData,
              competencyData: JSON.parse(JSON.stringify(response.data.responseData)),
            },
            () => {
              this.updateFormFieldAccess();
              this.getMappedCL(this.state.id, APP.COLLECTIONS.COMPETENCY_LEVEL);
              this.formValidation();

              if (this.props.review || this.props.review === "true") {
                const event = { target: { name: "competencyLabel" }, custom: true }
                this.getSimilarCompetencies(event);
              }

              if (this.state.competencyData.description) {
                this.setState({
                  letterCount:
                    this.state.letterCount -
                    this.state.competencyData.description.length,
                });
              }
            }
          );
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });
    } else {
      this.formValidation();
    }
  };

  // Function to get mapped roles
  getRolesMapped = (id, type) => {
    MasterService.getParentNode(id, type).then((response) => {
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

  // Function to get mapped competency levels
  getMappedCL = (id, type) => {
    MasterService.getChildForParent(id, type).then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        if (response.data.responseData.length < 3) {
          for (let i = response.data.responseData.length; i < sampleLevels.length; i++) {
            const levelObj = {
              description: undefined,
              level: "Level " + (response.data.responseData.length + 1),
              name: sampleLevels[response.data.responseData.length].label,
              type: APP.COLLECTIONS.COMPETENCY_LEVEL
            }
            response.data.responseData.push(levelObj)
          }
        }
        if (response.data.responseData) {
          // sorting by level id
          response.data.responseData.sort((a, b) => {
            if (a.level < b.level) {
              return -1;
            } else {
              return 1;
            }
          })
          this.setState({
            validNode: this.formValidation(),
            mappedLevelCount: response.data.responseData.length,
            mappedCL: response.data.responseData,
            // make the default levels count to 5
            competencyLevelCount: response.data.responseData.length > 3 ? (response.data.responseData.length > 4 ? 5 : 4) : 3,
            competencyResponse: {
              ...this.state.competencyResponse,
              children: JSON.parse(JSON.stringify(response.data.responseData)),
            }
          }, () => {
            this.updateFormFieldAccess();
            this.formValidation();
          });
        }
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  // Get activity logs
  getActivityLogs = (id, type) => {
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

  // Function to check access for the features
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
          this.getAllDepartments();
        }
      );
    }
    // }, 300);
  };

  // Function to get all MDO
  getAllDepartments = () => {
    if (!this.state.allDepartments) {
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

  // Function to get all competency area list
  getCompetencyAreaList = () => {
    let type = APP.PARAMETERS.COMPETENCY_AREA;
    MasterService.getNodesByType(type).then((response) => {
      if (response && response.status === 200) {
        this.setState({
          caList: response.data.responseData,
          competencyAreaCount: response.data.responseData.length,
        });
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  // Function to get all competency sector list
  getCompetencySectorList = () => {
    let type = APP.PARAMETERS.SECTOR;
    MasterService.getNodesByType(type).then((response) => {
      if (response && response.status === 200) {
        this.setState({
          sectorList: response.data.responseData,
          competencyAreaCount: response.data.responseData.length,
        });
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  // To get similar competency while typing nam & description
  getSimilarCompetencies = (event) => {
    if (event && !event.custom) {
      event.preventDefault();
    }
    let searchfield, searchkeyword;
    // name
    if (event.target.name === "competencyLabel" &&
      this.state.competencyData.name.length > 1
    ) {
      searchfield = "name";
      searchkeyword = this.state.competencyData.name;
    }
    //description
    if (event.target.name === "competencyDescription" &&
      this.state.competencyData.description.length > 1
    ) {
      searchfield = "description";
      searchkeyword = this.state.competencyData.description;
    }

    let searchPayload = {
      searches: [
        {
          type: APP.COLLECTIONS.COMPETENCY,
          field: searchfield,
          keyword: searchkeyword,
        },
      ],
    };
    if (searchfield) {
      if (!event.custom) {
        this.setState({
          columnSixTabRef: APP.PARAMETERS.SIMILAR_ITEM_TAB_REF
        });
      }
      MasterService.searchNodes(searchPayload).then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState(
            {
              searchResult: [],
            },
            () => {
              const resultSet = [];
              response.data.responseData.forEach(searchObj => {
                if (searchObj.id !== this.state.competencyData.id) {
                  resultSet.push(searchObj);
                }
              });
              this.setState({
                searchResult: [
                  ...this.state.searchResult,
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
        searchResult: [],
      });
    }
  };

  saveCompetencies = (e) => {
    if (e) {
      e.preventDefault();
    }
    let competencyPayload = {
      type: APP.COLLECTIONS.COMPETENCY,
      source: "FRAC",
      additionalProperties: {}
    }

    if (this.state.id && this.state.id !== "0") {
      competencyPayload.id = this.state.id
    }

    if (this.props.review && this.props.review === "true"
      && this.state.accessibleField && this.state.accessibleField.length > 0) {

      this.state.accessibleField.map((fieldName) => {
        if (fieldName === APP.FIELD_NAME.LABEL || fieldName === APP.FIELD_NAME.NAME) {
          competencyPayload.name = this.state.competencyData.name
        }
        if (fieldName === APP.FIELD_NAME.DESCRITPION) {
          competencyPayload.description = this.state.competencyData.description
        }
        if (fieldName === APP.FIELD_NAME.COMP_TYPE) {
          competencyPayload.additionalProperties.competencyType = this.state.competencyData.additionalProperties.competencyType
        }
        if (fieldName === APP.FIELD_NAME.COD) {
          competencyPayload.additionalProperties.cod = this.state.competencyData.additionalProperties.cod
        }
        if (fieldName === APP.FIELD_NAME.COMP_AREA) {
          competencyPayload.additionalProperties.competencyArea = this.state.competencyData.additionalProperties.competencyArea
        }
        if (fieldName === APP.FIELD_NAME.SECTOR) {
          competencyPayload.additionalProperties.competencySector = this.state.competencyData.additionalProperties.competencySector
        }
        if (fieldName === APP.FIELD_NAME.COMP_LEVEL && this.state.mappedCL) {
          const mappedLevels = [];
          for (let i = 0; i < this.state.competencyLevelCount; i++) {
            mappedLevels.push(this.state.mappedCL[i]);
          }
          competencyPayload.children = mappedLevels
        }
        return null;
      });

    } else {
      competencyPayload.name = this.state.competencyData.name
      competencyPayload.description = this.state.competencyData.description
      competencyPayload.additionalProperties = this.state.competencyData.additionalProperties;

      if (this.state.saveAsDraft) {
        competencyPayload.status = APP.NODE_STATUS.DRAFT
      }
      if (this.state.mappedCL) {
        const mappedLevels = [];
        for (let i = 0; i < this.state.competencyLevelCount; i++) {
          mappedLevels.push(this.state.mappedCL[i]);
        }
        competencyPayload.children = mappedLevels
      }

    }
    MasterService.postBulkData(competencyPayload).then((response) => {
      this.addUpdateCompetencyResponseHandler(response);
    });
  }

  // Method to handle the repsonse of add, update competency API call
  addUpdateCompetencyResponseHandler(response) {
    if (
      response &&
      response.data.statusInfo.statusCode === APP.CODE.SUCCESS
    ) {
      if (this.state.id === 0) {
        Notify.dark("Competency created successfully");
      } else {
        Notify.dark("Competency updated successfully");
      }

      this.setState(
        {
          id: response.data.responseData.id,
          competencyResponse: JSON.parse(JSON.stringify(response.data.responseData)),
          competencyData: JSON.parse(JSON.stringify(response.data.responseData)),
          enableSaveAction: false,
          getRole: false,
          saveAsDraft: false,
          activityLogs: [],
          validNode: this.formValidation()
        }, () => {
          this.getMappedCL(this.state.id, APP.COLLECTIONS.COMPETENCY_LEVEL);
        });

      setTimeout(() => {
        this.getActivityLogs(response.data.responseData.id, APP.COLLECTIONS.COMPETENCY);
      }, 800);

      setTimeout(() => {
        if (response.data.responseData.id !== 0) {
          const pathName =
            this.props.review && this.props.review === "true"
              ? APP.ROUTES_PATH.REVIEW_COMPETENCY
              : APP.COLLECTIONS_PATH.COMPETENCY;
          this.props.history.push({
            pathname: pathName + response.data.responseData.id,
            state: {
              isNewCompetency: false,
              id: response.data.responseData.id,
              type: APP.COLLECTIONS.COMPETENCY,
              stayOn: true,
              showColumnThree: true,
            },
          });
        }
      }, 775);
    } else {
      Notify.error(response && response.data.statusInfo.errorMessage);
    }
  }

  updateFormFieldAccess() {
    let disable = false;
    if (this.state.id && this.state.competencyData.secondaryStatus
      && this.state.competencyData.secondaryStatus === APP.NODE_STATUS.VERIFIED
      && !this.state.roles.includes("FRAC_ADMIN") && !this.state.roles.includes("FRAC_REVIEWER_L2")) {
      disable = true;
    }

    formFields.forEach(field => {
      let elementId = [];
      if (field === APP.FIELD_NAME.COMP_TYPE || field === APP.FIELD_NAME.COMP_LEVEL) {
        let elementId1 = [];
        const list = (field === APP.FIELD_NAME.COMP_TYPE) ? competencyType : sampleLevels;
        list.forEach((level, index) => {
          elementId.push(APP.COLLECTIONS.COMPETENCY + field + "value" + index);
          elementId1.push(APP.COLLECTIONS.COMPETENCY + field + "value1" + index);

          if (field === APP.FIELD_NAME.COMP_LEVEL) {
            elementId.push(APP.COLLECTIONS.COMPETENCY + field + "name" + index);
            elementId.push(APP.COLLECTIONS.COMPETENCY + field + "description" + index);
          }
        });

        elementId1.forEach(id => {
          const element = document.getElementById(id);
          if (element) {
            if (element) {
              element.style.pointerEvents = disable ? "none" : "auto";
            }
          }
        });
      } else if (field === APP.FIELD_NAME.COD) {
        elementId = [
          APP.COLLECTIONS.COMPETENCY + field + "value1",
          APP.COLLECTIONS.COMPETENCY + field + "value2",
        ]
      } else if (field === APP.FIELD_NAME.COMP_AREA) {
        elementId = [APP.COLLECTIONS.COMPETENCY + field + "value1"]
        const elementId1 = APP.COLLECTIONS.COMPETENCY + field + "value2";
        const element = document.getElementById(elementId1);
        if (element) {
          element.style.display = disable ? "none" : "auto";
        }
      } else if (field === APP.FIELD_NAME.COMP_SOURCE) {
        elementId = [
          APP.COLLECTIONS.COMPETENCY + APP.FIELD_NAME.COMP_SOURCE + "value1",
          APP.COLLECTIONS.COMPETENCY + APP.FIELD_NAME.COMP_SOURCE + "value2"
        ];
      } else {
        elementId = [APP.COLLECTIONS.COMPETENCY + field + "value"];
      }

      elementId.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          element.disabled = disable;
        }
      });
    });
  }

  // Function to retrieve data from props
  receiveData = (name, description) => {
    if (name && description) {
      this.setState(
        {
          competencyData: {
            ...this.state.competencyData,
            name: name,
            description: description,
          },
        },
        () => {
          this.setState({
            letterCount: 200 - this.state.competencyData.description.length,
          });
        }
      );
    }
  };

  // Method to delete an Competency
  deleteItem = (id, type) => {
    MasterService.deleteNode(id, type).then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        Notify.dark("Competency deleted successfully");
        const pathName =
          this.props.review && this.props.review === "true"
            ? APP.ROUTES_PATH.REVIEW_COMPETENCY
            : APP.COLLECTIONS_PATH.COMPETENCY;
        this.props.history.push({
          pathname: pathName,
          state: {
            isNewCompetency: false,
            type: APP.COLLECTIONS.COMPETENCY,
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

  // Letter counter for competency description
  getLetterCount = (event) => {
    if (event.target.name === "competencyDescription") {
      this.setState({
        letterCount: 200 - this.state.competencyData.description.length,
      });
    }
  };

  // Function to update competency
  onCompetencyChange = (e) => {
    e.preventDefault();
    let onlyAlphabet = /^[/+#\-_()., A-Za-z ]*$/;
    switch (e.target.name) {
      case "competencyLabel":
        if (!onlyAlphabet.test(e.target.value)) {
          return false;
        }
        this.setState(
          {
            competencyData: {
              ...this.state.competencyData,
              name: e.target.value,
            },
          }, () => {
            this.formValidation();
          });
        break;
      case "competencyDescription":
        this.setState(
          {
            competencyData: {
              ...this.state.competencyData,
              description: e.target.value,
            },
          }, () => {
            this.formValidation();
          });
        break;
      case "competencySector":
        this.setState({
          competencyData: {
            ...this.state.competencyData,
            additionalProperties: {
              ...this.state.competencyData.additionalProperties,
              competencySector: e.target.value,
            }
          }
        }, () => {
          this.formValidation();
        })
        break;
      default:
        break;
    }
  };

  // Function to update competency level
  onCompetencyLevelChange = (e, index) => {
    e.preventDefault();
    switch (e.target.name) {
      case "competencyLevelLabel":
        let CLevel = this.state.mappedCL[index];
        CLevel.name = e.target.value;
        break;
      case "competencyLevelDescription":
        let CLevel1 = this.state.mappedCL[index];
        CLevel1.description = e.target.value.replaceAll("• ", "");
        break;
      default:
        break;
    }
    this.formValidation();
  };

  competencyLevelSelection(count) {
    this.setState({
      competencyLevelCount: count
    }, () => {
      if (this.state.mappedCL) {
        this.setState({
          mappedCL: JSON.parse(JSON.stringify(this.state.competencyResponse.children))
        }, () => {
          if (this.state.mappedCL.length > this.state.competencyLevelCount) {
            this.setState({
              mappedCL: this.state.mappedCL.filter(((obj, index) => index < this.state.competencyLevelCount)),
            })
          } else {
            let compLevels = this.state.mappedCL;
            for (let i = this.state.mappedCL.length; i < this.state.competencyLevelCount; i++) {
              const levelObj = {
                name: sampleLevels[i].label,
                description: "",
                level: "Level " + (i + 1),
                type: APP.COLLECTIONS.COMPETENCY_LEVEL
              }
              compLevels.push(levelObj);
            }
            this.setState({
              mappedCL: compLevels
            })
          }
        })
      }
      this.formValidation();
    });
  }

  addSource() {
    const sourceObj = {
      name: this.state.sourceName,
      value: this.state.sourceURL
    }
    const compData = this.state.competencyData
    if (!compData.additionalProperties) {
      compData.additionalProperties = {
        competencySource: [sourceObj]
      }
    } else if (!compData.additionalProperties.competencySource) {
      compData.additionalProperties = {
        ...this.state.competencyData.additionalProperties,
        competencySource: [sourceObj]
      }
    } else {
      compData.additionalProperties.competencySource.push(sourceObj);
    }
    this.setState({
      sourceName: "",
      sourceURL: "",
      competencyData: compData
    }, () => {
      this.formValidation();
    })
  }

  deleteSourceURL() {
    if (this.state.selectedSource && this.state.competencyData.additionalProperties) {
      this.setState({
        competencyData: {
          ...this.state.competencyData,
          additionalProperties: {
            ...this.state.competencyData.additionalProperties,
            competencySource: this.state.competencyData.additionalProperties.competencySource.filter((obj => obj !== this.state.selectedSource)),
          }
        }
      }, () => {
        this.formValidation();
      })
    }
  }

  // Function to handle selected role for mapping
  selectedRole = (id) => {
    this.setState({
      getRole: true,
      getSelectedRoleID: id,
    });
  };

  searchMappedRoles = () => {
    // To search for a role from the mapped role list for a position
    // Declare variables
    let input, filter, ul, li, a, i, txtValue;
    if (!this.state.clearSearchInputMappedRoles) {
      this.setState({
        clearSearchMappedRoles: true,
      });
    } else {
      this.setState({
        clearSearchMappedRoles: false,
        clearSearchInputMappedRoles: false,
      });
    }

    input = document.getElementById("mappedRoleSearch");

    if (input.value.length === 0) {
      this.setState({
        clearSearchMappedRoles: false,
        clearSearchInputMappedRoles: false,
      });
    }

    if (!this.state.clearSearchInputMappedRoles) {
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

  // Function to clear competency area
  clearCompetencyArea = () => {
    this.setState(
      {
        competencyData: {
          ...this.state.competencyData,
          additionalProperties: {
            ...this.state.competencyData.additionalProperties,
            competencyArea: undefined
          }
        }
      }, () => {
        this.formValidation();
      });
  };

  // Function to clear competency sector
  clearCompetencySector = () => {
    this.setState(
      {
        competencyData: {
          ...this.state.competencyData,
          additionalProperties: {
            ...this.state.competencyData.additionalProperties,
            sector: undefined
          }
        }
      }, () => {
        this.formValidation();
      });
  };


  // FUncation to set values for populating modal form
  setModalValues = (modalName) => {
    this.setState({
      modalName: modalName,
      selectedCAKey: ''
    }, () => {
      if (this.state.modalName === APP.PARAMETERS.AREA) {
        this.getPropertyListWithCount(APP.PARAMETERS.COMPETENCY_AREA);
      } else if (this.state.modalName === APP.PARAMETERS.SECTOR) {
        this.getPropertyListWithCount(APP.PARAMETERS.SECTOR);
      }
    })
  }

  // Function to get all sector, area list with count
  getPropertyListWithCount = (type) => {
    MasterService.getPropertyListWithCount(type).then((response) => {
      if (response && response.status === 200) {
        this.setState({
          modalList: response.data.responseData.keyValues,
        });
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  // Function to get selected competency area details
  getSelectedCADetails = () => {
    let payload = {
      type: APP.COLLECTIONS.COMPETENCY,
      filters: [
        {
          field: this.state.modalName,
          values: [this.state.selectedCAKey],
        },
      ],
    };

    MasterService.filterNodes(payload).then((response) => {
      if (response && response.status === 200) {
        this.setState({
          selectedCADetails: response.data.responseData,
        });
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  // Function to handle competency area changes
  onPositionSectorChange = (e) => {
    e.preventDefault();
    this.setState({
      newCompetencyArea: e.target.value,
      enableNewCA: true,
    });
  };

  // Function to create new competency area
  createNewCA = () => {
    let requestType = ''
    if (this.state.modalName === APP.PARAMETERS.AREA) {
      requestType = APP.PARAMETERS.COMPETENCY_AREA
    } else if (this.state.modalName === APP.PARAMETERS.SECTOR) {
      requestType = APP.PARAMETERS.SECTOR
    }
    let payload = {
      type: requestType,
      name: this.state.newCompetencyArea,
    };

    MasterService.addDataNode(payload).then((response) => {
      if (response && response.status === 200) {
        Notify.dark("New competency" + this.state.modalName.toLowerCase() + " is created");
        setTimeout(() => {
          if (this.state.modalName === APP.PARAMETERS.AREA) {
            this.getCompetencyAreaList();
          } else if (this.state.modalName === APP.PARAMETERS.SECTOR) {
            this.getCompetencySectorList();
          }
        }, 500);
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  // Fucntion to search property
  searchProperty = (field) => {
    let input, filter, ul, li, a, i, txtValue;
    input = document.getElementById(APP.COLLECTIONS.COMPETENCY + field + "value1");
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
          if (this.state.enableSaveAction && this.state.competencyData.additionalProperties &&
            (this.state.competencyData.additionalProperties.competencyArea
              || this.state.competencyData.additionalProperties.sector)) {
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


  searchCASelection = () => {
    // To search for a role from role list in the modal
    // Declare variables
    let input,
      filter,
      ul,
      li,
      a,
      i,
      txtValue,
      res = [];

    if (!this.state.clearSearchInputCompArea) {
      this.setState({
        clearSearchCompArea: true,
      });
    } else {
      this.setState({
        clearSearchCompArea: false,
        clearSearchInputCompArea: false,
      });
    }

    input = document.getElementById("caSelectionSearch");

    if (input.value.length === 0) {
      this.setState({
        clearSearchCompArea: false,
        clearSearchInputCompArea: false,
      });
    }

    if (!this.state.clearSearchInputCompArea) {
      filter = input.value.toUpperCase();
    } else {
      filter = "";
    }

    ul = document.getElementById("caListOne");
    li = ul.getElementsByTagName("dd");

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("div")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
        res.push(li[i]);
        this.setState({
          competencyAreaCount: res.length,
        });
      } else {
        li[i].style.display = "none";
      }
    }
  };

  searchForDeptOne = () => {
    // Declare variables
    let input, filter, ul, li, i, txtValue;
    if (!this.state.clearSearchInput) {
      this.setState({
        clearSearchDept: true,
      });
    } else {
      this.setState({
        clearSearchDept: false,
        clearSearchInputDept: false,
      });
    }

    input = document.getElementById("deptSearchOne");

    if (input.value.length === 0) {
      this.setState({
        clearSearchDept: false,
        clearSearchInputDept: false,
      });
    }

    if (!this.state.clearSearchInputDept) {
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

  // Checks all the required fields of the form is filled, 
  // if yes then enables the save button else disable the button
  formValidation() {
    let formValid = false;
    const compData = this.state.competencyData;
    if (compData.name && compData.description && compData.additionalProperties
      && compData.additionalProperties.competencyType && this.state.mappedCL
      && this.state.mappedCL.length && this.state.competencyLevelCount >= 3 && this.state.competencyLevelCount <= 5) {
      formValid = true;
      for (let i = 0; i < this.state.competencyLevelCount; i++) {
        if (!this.state.mappedCL[i] || !this.state.mappedCL[i].name || !this.state.mappedCL[i].description
          || this.state.mappedCL[i].description.length < 100) {
          formValid = false;
        }
      }
    }
    this.detectFormChanges();
    this.setState({
      enableSaveAction: formValid
    })
    return formValid;
  }

  detectFormChanges() {
    let changesDetected = false;
    const compData = JSON.parse(JSON.stringify(this.state.competencyData));
    compData.children = this.state.mappedCL;
    if (JSON.stringify(this.state.competencyResponse) !== JSON.stringify(compData)
      || this.state.mappedLevelCount !== this.state.competencyLevelCount) {
      changesDetected = true;
    }
    this.setState({
      formUpdated: changesDetected
    });
  }

  getCLDescription = (compDescription) => {
    if (compDescription) {
      const bulletValue = "• " + compDescription.replaceAll("\n", "\n• ");
      return bulletValue;
    }
    return compDescription;
  }

  handleKeyDown = (event, id) => {
    if ((event.charCode || event.keyCode) === 8) {
      const element = document.getElementById(id);
      const textValue = element.value;
      const bulletLocation = element.selectionStart - 1;
      if (bulletLocation > 1) {
        if (textValue[bulletLocation - 1] + textValue[bulletLocation] === '• ') {
          event.preventDefault();
          const replacedValue = textValue.substring(0, bulletLocation - 2) + '' + textValue.substring(bulletLocation + 1);
          element.value = replacedValue;
          element.selectionStart = bulletLocation - 2;
          element.selectionEnd = bulletLocation - 2;
        }
      } else {
        event.preventDefault();
      }
    }
  }

  setPropertyValue = (field, value) => {
    if (field === APP.PARAMETERS.AREA) {
      this.setState(
        {
          competencyData: {
            ...this.state.competencyData,
            additionalProperties: {
              ...this.state.competencyData.additionalProperties,
              competencyArea: value,
            }
          },
        }, () => {
          this.formValidation();
        })
    } else if (field === APP.PARAMETERS.SECTOR) {
      this.setState(
        {
          competencyData: {
            ...this.state.competencyData,
            additionalProperties: {
              ...this.state.competencyData.additionalProperties,
              sector: value
            }
          },
        }, () => {
          this.formValidation();
        })
    }
  }

  render() {
    return (
      <div className="row p-0 col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xs-8 m-0">
        <div className={`bordered custom-full-height-4 custom-body-bg ${this.state.getRole || this.state.showActivityLog
          ? "col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8"
          : "col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
          }`}
          id="masterColumn3">
          <div className="">
            <div className="sticky-area-top custom-body-bg">
              <div className="row mb-3 p-2 mt-3">
                {/* Status tag */}
                <div className={` ${this.state.formUpdated
                  ? ((!this.props.review || this.props.review === "false")
                    ? "col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-3"
                    : "col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4")
                  : "col-xs-12 col-sm-12 col-md-12 col-lg-5 col-xl-5"
                  } `}>
                  {(this.state.id && this.state.id !== 0 && this.state.id !== "0") ? (
                    <div className="float-left">
                      {(!this.props.review || this.props.review === "false") ?
                        // status tage
                        <div className="status-tag">
                          {this.state.competencyData.status !== APP.NODE_STATUS.DRAFT && (
                            <React.Fragment>
                              {(!this.state.competencyData.secondaryStatus ||
                                this.state.competencyData.secondaryStatus === APP.NODE_STATUS.UNVERIFIED) && (
                                  <React.Fragment>
                                    {(this.state.competencyData.status && this.state.competencyData.status === APP.NODE_STATUS.REJECTED)
                                      ? (
                                        <p className="status-rejected status-text">
                                          Rejected
                                        </p>
                                      )
                                      : <React.Fragment>
                                        {(this.props.review && this.props.review === "true"
                                          && this.state.roles && this.state.roles.includes(APP.USER_ROLES.REVIEWER_ONE)
                                          && this.state.competencyData.status === APP.NODE_STATUS.VERIFIED)
                                          ? (<p className="status-verified status-text">
                                            Verified
                                          </p>)
                                          : (<p className="status-unverified status-text">
                                            {(this.props.review && this.props.review === "true") ? "Unverified" : "Sent for review"}
                                          </p>)}
                                      </React.Fragment>}
                                  </React.Fragment>
                                )}
                              {(this.state.competencyData.secondaryStatus &&
                                this.state.competencyData.secondaryStatus === APP.NODE_STATUS.VERIFIED) && (
                                  <p className="status-verified status-text">
                                    Verified
                                  </p>
                                )}
                              {(this.state.competencyData.secondaryStatus &&
                                this.state.competencyData.secondaryStatus === APP.NODE_STATUS.REJECTED) && (
                                  <p className="status-rejected status-text">
                                    Rejected
                                  </p>
                                )}
                            </React.Fragment>
                          )}
                          {this.state.competencyData.status === APP.NODE_STATUS.DRAFT && (
                            <p className="status-draft status-text">Draft</p>
                          )}
                        </div>
                        : // similar competency
                        <React.Fragment>
                          {this.state.searchResult[0] && this.state.searchResult[0].length > 0 ? (
                            <div className="status-tag pointer" onClick={() => {
                              this.setState({
                                columnSixTabRef: APP.PARAMETERS.SIMILAR_ITEM_TAB_REF
                              });
                            }}>
                              <p className="filter-msg status-text status-text-PL">{this.state.searchResult[0].length} Similar items found</p>
                            </div>
                          ) : (
                            <div className="status-tag pointer">
                              <p className="filter-msg status-text status-text-PL">No similar items found</p>
                            </div>
                          )}
                        </React.Fragment>
                      }
                    </div>
                  ) : ""}
                </div>
                {/* Delete action & feedback component */}
                <div className={` ${this.state.formUpdated
                  ? ((!this.props.review || this.props.review === "false")
                    ? "col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-9"
                    : "col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-8")
                  : "col-xs-12 col-sm-12 col-md-12 col-lg-7 col-xl-7"
                  } `}>
                  <div className="d-inline-block float-right">
                    {(this.state.id && this.state.id !== 0 && this.state.id !== "0" && (!this.props.review || this.props.review === "false")) ? (
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
                              aria-expanded="false">
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
                    ) : ""}

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
                      || (this.state.competencyData && this.state.competencyData.status
                        && this.state.competencyData.status === APP.NODE_STATUS.DRAFT)) && (
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
                                this.saveCompetencies();
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
                              this.saveCompetencies();
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
            {this.state.competencyData && this.state.competencyData.status &&
              ((this.state.competencyData.status && this.state.competencyData.status === APP.NODE_STATUS.REJECTED
                && this.state.competencyData.reviewComments)
                || (this.state.competencyData.secondaryStatus
                  && this.state.competencyData.secondaryStatus === APP.NODE_STATUS.REJECTED &&
                  this.state.competencyData.secondaryReviewComments))
              && (
                <div className="row mb-3">
                  <div className="col-8">
                    <div className="review-comment-box-1">
                      <label>Reviewer’s comment</label>
                      <p>{this.state.competencyData.secondaryReviewComments
                        ? this.state.competencyData.secondaryReviewComments
                        : this.state.competencyData.reviewComments}</p>
                    </div>
                  </div>
                </div>
              )}

            <form onSubmit={this.saveCompetencies} id="competencyForm">
              {/* Competency Id */}
              <div className="row">
                <div className="col-xl-4 col-12">
                  <label>Competency ID</label>
                </div>
                <div className="col-xl-8 col-12 mb-4">
                  <input type="text"
                    id="expertID"
                    className="form-control"
                    placeholder="CID"
                    aria-label="id"
                    aria-describedby="basicId"
                    value={this.state.competencyData.id || ""}
                    disabled />
                </div>
              </div>
              {/* competency label */}
              <div id={APP.COLLECTIONS.COMPETENCY + APP.FIELD_NAME.LABEL} className="row">
                <div className="col-xl-4 col-12">
                  <label>Competency Label*</label>
                  <span
                    className="material-icons info-icon pl-2 align-middle pointer-style"
                    data-toggle="tooltip"
                    data-trigger="hover click"
                    title="The competency label is the name of the competency. It gives an idea of what the competency is about, and how it is commonly known (e.g. vigilance planning, decision making, project management).">
                    info
                  </span>
                </div>
                <div className="col-xl-8 col-12 mb-4">
                  <input
                    type="text"
                    id={APP.COLLECTIONS.COMPETENCY + APP.FIELD_NAME.LABEL + "value"}
                    className="form-control"
                    placeholder="Competency Label"
                    aria-label="label"
                    aria-describedby="basicLabel"
                    name="competencyLabel"
                    value={this.state.competencyData.name}
                    onChange={this.onCompetencyChange}
                    autoComplete="off"
                    spellCheck="true"
                    onKeyUp={(event) => this.getSimilarCompetencies(event)}
                    required
                  />
                </div>
              </div>
              {/* cometency description */}
              <div id={APP.COLLECTIONS.COMPETENCY + APP.FIELD_NAME.DESCRITPION} className="row">
                <div className="col-xl-4 col-12">
                  <label>Competency Description*</label>
                  <span
                    className="material-icons info-icon pl-2 align-middle pointer-style"
                    data-toggle="tooltip"
                    data-trigger="hover click"
                    title="The competency description covers the elements and the scope of the competency (e.g. Identifies one’s own emotional triggers and controls one’s emotional responses. Maintains sense of professionalism and emotional restraint when provoked, faced with hostility or working under increased stress. It includes resilience and stamina despite prolonged adversities).">
                    info
                  </span>
                </div>
                <div className="col-xl-8 col-12 mb-4">
                  <textarea
                    className="form-control"
                    id={APP.COLLECTIONS.COMPETENCY + APP.FIELD_NAME.DESCRITPION + "value"}
                    spellCheck="true"
                    rows={
                      this.state.competencyData.description &&
                        this.state.competencyData.description.length > 200
                        ? (this.state.competencyData.description.length > 800
                          ? 15 : this.state.competencyData.description.length / 55)
                        : 4
                    }
                    placeholder="Competency Description..."
                    name="competencyDescription"
                    value={this.state.competencyData.description}
                    onChange={this.onCompetencyChange}
                    autoComplete="off"
                    onKeyUp={(event) => {
                      if (!this.state.keyCodes.includes(event.keyCode)) {
                        if (event.keyCode === 32) {
                          this.getSimilarCompetencies(event);
                        }
                      }
                      this.getLetterCount(event);
                    }}
                    required>
                  </textarea>
                  <p
                    className={`mb-4 ${this.state.letterCount < 0
                      ? "change-text-color"
                      : "change-text-color-1"
                      }`}>
                    Characters remaining: {this.state.letterCount}
                  </p>
                </div>
              </div>
              {/* competency type */}
              <div id={APP.COLLECTIONS.COMPETENCY + APP.FIELD_NAME.COMP_TYPE} className="row">
                <div className="col-xl-4 col-12">
                  <label>Competency Type*</label>
                  <span
                    className="material-icons info-icon pl-2 align-middle pointer-style"
                    data-toggle="tooltip"
                    data-trigger="hover click"
                    title="Behavioural, domain, or functional">
                    info
                  </span>
                </div>
                <div className="col-xl-8 col-12 mb-4">
                  <div className="row pl-3 mt-2 mb-4">
                    {competencyType && competencyType.map((compType, index) => {
                      return (
                        <button key={index}
                          id={APP.COLLECTIONS.COMPETENCY + APP.FIELD_NAME.COMP_TYPE + "value" + index}
                          type="button"
                          className={`btn mr-3 ${(this.state.competencyData.additionalProperties &&
                            this.state.competencyData.additionalProperties.competencyType === compType)
                            ? "type-button type-button-selected"
                            : "type-button"
                            }`}
                          onClick={() => {
                            this.setState({
                              competencyData: {
                                ...this.state.competencyData,
                                additionalProperties: {
                                  ...this.state.competencyData.additionalProperties,
                                  competencyType: compType
                                }
                              }
                            }, () => {
                              this.formValidation();
                            });
                          }}>
                          <span
                            id={APP.COLLECTIONS.COMPETENCY + APP.FIELD_NAME.COMP_TYPE + "value1" + index}
                            className={`material-icons ${(this.state.competencyData.additionalProperties &&
                              this.state.competencyData.additionalProperties.competencyType === compType)
                              ? "type-radio-selected"
                              : "type-radio-unselected"
                              }`}>
                            {(this.state.competencyData.additionalProperties &&
                              this.state.competencyData.additionalProperties.competencyType === compType)
                              ? "radio_button_checked"
                              : "radio_button_unchecked"}
                          </span>
                          {compType}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              {/* cod */}
              {this.state.roles &&
                JSON.stringify(this.state.roles).includes("FRAC_ADMIN") && (
                  <div id={APP.COLLECTIONS.COMPETENCY + APP.FIELD_NAME.COD} className="row">
                    <div className="col-xl-4 col-12">
                      <label className="">COD</label>
                    </div>
                    <div className="col-xl-8 col-12 mb-4">
                      <div className="btn-group w-100 p-0">
                        <button
                          id={APP.COLLECTIONS.COMPETENCY + APP.FIELD_NAME.COD + "value1"}
                          type="button"
                          className="btn mb-3 custom-dropdown-menu-3 col-12"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false">
                          {(this.state.competencyData.additionalProperties && this.state.competencyData.additionalProperties.cod)
                            ? this.state.competencyData.additionalProperties.cod
                            : "Select a MDO"}
                        </button>
                        <button
                          id={APP.COLLECTIONS.COMPETENCY + APP.FIELD_NAME.COD + "value2"}
                          type="button"
                          className="btn dropdown-toggle dropdown-toggle-split mb-3 custom-dropdown-toggle-menu-2"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false">
                          <span className="sr-only">Toggle Dropdown</span>
                        </button>
                        <div
                          className="dropdown-menu right-dropdown-menu-2 col-12"
                          role="menu"
                          id="dropdownForDeptOne">
                          <div className="row col-12 p-0 ml-1">
                            <div className="col-9 " id="officerBucketsList">
                              <input
                                type="text"
                                style={{ width: "133%" }}
                                className="form-control mb-3 custom-search-5 form-control-3"
                                placeholder="Search..."
                                aria-label="Search"
                                id="deptSearchOne"
                                onKeyUp={this.searchForDeptOne}
                                aria-describedby="basic-addon1"
                                autoComplete="off" />
                            </div>
                            <div className="col-3">
                              {this.state.clearSearchDept && (
                                <span
                                  className="material-icons competency-area-close-button pull-right"
                                  onClick={() => {
                                    this.setState(
                                      {
                                        clearSearchInputDept: true,
                                      },
                                      () => {
                                        document.getElementById(
                                          "deptSearchOne"
                                        ).value = "";
                                        this.searchForDeptOne();
                                      }
                                    );
                                  }}>
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
                                this.setState(
                                  {
                                    competencyData: {
                                      ...this.state.competencyData,
                                      additionalProperties: {
                                        ...this.state.competencyData.additionalProperties,
                                        cod: undefined
                                      }
                                    }
                                  }, () => {
                                    this.formValidation();
                                  })
                              }>
                              Select a MDO
                            </button>
                            {this.state.allDepartments &&
                              this.state.allDepartments.map(
                                (value, index) => {
                                  return (
                                    <button
                                      type="button"
                                      key={value.id}
                                      className="dropdown-item p-1 custom-dropdown-item"
                                      onClick={() =>
                                        this.setState(
                                          {
                                            competencyData: {
                                              ...this.state.competencyData,
                                              additionalProperties: {
                                                ...this.state.competencyData.additionalProperties,
                                                cod: value.orgName,
                                              }
                                            }
                                          }, () => {
                                            this.formValidation();
                                          })
                                      }>
                                      {value.orgName}
                                    </button>
                                  );
                                }
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              {/* competency area  */}
              <div id={APP.COLLECTIONS.COMPETENCY + APP.FIELD_NAME.COMP_AREA} className="row">
                <div className="col-xl-4 col-12">
                  <label>Competency Area</label>
                  <span
                    className="material-icons info-icon pl-2 align-middle pointer-style"
                    data-toggle="tooltip"
                    data-trigger="hover click"
                    title="Competency areas can be defined as the collection of competencies closely related to one another at a knowledge/subject level. Cluster the competency labels and identify the generic area in which these competency labels could be categorised (e.g. technical writing, rules-based copy editing, content writing and editing, research and information synthesis, and report writing will come under the competency area of Noting and Drafting (2-3 words)).">
                    info
                  </span>
                </div>
                <div className="col-xl-8 col-12 mb-4">
                  <div className="input-group">
                    <input
                      id={APP.COLLECTIONS.COMPETENCY + APP.FIELD_NAME.COMP_AREA + "value1"}
                      type="text"
                      className="form-control"
                      placeholder="Competency Area"
                      aria-label="label"
                      aria-describedby="basicLabel"
                      value={(this.state.competencyData.additionalProperties &&
                        this.state.competencyData.additionalProperties.competencyArea)
                        ? this.state.competencyData.additionalProperties.competencyArea : ""}
                      onChange={(event) => this.setPropertyValue(APP.PARAMETERS.AREA, event)}
                      onKeyUp={this.searchProperty(APP.FIELD_NAME.COMP_AREA)}
                      name="competencyArea"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      autoComplete="off"
                    />
                    {this.state.competencyData.additionalProperties &&
                      this.state.competencyData.additionalProperties.competencyArea && (
                        <div id={APP.COLLECTIONS.COMPETENCY + APP.FIELD_NAME.COMP_AREA + "value2"}
                          onClick={this.clearCompetencyArea}>
                          <span className="competency-area-close-button-2">
                            <label
                              className="pointer-style"
                              style={{ marginTop: "0.40em" }}>
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
                          this.setModalValues(APP.PARAMETERS.AREA);
                        }}>
                        Create new or view all areas
                        <span className="material-icons float-right ca-navigation">
                          navigate_next
                        </span>
                      </h4>
                      <hr />
                      <div id="caListMain">
                        {this.state.caList &&
                          this.state.caList.map((value, index) => {
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
                                            competencyData: {
                                              ...this.state.competencyData,
                                              additionalProperties: {
                                                ...this.state.competencyData.additionalProperties,
                                                competencyArea: value.name,
                                              }
                                            },
                                          },
                                          () => {
                                            this.formValidation();
                                            this.searchProperty(APP.FIELD_NAME.COMP_AREA);
                                          }
                                        )
                                      }>
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
              {/*  */}
              {/* competency sector */}
              <div id={APP.COLLECTIONS.COMPETENCY + APP.FIELD_NAME.LABEL} className="row">
                <div className="col-xl-4 col-12">
                  <label>Competency Sector</label>
                </div>
                <div className="col-xl-8 col-12 mb-4">
                  <div className="input-group">
                    <input
                      id={APP.COLLECTIONS.COMPETENCY + APP.FIELD_NAME.SECTOR + "value1"}
                      type="text"
                      className="form-control"
                      placeholder="Competency Sector"
                      aria-label="label"
                      aria-describedby="basicLabel"
                      value={(this.state.competencyData.additionalProperties &&
                        this.state.competencyData.additionalProperties.sector)
                        ? this.state.competencyData.additionalProperties.sector : ""}
                      onChange={(event) => this.setPropertyValue(APP.PARAMETERS.SECTOR, event.target.value)}
                      onKeyUp={this.searchProperty(APP.FIELD_NAME.SECTOR)}
                      name="competencySector"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      autoComplete="off"
                    />
                    {this.state.competencyData.additionalProperties &&
                      this.state.competencyData.additionalProperties.sector && (
                        <div id={APP.COLLECTIONS.COMPETENCY + APP.FIELD_NAME.SECTOR + "value2"}
                          onClick={this.clearCompetencySector}>
                          <span className="competency-area-close-button-2">
                            <label
                              className="pointer-style"
                              style={{ marginTop: "0.40em" }}>
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
                          this.setModalValues(APP.PARAMETERS.SECTOR);
                        }}>
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
                                            competencyData: {
                                              ...this.state.competencyData,
                                              additionalProperties: {
                                                ...this.state.competencyData.additionalProperties,
                                                sector: value.name,
                                              }
                                            },
                                          },
                                          () => {
                                            this.formValidation();
                                            this.searchProperty(APP.FIELD_NAME.SECTOR);
                                          }
                                        )
                                      }>
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
                aria-hidden="true">
                <div
                  className="modal-dialog modal-dialog-centered modal-lg"
                  role="document">
                  <div className="modal-content">
                    <div className="row ml-0 w-100">
                      {/* Column one */}
                      <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 pt-2">
                        <div className="modal-header">
                          <h5
                            className="modal-title"
                            id="newAreaModalLongTitle">
                            Choose competency {this.state.modalName.toLowerCase()}
                          </h5>
                        </div>

                        <div className="row col-12">
                          <div
                            className="col-10 mb-1"
                            id="officerBucketsList">
                            <h6>Search by an {this.state.modalName.toLowerCase()} or a competency</h6>
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
                                }}>
                                close
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="pl-3">
                          {this.state.competencyAreaCount} {this.state.modalName.toLowerCase()}s
                        </p>
                        <div className="modal-body remove-scroll-x">
                          <div id="caListOne">
                            {this.state.modalList &&
                              this.state.modalList.map((i, j) => {
                                return (
                                  <dd key={i.key}>
                                    <div className="flex">
                                      <div
                                        className={`col-xs-12 col-sm-12 col-md-8 col-lg-10 col-xl-10 card mb-3 cca-card pointer-style ${i.key === this.state.selectedCAKey
                                          ? "on-select-card-3"
                                          : ""
                                          }`}
                                        onClick={() =>
                                          this.setState(
                                            {
                                              selectedCAKey: i.key,
                                            },
                                            () =>
                                              this.getSelectedCADetails()
                                          )
                                        }>
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
                        {this.state.selectedCAKey && (
                          <div className="modal-header">
                            <div className="col-12 p-0">
                              <h6>{capitalize(this.state.modalName)} label</h6>
                              <div className="">
                                <input
                                  type="text"
                                  id="areaLabel"
                                  className="form-control"
                                  placeholder="Area Label"
                                  aria-label="label"
                                  value={this.state.selectedCAKey}
                                  aria-describedby="basicLabel"
                                  name="areaLabel"
                                  autoComplete="off"
                                  readOnly
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        {!this.state.selectedCAKey && (
                          <div
                            className="m-5 vertical-center-6"
                            id="emptyState">
                            <center>
                              <h1 className="pb-2">No {this.state.modalName.toLowerCase()} selected</h1>
                              <p className="pb-2">
                                Choose from the list of {this.state.modalName.toLowerCase()}s
                              </p>
                              <img
                                src="../../img/empty/lists_empty.svg"
                                alt="empty list"
                              ></img>
                            </center>
                          </div>
                        )}
                        <div className="modal-body remove-scroll-x pt-0">
                          {this.state.selectedCAKey && (
                            <React.Fragment>
                              <h6>Competencies in this {this.state.modalName.toLowerCase()}</h6>
                              <button
                                type="button"
                                className="btn save-button-3 mr-2 custom-primary-button mt-2 mb-2"
                                onClick={() =>
                                  this.setPropertyValue(this.state.modalName, this.state.selectedCAKey)
                                }
                                data-dismiss="modal">
                                Add to this competency
                              </button>
                              <span
                                className="material-icons info-icon pl-2 align-middle pointer-style"
                                data-toggle="tooltip"
                                data-trigger="hover click"
                                title="Competency areas can be defined as the collection of competencies closely related to one another at a knowledge/subject level. Cluster the competency labels and identify the generic area in which these competency labels could be categorised (e.g. technical writing, rules-based copy editing, content writing and editing, research and information synthesis, and report writing will come under the competency area of Noting and Drafting (2-3 words)).">
                                info
                              </span>
                              <div id="selectedCADetailsList">
                                {this.state.selectedCADetails &&
                                  this.state.selectedCADetails.map(
                                    (i, j) => {
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
                                    }
                                  )}
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
                              selectedCAKey: "",
                              newCompetencyArea: "",
                            })
                          }>
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
                              selectedCAKey: "",
                              newCompetencyArea: "",
                              enableNewCA: false,
                              enableNewCAAddition: false
                            })
                          }>
                          Create new {this.state.modalName.toLowerCase()}
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
                aria-hidden="true">
                <div
                  className="modal-dialog modal-dialog-centered modal-lg"
                  role="document">
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
                              data-target="#newAreaModal">
                              arrow_back
                            </span>
                            <h5
                              className="modal-title"
                              id="newCreateAreaModalLongTitle">
                              Create a competency {this.state.modalName.toLowerCase()}
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
                                      {this.state.newCompetencyArea ||
                                        "*New " + this.state.modalName.toLowerCase()}
                                    </p>
                                    <p className="custom-sub-heading-1 custom-line-height-1">
                                      0 competencies
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
                            <h6>{capitalize(this.state.modalName)} label*</h6>
                            <div className="">
                              <input
                                type="text"
                                id="newAreaLabel"
                                className="form-control"
                                placeholder="Label"
                                aria-label="label"
                                value={this.state.newCompetencyArea}
                                onChange={this.onPositionSectorChange}
                                aria-describedby="basicLabel"
                                name="newAreaLabel"
                                autoComplete="off"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row ml-3 mb-3">
                          {this.state.enableNewCA && (
                            <React.Fragment>
                              <button
                                type="button"
                                className="btn save-button-3 mr-2 custom-primary-button mb-2"
                                onClick={() =>
                                  this.setState(
                                    {
                                      enableNewCAAddition: true,
                                      enableNewCA: false
                                    },
                                    () => this.createNewCA()
                                  )}>
                                Submit
                              </button>
                              <button
                                type="button"
                                className="btn save-button-3 mb-2 custom-primary-button-3"
                                onClick={() => {
                                  this.setState({
                                    newCompetencyArea: "",
                                    enableNewCA: false,
                                  });
                                }}>
                                Discard
                              </button>
                            </React.Fragment>
                          )}

                          {!this.state.enableNewCA && (
                            <React.Fragment>
                              <button
                                type="button"
                                className="btn save-button-3 mr-2 custom-primary-button-disabled mb-2"
                                disabled>
                                Submit
                              </button>
                              <button
                                type="button"
                                className="btn save-button-3 mb-2 custom-primary-button-3"
                                data-dismiss="modal">
                                Discard
                              </button>
                            </React.Fragment>
                          )}
                        </div>

                        <div className="modal-body remove-scroll-x pt-0">
                          <h6>Competencies in this {this.state.modalName.toLowerCase()}</h6>
                          {this.state.enableNewCAAddition && (
                            <button
                              type="button"
                              className="btn save-button-3 mr-2 custom-primary-button mt-2 mb-2"
                              onClick={() =>
                                this.setPropertyValue(this.state.modalName, this.state.newCompetencyArea)
                              }
                              data-dismiss="modal">
                              Add to this competency
                            </button>
                          )}

                          {!this.state.enableNewCAAddition && (
                            <button
                              type="button"
                              className="btn save-button-3 mr-2 custom-primary-button-disabled mt-2 mb-2"
                              disabled>
                              Add to this competency
                            </button>
                          )}
                          <span
                            className="material-icons info-icon pl-2 align-middle pointer-style"
                            title="Competency areas can be defined as the collection of competencies closely related to one another at a knowledge/subject level. Cluster the competency labels and identify the generic area in which these competency labels could be categorised (e.g. technical writing, rules-based copy editing, content writing and editing, research and information synthesis, and report writing will come under the competency area of Noting and Drafting (2-3 words)).">
                            info
                          </span>
                          <div id="roleListTwo">
                            <p className="custom-sub-heading-1 pt-2">
                              No competencies are added to this {this.state.modalName.toLowerCase()} yet
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
                              selectedCAKey: "",
                              newCompetencyArea: "",
                            })
                          }>
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Competency levels */}
              <div id={APP.COLLECTIONS.COMPETENCY + APP.FIELD_NAME.COMP_LEVEL}>
                <label className="mb-3 mt-3">Competency Levels*</label>
                {(!this.props.review || this.props.review === "false") && (
                  <div className="row">
                    <div className="col-xl-6 ol-12 pr-0">
                      {competencyLevels && competencyLevels.map((compLevel, index) => {
                        return (
                          <button key={index}
                            id={APP.COLLECTIONS.COMPETENCY + APP.FIELD_NAME.COMP_LEVEL + "value" + index}
                            type="button"
                            className={`btn mr-3 mb-2 ${(this.state.competencyLevelCount === compLevel.count)
                              ? "type-button type-button-selected"
                              : "type-button"
                              }`}
                            onClick={() => { this.competencyLevelSelection(compLevel.count) }}>
                            <span
                              id={APP.COLLECTIONS.COMPETENCY + APP.FIELD_NAME.COMP_LEVEL + "value1" + index}
                              className={`material-icons ${(this.state.competencyLevelCount === compLevel.count)
                                ? "type-radio-selected"
                                : "type-radio-unselected"
                                }`}>
                              {(this.state.competencyLevelCount === compLevel.count)
                                ? "radio_button_checked"
                                : "radio_button_unchecked"}
                            </span>
                            {compLevel.name}
                          </button>
                        );
                      })}
                    </div>
                    <div className="col-xl-6 col-12">
                      <div className="float-right pointer-style" data-toggle="modal"
                        data-target="#sampleLevelModal">
                        <span
                          className="material-icons level-info-icon pl-2 align-middle pointer-style">
                          info
                        </span>
                        <span className="level-info">Competency level description</span>
                      </div>
                    </div>
                  </div>
                )}
                {this.state.mappedCL && this.state.mappedCL.map((levels, index) => {
                  return (
                    <div key={index}>
                      {(index < this.state.competencyLevelCount) && (
                        <div className="row mt-3 mb-3">
                          <div className="col-xl-4 col-12">
                            <div className="level-count h-100">
                              <div className="level-count-md">
                                <span className="vertical-center level-label-md">Level {index + 1}</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-xl-8 col-12">
                            <textarea
                              className="form-control"
                              spellCheck="true"
                              rows={(levels.name && levels.name > 110)
                                ? (levels.name.length / 55) : 2}
                              placeholder="Level label"
                              name="competencyLevelLabel"
                              value={levels.name}
                              onChange={(event) => { this.onCompetencyLevelChange(event, index) }}
                              autoComplete="off"
                              id={APP.COLLECTIONS.COMPETENCY + APP.FIELD_NAME.COMP_LEVEL + "name" + index}
                              required>
                            </textarea>
                          </div>
                          <div className="col-xl-8 col-12 offset-xl-4 mt-2">
                            <textarea
                              className="form-control"
                              spellCheck="true"
                              rows={
                                this.getCLDescription(levels.description) &&
                                  this.getCLDescription(levels.description).length > 200
                                  ? (this.getCLDescription(levels.description).length > 800
                                    ? 15 : this.getCLDescription(levels.description).length / 55)
                                  : 4
                              }
                              placeholder="Level description"
                              name="competencyLevelDescription"
                              onKeyDown={(event) => this.handleKeyDown(event, APP.COLLECTIONS.COMPETENCY + APP.FIELD_NAME.COMP_LEVEL + "description" + index)}
                              value={this.getCLDescription(levels.description)}
                              onChange={(event) => { this.onCompetencyLevelChange(event, index) }}
                              autoComplete="off"
                              id={APP.COLLECTIONS.COMPETENCY + APP.FIELD_NAME.COMP_LEVEL + "description" + index}
                              required>
                            </textarea>
                          </div>
                          {levels.description &&
                            <p
                              className={`offset-4 mb-0 pl-3 ${levels.description.length < 100
                                ? "change-text-color"
                                : "change-text-color-2"
                                }`}>
                              {levels.description.length +
                                " characters (minimum 100 characters)"}
                            </p>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Competency Source */}
              <div id={APP.COLLECTIONS.COMPETENCY + APP.FIELD_NAME.COMP_SOURCE}>
                <label className="mb-3 mt-3">Competency Source</label>
                <div className="row mb-3">
                  <div className="col-xl-4 col-12 mb-2">
                    <input
                      type="text"
                      id={APP.COLLECTIONS.COMPETENCY + APP.FIELD_NAME.COMP_SOURCE + "value1"}
                      className="form-control"
                      placeholder="Name of the source"
                      aria-label="label"
                      value={this.state.sourceName}
                      onChange={(e) => {
                        this.setState({
                          sourceName: e.target.value
                        })
                      }}
                      aria-describedby="basicLabel"
                      name="sourceName"
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-xl-6 col-12">
                    <span className="material-icons position-absolute pl-2 pr-2 pt-1 cancel-icon-2">
                      link
                    </span>
                    <input
                      type="text"
                      id={APP.COLLECTIONS.COMPETENCY + APP.FIELD_NAME.COMP_SOURCE + "value2"}
                      className="form-control icon-text"
                      placeholder="URL of the source here"
                      aria-label="label"
                      value={this.state.sourceURL}
                      onChange={(e) => {
                        this.setState({
                          sourceURL: e.target.value
                        })
                      }}
                      aria-describedby="basicLabel"
                      name="sourceURL"
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-xl-2 col-4">
                    <button
                      type="button"
                      className={`btn save-button mt-2 mt-xl-0 review-secondary-button-1`}
                      onClick={() => {
                        this.addSource();
                      }}
                      disabled={!(this.state.sourceName || this.state.sourceURL)}>
                      Add
                    </button>
                  </div>
                </div>
                <div className="col-12 table-heading-2 p-0 pr-4 table-responsive">
                  <table className="table table-striped table-hover table-fixed">
                    <tbody>
                      {this.state.competencyData.additionalProperties && this.state.competencyData.additionalProperties.competencySource
                        && this.state.competencyData.additionalProperties.competencySource.map((sourceObj, index) => {
                          return (
                            <>
                              {this.state.editSourceIndex !== (index + 1) &&
                                <tr key={index}>
                                  <td colSpan="4">
                                    {sourceObj.value ? (
                                      <a href={sourceObj.value} target="_blank"
                                        className="handle-text-overflow pt-1"
                                        rel="noopener noreferrer">
                                        {(sourceObj.name) ? sourceObj.name : sourceObj.value}
                                      </a>
                                    ) :
                                      <span>{sourceObj.name}</span>}
                                  </td>
                                  <td>
                                    <span
                                      className="material-icons pointer-style float-right"
                                      onClick={() => {
                                        this.setState({
                                          editSourceIndex: index + 1
                                        })
                                      }}>
                                      edit
                                    </span>
                                  </td>
                                  <td>
                                    <span
                                      className="material-icons pointer-style float-right"
                                      data-toggle="modal"
                                      data-target="#newDeleteConfirmModal1"
                                      onClick={() => {
                                        this.setState({
                                          selectedSource: sourceObj
                                        })
                                      }}>
                                      delete
                                    </span>
                                  </td>
                                </tr>
                              }
                              {/* Edit mode */}
                              {this.state.editSourceIndex === (index + 1) &&
                                <tr key={index}>
                                  <td colSpan="2">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Name of the source"
                                      aria-label="label"
                                      value={sourceObj.name}
                                      onChange={(e) => {
                                        this.setState({
                                        })
                                        sourceObj.name = e.target.value;
                                      }}
                                      aria-describedby="basicLabel"
                                      name="sourceNameEdit"
                                      autoComplete="off"
                                    />
                                  </td>
                                  <td colSpan="3">
                                    <span className="material-icons position-absolute pl-2 pr-2 pt-1 cancel-icon-2">
                                      link
                                    </span>
                                    <input
                                      type="text"
                                      className="form-control icon-text"
                                      placeholder="URL of the source here"
                                      aria-label="label"
                                      value={sourceObj.value}
                                      onChange={(e) => {
                                        this.setState({
                                        })
                                        sourceObj.value = e.target.value;
                                      }}
                                      aria-describedby="basicLabel"
                                      name="sourceURLEdit"
                                      autoComplete="off"
                                    />
                                  </td>
                                  <td>
                                    <button
                                      type="button"
                                      className={`btn save-button mt-2 mt-xl-0 review-secondary-button-1`}
                                      onClick={() => {
                                        this.setState({
                                          editSourceIndex: 0
                                        }, () => {
                                          this.formValidation();
                                        })
                                      }}
                                      disabled={!(sourceObj.name || sourceObj.value)}>
                                      Save
                                    </button>
                                  </td>
                                </tr>
                              }
                            </>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
              <React.Fragment>
                {/* Tab selection */}
                <div id="officerColumn4" className="mt-3 ml-3">
                  <ul
                    className="nav nav-pills mb-3 mt-1 custom-officer-margin"
                    id="pills-tab"
                    role="tablist">
                    <li className="nav-item">
                      <a
                        className={`nav-link text-center custom-officer-margin active`}
                        id="pills-home-tab"
                        data-toggle="pill"
                        href="#pills-roles"
                        role="tab"
                        aria-controls="pills-home"
                        aria-selected="true">
                        Associated Roles
                      </a>
                    </li>
                  </ul>
                </div>
                {/* Associated roles */}
                <div className={`tab-pane fade show active`}
                  id="pills-roles"
                  role="tabpanel"
                  aria-labelledby="pills-home-tab">
                  {(this.state.mappedRoles && this.state.mappedRoles.length > 0)
                    ? <React.Fragment>
                      {/*Search for mapped roles*/}
                      <div className="row col-12">
                        <div className="col-3 p-0" id="officerBucketsList">
                          <input
                            type="text"
                            style={{ width: "110%", paddingLeft: "1.75rem" }}
                            className="form-control mb-4 custom-search-5 custom-search-bar-2 form-control-4"
                            placeholder="Search..."
                            name="search"
                            autoComplete="off"
                            id="mappedRoleSearch"
                            onKeyUp={this.searchMappedRoles}
                          />
                        </div>
                        <div className="col-2">
                          {this.state.clearSearchMappedRoles && (
                            <span
                              className="material-icons competency-area-close-button-3"
                              onClick={() => {
                                this.setState(
                                  {
                                    clearSearchInputMappedRoles: true,
                                  },
                                  () => {
                                    document.getElementById(
                                      "mappedRoleSearch"
                                    ).value = "";
                                    this.searchMappedRoles();
                                  }
                                );
                              }}>
                              close
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Listing mapped roles */}
                      <div id="mappedRolesList">
                        <div className="row col-12">
                          {this.state.mappedRoles.map((value, index) => {
                            return (
                              <div
                                className={`col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 card mr-3 mb-3 cca-card pointer-style role-border-1 custom-fixed-width-2 ${this.state.getSelectedRoleID === value.id
                                  ? "on-select-card-2"
                                  : ""
                                  }`}
                                key={value.id}
                                onClick={() => this.selectedRole(value.id)}>
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
                    </React.Fragment>
                    : <div id="emptyState">
                      <p className="m-0 mb-4">Competency not mapped under any role</p>
                    </div>}
                </div>
              </React.Fragment>
            </form>
          </div>
        </div>
        {/* Cancel Modal */}
        <div
          className="modal fade fadeInUp"
          id="newCancelModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="newCancelModalTitle"
          aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
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
                          competencyData: {
                            ...this.state.competencyData,
                            additionalProperties: {
                              ...this.state.competencyData.additionalProperties,
                              competencyArea: undefined
                            },
                            name: "",
                            description: "",
                          },
                          letterCount: 200,
                          saveAsDraft: false,
                          mappedCL: [],
                        },
                        () => {
                          this.formValidation();
                          if (this.state.id !== 0) {
                            this.getCompetencyDetails(
                              this.state.id,
                              APP.COLLECTIONS.COMPETENCY
                            );
                            this.getRolesMapped(this.state.id, "ROLE");
                            this.getMappedCL(
                              this.state.id,
                              APP.COLLECTIONS.COMPETENCY_LEVEL
                            );
                          }
                        }
                      );
                    }}>
                    Yes, discard
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
        {/* Sample Competency level modal */}
        <div
          className="modal fade fadeInUp"
          id="sampleLevelModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="sampleLevelModalTitle"
          aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="newCancelLongTitle">
                  Sample levels
                </h5>
              </div>
              <div className="modal-body remove-scroll-x pl-4 pr-4">
                <div className="mb-4">
                  {competencyLevels && competencyLevels.map((compLevel, index) => {
                    return (
                      <button key={index}
                        type="button"
                        className={`btn mr-3 ${(this.state.sampleLevelCount === compLevel.count)
                          ? "type-button type-button-selected"
                          : "type-button"
                          }`}
                        onClick={() => {
                          this.setState({
                            sampleLevelCount: compLevel.count
                          });
                        }}>
                        <span
                          className={`material-icons ${(this.state.sampleLevelCount === compLevel.count)
                            ? "type-radio-selected"
                            : "type-radio-unselected"
                            }`}>
                          {(this.state.sampleLevelCount === compLevel.count)
                            ? "radio_button_checked"
                            : "radio_button_unchecked"}
                        </span>
                        {compLevel.name}
                      </button>
                    );
                  })}
                </div>
                {sampleLevels && sampleLevels.map((levels, index) => {
                  return (
                    <div className="pl-3" key={index}>
                      {(index < this.state.sampleLevelCount) && (
                        <div className="row mt-2 mb-2 mr-1 p-3 level-count">
                          <div className="col-1">
                            {index + 1}
                          </div>
                          <div className="col-3">
                            {levels.label}
                          </div>
                          <div className="col-8">
                            {levels.description}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="modal-footer">
                <div className="row">
                  <button
                    type="button"
                    className="btn save-button mr-2 custom-primary-button"
                    data-dismiss="modal">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Delete the Source URL */}
        <div
          className="modal fade fadeInUp"
          id="newDeleteConfirmModal1"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="newDeleteConfirmModalTitle"
          aria-hidden="true">
          <div
            className="modal-dialog modal-dialog-centered"
            role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  className="modal-title"
                  id="newDeleteConfirmLongTitle">
                  Do you want to delete this source?
                </h5>
              </div>

              <div className="modal-body remove-scroll-x">
                <p>
                  The selected source will be deleted from the competency.
                </p>
              </div>

              <div className="modal-footer">
                <div className="row">
                  <button
                    type="button"
                    className="btn save-button mr-2 danger-button-1"
                    data-dismiss="modal"
                    onClick={() => this.deleteSourceURL()}>
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
        {/* Delete te item */}
        <div
          className="modal fade fadeInUp"
          id="newDeleteModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="newDeleteModalTitle"
          aria-hidden="true">
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  className="modal-title"
                  id="newDeleteLongTitle"
                >
                  Do you want to delete this Competency?
                </h5>
              </div>
              <div className="modal-body remove-scroll-x">
                <p>
                  The selected Competency details and all the
                  mapping related to this Competency will be
                  deleted.
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
                        this.state.competencyData.id,
                        "COMPETENCY"
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

        {
          this.state.getRole && (
            <ColumnFive
              {...this.props}
              roleId={this.state.getSelectedRoleID}
              type="ROLE"
              childType={["ACTIVITY", APP.COLLECTIONS.COMPETENCY]}
              parentType={["POSITION"]}
              btnText="Jump to Role"
              url="/collection-roles/"
              stateDataKey="isNewRole"
              searchBarStyle="custom-search-bar-3"
              customHeight="custom-full-height-4"
            />
          )
        }
        {
          this.state.showActivityLog && (
            <ColumnSix
              {...this.props}
              customHeight="custom-full-height-4"
              activityLogs={this.state.activityLogs}
              nodeData={this.state.competencyData}
              validNode={this.state.validNode}
              activeTabId={this.state.columnSixTabRef}
              searchData={this.state.searchResult}
              searchHeading="Similar Competencies"
              searchClass="competency-border-1"
              searchClass2="position-border-1"
              type={APP.COLLECTIONS.COMPETENCY}
              btnText="Jump to Competency"
              url={APP.COLLECTIONS_PATH.COMPETENCY}
              stateDataKey="isNewCompetency"
              actioBtnText="Copy info to new competency"
              titleSecondary="Associated Activities"
              functionName="getParentNode"
              receiveData={this.receiveData}
            />
          )
        }
      </div >
    );
  }
}

export default ColumnThree;
export { ColumnThree };
