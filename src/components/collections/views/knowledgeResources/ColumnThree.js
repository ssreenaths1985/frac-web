import React from "react";
import { MasterService } from "../../../../services/master.service";
import Notify from "../../../../helpers/notify";
import { APP } from "../../../../constants";
import ColumnFive from "../positions/ColumnFive";
import ColumnSix from "../positions/ColumnSix";
import RatingAndFeedback from "../common/RatingAndFeedback";

/** Knowledge Resources component which enables users
 ** to create a new Knowledge Resources and allows them to
 ** upload multiple URL's and multiple files of different types
 ** for an Knowledge Resources
 **/

class ColumnThree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      krData: {
        name: "",
        description: "",
      },
      krURL: "",
      krLabel: "",
      KrResponse: {},
      enableSaveAction: false,
      formUpdated: false,
      selectedActivityList: [],
      mappedActivity: [],
      searchResultKr: [],
      getActivity: false,
      getSelectedActivityID: "",
      letterCount: 280,
      fileName: "",
      urlList: [],
      uploadedFileName: [],
      krFiles: [],
      keyCodes: [8, 46, 37, 39, 38, 40],
      clearSearchMappedActivitiesKR: false,
      clearSearchInputMappedActivitiesKR: false,
      showActivityLog: true,
      activityLogs: [],
      saveAsDraft: false,
      selectedFile: {},
      selectedURL: "",
      disableUpload: false,
      showFeedback: false,
      columnSixTabRef: "",
    };

    // Binding of the functions
    this.saveKr = this.saveKr.bind(this);
    this.onKrChange = this.onKrChange.bind(this);
    this.getKrDetails = this.getKrDetails.bind(this);
    this.getActivityMapped = this.getActivityMapped.bind(this);
    this.searchKR = this.searchKR.bind(this);
    this.getSimilarKrs = this.getSimilarKrs.bind(this);
    this.selectedActivity = this.selectedActivity.bind(this);
    this.receiveData = this.receiveData.bind(this);
    this.getLetterCount = this.getLetterCount.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
    this.searchMappedActivity = this.searchMappedActivity.bind(this);
    this.addURL = this.addURL.bind(this);
    this.deleteURL = this.deleteURL.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.resetKrHandler = this.resetKrHandler.bind(this);
    this.getKrLogs = this.getKrLogs.bind(this);
  }

  // Method is called after the component is rendered
  componentDidMount() {
    if (this.props.history.location.state) {
      if (this.props.history.location.state.id &&
        this.props.history.location.state.id !== "0" &&
        this.props.history.location.state.id !== 0) {
        const krId = this.props.history.location.state.id
        this.setState(
          {
            id: krId,
          });
        this.getKrDetails(krId, "KNOWLEDGERESOURCE");
        this.getActivityMapped(krId, "ACTIVITY");
        this.getKrLogs(krId, "KNOWLEDGERESOURCE");
      }
    }

    if (document.getElementById("masterColumn3")) {
      document
        .getElementById("masterColumn3")
        .addEventListener("mousedown", (event) => {
          let checkIds = ["mappedActivityList"];
          if (
            event.path &&
            event.path.length > 3 &&
            !event.path[4].id.includes(checkIds)
          ) {
            this.resetKrHandler();
          }
        });
    }
  }

  resetKrHandler = () => {
    this.setState({
      getActivity: false,
      getSelectedActivityID: false,
      showActivityLog: true,
    });
  };

  // Method to get data from another component via props
  receiveData = (name, description) => {
    if (name && description) {
      this.setState(
        {
          krData: {
            ...this.state.krData,
            name: name,
            description: description,
          },
          letterCount: 280 - description.length
        });
    }
  };

  // Method enables search feature for mapped activities
  searchMappedActivity = () => {
    // Declare variables
    let input, filter, ul, li, a, i, txtValue;
    if (!this.state.clearSearchInputMappedActivitiesKR) {
      this.setState({
        clearSearchMappedActivitiesKR: true,
      });
    } else {
      this.setState({
        clearSearchMappedActivitiesKR: false,
        clearSearchInputMappedActivitiesKR: false,
      });
    }

    input = document.getElementById("mappedActivitySearch");

    if (input.value.length === 0) {
      this.setState({
        clearSearchMappedActivitiesKR: false,
        clearSearchInputMappedActivitiesKR: false,
      });
    }

    if (!this.state.clearSearchInputMappedActivitiesKR) {
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

  // Method to save knowledge/resourse into the system
  saveKr = (e) => {
    if (e) {
      e.preventDefault();
    }
    let krPaylaod = {
      type: "KNOWLEDGERESOURCE",
      source: "FRAC",
      name: this.state.krData.name,
      description: this.state.krData.description,
      additionalProperties: {
        URL: this.state.urlList,
        files: this.state.krFiles,
      },
    };
    if (this.state.id !== 0) {
      krPaylaod.id = this.state.id;
    }

    // setTimeout(() => {
    if (this.state.saveAsDraft) {
      krPaylaod.status = "DRAFT";
    }
    if ((krPaylaod.name !== 0 &&
      krPaylaod.name.length > 1 &&
      krPaylaod.description !== 0 &&
      krPaylaod.description.length > 1) ||
      this.state.saveAsDraft) {
      MasterService.addDataNode(krPaylaod).then((response) => {
        if (response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          if (this.state.id === 0) {
            Notify.dark("Knowledge Resource created successfully");
          } else {
            Notify.dark("Knowledge Resource updated successfully");
          }
          this.setState(
            {
              selectedURL: "",
              enableSaveAction: false,
              formUpdated: false,
              showActivityLog: true,
              saveAsDraft: false,
            }, () => {
              setTimeout(() => {
                if (this.state.id !== 0) {
                  this.getKrLogs(this.state.id, "KNOWLEDGERESOURCE");
                }
              }, 800);
            }
          );

          this.props.history.push({
            pathname:
              "/collection-knowledge-resources/" +
              response.data.responseData.id,
            state: {
              isNewKR: false,
              id: response.data.responseData.id,
              type: "KNOWLEDGERESOURCE",
              stayOn: true,
            },
          });
          setTimeout(() => {
            if (this.state.id !== 0) {
              this.getKrDetails(response.data.responseData.id, "KNOWLEDGERESOURCE");
            }
          }, 700);
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });
    } else {
      Notify.error("Kindly fill required details");
    }
    // }, 350);
  };

  // Method to search an item from list of Knowledge Resources
  searchKR = () => {
    // Declare variables
    let input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("krSearch");
    filter = input.value.toUpperCase();
    ul = document.getElementById("krList");
    li = ul.getElementsByTagName("a");

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

  // Method to make search while users types in the i/p field
  getSimilarKrs = (event) => {
    event.preventDefault();

    // For Name
    if (event.target.name === "krLabel" && this.state.krData.name.length > 1) {
      if (!event.custom) {
        this.setState({
          columnSixTabRef: APP.PARAMETERS.SIMILAR_ITEM_TAB_REF
        });
      }
      let searchPayloadNameKR = {
        searches: [
          {
            type: "KNOWLEDGERESOURCE",
            field: "name",
            keyword: this.state.krData.name,
          },
        ],
      };
      MasterService.searchNodes(searchPayloadNameKR).then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState(
            {
              searchResultKr: [],
            },
            () => {
              this.setState({
                searchResultKr: [
                  ...this.state.searchResultKr,
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
        searchResultKr: [],
      });
    }

    // For Description
    if (
      event.target.name === "krDescription" &&
      this.state.krData.description.length > 1
    ) {
      let searchPayloadDescriptionKR = {
        searches: [
          {
            type: "KNOWLEDGERESOURCE",
            field: "description",
            keyword: this.state.krData.description,
          },
        ],
      };
      MasterService.searchNodes(searchPayloadDescriptionKR).then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState(
            {
              searchResultKr: [],
            },
            () => {
              this.setState({
                searchResultKr: [
                  ...this.state.searchResultKr,
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
        searchResultKr: [],
      });
    }

    // For URL
    if (event.target.name === "krUrl" && this.state.krURL.length > 1) {
      let searchPayloadURLKR = {
        searches: [
          {
            type: "KNOWLEDGERESOURCE",
            field: "URL",
            keyword: this.state.krURL,
          },
        ],
      };
      MasterService.searchNodes(searchPayloadURLKR).then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState(
            {
              searchResultKr: [],
            },
            () => {
              this.setState({
                searchResultKr: [
                  ...this.state.searchResultKr,
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
        searchResultKr: [],
      });
    }
  };

  // Method to select an activity from the mapped list of activities
  selectedActivity = (id) => {
    this.setState({
      getActivity: true,
      showActivityLog: false,
      getSelectedActivityID: id,
    });
  };

  // Method to get knowledge/reource details based on the KRID
  getKrDetails = (id, type) => {
    this.setState({
      krData: {
        id: "",
        name: "",
        description: "",
      },
      krURL: "",
      uploadedFileName: [],
      urlList: [],
      krFiles: [],
    });
    if (id !== 0) {
      setTimeout(() => {
        MasterService.getDataByNodeId(id, type).then((response) => {
          if (response && response.data.statusInfo.statusCode === APP.CODE.SUCCESS) {
            this.setState(
              {
                krData: response.data.responseData,
                KrResponse: response.data.responseData,
              },
              () => {
                if (this.state.krData.description) {
                  this.setState({
                    letterCount:
                      this.state.letterCount - this.state.krData.description.length,
                  });
                }
              }
            );
            if (response.data.responseData.additionalProperties) {
              this.setState({
                urlList: (response.data.responseData.additionalProperties.URL)
                  ? response.data.responseData.additionalProperties.URL : [],
                uploadedFileName: (response.data.responseData.additionalProperties.files)
                  ? response.data.responseData.additionalProperties.files : [],
                krFiles: (response.data.responseData.additionalProperties.krFiles
                  ? response.data.responseData.additionalProperties.krFiles : [])
              });
            }
          } else {
            Notify.error(response && response.data.statusInfo.errorMessage);
          }
        });
      }, 800);
    }
  };

  // Method to capture the i/p field data changes
  onKrChange = (e) => {
    e.preventDefault();
    let onlyAlphabet = /^[/+#\-_()., A-Za-z ]*$/;

    switch (e.target.name) {
      case "krLabel":
        if (!onlyAlphabet.test(e.target.value)) {
          return false;
        }
        this.setState(
          {
            krData: {
              ...this.state.krData,
              name: e.target.value,
            },
          }, () => {
            this.formValidation();
          });
        break;
      case "krDescription":
        this.setState(
          {
            krData: {
              ...this.state.krData,
              description: e.target.value,
            },
          }, () => {
            this.formValidation();
          });
        break;
      case "krUrl":
        this.setState(
          {
            krURL: e.target.value,
          });
        break;
      default:
        break;
    }
  };

  // Method to get list of mapped activities for an patricular KRID
  getActivityMapped = (id, type) => {
    MasterService.getParentNode(id, type).then((response) => {
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

  // Text character counter
  getLetterCount = (event) => {
    if (event.target.name === "krDescription") {
      this.setState({
        letterCount: 280 - this.state.krData.description.length,
      });
    }
  };

  // Method for file upload
  fileUpload = (event) => {
    if (event.target.name === "krFile") {
      if (event.target.files[0]) {
        this.setState(
          {
            fileName: event.target.files[0].name,
            file: event.target.files[0],
          }
        );
      }
    }
  };

  cloudUpload = () => {
    if (this.state.file) {
      this.setState({
        disableUpload: true
      })
      const formData = new FormData();
      formData.append("file", this.state.file);
      MasterService.cloudStorage(formData).then((response) => {
        this.setState({
          disableUpload: false
        })
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState({
            uploadedFileName: [...this.state.uploadedFileName, response.data.responseData],
            krFiles: [...this.state.krFiles, response.data.responseData],
            fileName: "",
            file: "",
          }, () => {
            this.formValidation();
          });
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });
    }
  }

  deleteCloudFile = () => {
    if (this.state.selectedFile) {
      MasterService.deleteCloudFile(this.state.selectedFile.name).then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          // remove from state variable
          this.setState({
            uploadedFileName: this.state.uploadedFileName.filter((obj => obj !== this.state.selectedFile.name)),
            krFiles: this.state.krFiles.filter((obj => obj !== this.state.selectedFile)),
            selectedFile: {}
          }, () => {
            this.saveKr();
          })
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });
    }
  }

  // Method to add URL toKnowledge Resources
  addURL = () => {
    const urlObj = {
      name: this.state.krLabel,
      value: this.state.krURL
    }
    this.setState({
      urlList: [...this.state.urlList, urlObj],
      krData: {
        ...this.state.krData,
      },
      krURL: "",
      krLabel: ""
    }, () => {
      this.formValidation();
    });
  };

  // Method to delete mapped URL for Knowledge Resources
  deleteURL = () => {
    this.setState({
      urlList: this.state.urlList.filter((obj) => obj !== this.state.selectedURL)
    }, () => {
      this.formValidation();
    })
  };

  // Method to delete an Knowledge Resource
  deleteItem = (id, type) => {
    MasterService.deleteNode(id, type).then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        Notify.dark("Knowledge resource deleted successfully");
        this.setState({
          enableSaveAction: false,
          formUpdated: false,
          getActivity: false,
          showActivityLog: true,
        });
        this.props.history.push({
          pathname: "/collection-knowledge-resources/",
          state: {
            isNewKR: false,
            type: "KNOWLEDGERESOURCE",
            stayOn: true,
            deleteItem: true,
          },
        });
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  getKrLogs = (id, type) => {
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

  //  Method invoked immediately after updating occurs
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.department !== this.props.department) {
      this.props.history.push({
        pathname: "/collection-knowledge-resources/",
        state: {
          isNewKR: false,
          type: "KNOWLEDGERESOURCE",
        },
      });
    }
    if (this.props.match.params.id !== "0") {
      if (prevProps.location.state.id !== this.props.location.state.id) {
        this.setState(
          {
            id: this.props.location.state.id,
            formUpdated: false,
            enableSaveAction: false,
            showActivityLog: true,
            letterCount: 280,
            uploadedFileName: [],
            krFiles: [],
            urlList: [],
            fileName: "",
            getSelectedActivityID: "",
            getActivity: false,
            activityLogs: [],
            krData: {
              id: "",
              name: "",
              description: "",
            },
            krURL: "",
            mappedActivity: [],
            selectedActivityList: [],
          },
          () => {
            if (this.state.id !== 0) {
              this.getKrDetails(this.state.id, "KNOWLEDGERESOURCE");
              this.getActivityMapped(this.state.id, "ACTIVITY");
              this.getKrLogs(this.state.id, "KNOWLEDGERESOURCE");
            }
          }
        );
      }
    } else {
      if (prevProps.location.state.id !== this.props.location.state.id) {
        this.setState({
          krData: {
            id: "",
            name: "",
            description: "",
          },
          krURL: "",
          mappedActivity: [],
          selectedActivityList: [],
          letterCount: 280,
          uploadedFileName: [],
          krFiles: [],
          urlList: [],
          getSelectedActivityID: "",
          activityLogs: [],
        });
      }
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
    const krData = this.state.krData;
    if (krData.name && krData.description) {
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
    const krData = JSON.parse(JSON.stringify(this.state.krData));
    if (JSON.stringify(this.state.KrResponse) !== JSON.stringify(krData)) {
      changesDetected = true;
    }
    if ((this.state.KrResponse.additionalProperties && this.state.KrResponse.additionalProperties.URL
      && JSON.stringify(this.state.KrResponse.additionalProperties.URL) !== JSON.stringify(this.state.urlList))
      || (this.state.urlList && this.state.urlList.length > 0 &&
        (!this.state.KrResponse.additionalProperties || !this.state.KrResponse.additionalProperties.URL))) {
      changesDetected = true;
    }
    if ((this.state.KrResponse.additionalProperties && this.state.KrResponse.additionalProperties.files
      && JSON.stringify(this.state.KrResponse.additionalProperties.files) !== JSON.stringify(this.state.uploadedFileName))
      || (this.state.uploadedFileName && this.state.uploadedFileName.length > 0 &&
        (!this.state.KrResponse.additionalProperties || !this.state.KrResponse.additionalProperties.files))) {
      changesDetected = true;
    }

    this.setState({
      formUpdated: changesDetected
    });
  }

  // Method which renders this entire component
  render() {
    return (
      <div className="row p-0 col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xsl-8 m-0">
        <div
          className={`bordered custom-full-height-4 custom-body-bg ${this.state.getActivity ||
            this.state.showActivityLog
            ? "col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8"
            : "col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
            }`}
          id="masterColumn3"
        >
          <div>
            <div className="p-2 mt-2">
              <div className="sticky-area-top custom-body-bg">
                <div className="row mb-3 p-2 mt-3">
                  {/* Draft status tag */}
                  <div className={` ${(this.state.formUpdated)
                    ? "col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-3"
                    : "col-xs-12 col-sm-12 col-md-12 col-lg-5 col-xl-6"
                    } `}>
                    {this.state.id !== 0 && (
                      <div className="float-left">
                        <div className="status-tag">
                          {this.state.id !== 0 &&
                            this.state.krData &&
                            this.state.krData.status &&
                            this.state.krData.status === "DRAFT" && (
                              <p className="status-draft status-text">Draft</p>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Button & actions */}
                  <div className={` ${(this.state.formUpdated)
                    ? "col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-9"
                    : "col-xs-12 col-sm-12 col-md-12 col-lg-7 col-xl-6"
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
                              <div className="dropdown-content">
                                <RatingAndFeedback {...this.props} />
                              </div>
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
                        || (this.state.krData && this.state.krData.status
                          && this.state.krData.status === APP.NODE_STATUS.DRAFT)) && (
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
                                  this.saveKr();
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
                                this.saveKr();
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

              <form onSubmit={this.saveKr}>
                <div className="row">
                  <label
                    className="col-xl-4 col-12"
                  >Knowledge Resource ID</label>
                  <div className="col-xl-8 col-12 mb-4">
                    <input
                      type="text"
                      id="expertID"
                      className="form-control"
                      placeholder="KID"
                      aria-label="id"
                      aria-describedby="basicId"
                      value={this.state.krData.id || ""}
                      disabled
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-4 col-12">
                    <label>Knowledge Resource Label*</label>
                    <span
                      className="material-icons info-icon pl-2 align-middle pointer-style"
                      data-toggle="tooltip"
                      data-trigger="hover click"
                      title="The name should be of two-word label. And each of these names will have many knowledge resources hence you need to add a parenthesis to make it unique. Where is is not possible to get a two-word label, you may go up to 3 words.">
                      info
                    </span>
                  </div>
                  <div className="col-xl-8 col-12 mb-4">
                    <input
                      type="text"
                      id="label"
                      className="form-control"
                      placeholder="Knowledge Resource Label"
                      aria-label="label"
                      aria-describedby="basicLabel"
                      name="krLabel"
                      value={this.state.krData.name}
                      onChange={this.onKrChange}
                      autoComplete="off"
                      spellCheck="true"
                      onKeyUp={(event) => this.getSimilarKrs(event)}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-4 col-12">
                    <label>Knowledge Resource Description*</label>
                    <span
                      className="material-icons info-icon pl-2 align-middle pointer-style"
                      data-toggle="tooltip"
                      data-trigger="hover click"
                      title="Description should explain about this knowledge resource.">
                      info
                    </span>
                  </div>
                  <div className="col-xl-8 col-12 mb-4">
                    <textarea
                      className="form-control"
                      id="description"
                      spellCheck="true"
                      rows={
                        this.state.krData.description &&
                          this.state.krData.description.length > 200
                          ? (this.state.krData.description.length > 800
                            ? 15 : this.state.krData.description.length / 55)
                          : 4
                      }
                      placeholder="Knowledge Resource Description..."
                      name="krDescription"
                      value={this.state.krData.description}
                      onChange={this.onKrChange}
                      autoComplete="off"
                      onKeyUp={(event) => {
                        if (!this.state.keyCodes.includes(event.keyCode)) {
                          if (event.keyCode === 32) {
                            this.getSimilarKrs(event);
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

                <label>Knowledge Resource URL</label>
                <span
                  className="material-icons info-icon pl-2 align-middle pointer-style"
                  data-toggle="tooltip"
                  data-trigger="hover click"
                  title="URL should be the reference to this knowledge resource.">
                  info
                </span>

                {/* <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 p-0 mb-3"> */}
                <div className="row p-0">
                  <div className="col-xl-4 col-12 mb-2">
                    <input
                      type="text"
                      id="urlLabel"
                      className="form-control"
                      placeholder="Knowledge Resource URL name"
                      aria-label="label"
                      value={this.state.krLabel}
                      onChange={(e) => {
                        this.setState({
                          krLabel: e.target.value
                        })
                      }}
                      aria-describedby="basicLabel"
                      name="sourceName"
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-xl-6 col-12 mb-2">
                    <input
                      type="url"
                      id="url"
                      className="form-control"
                      placeholder="Knowledge Resource URL"
                      name="krUrl"
                      aria-label="url"
                      value={this.state.krURL || ""}
                      onChange={this.onKrChange}
                      onClick={() => {
                        this.setState({
                          getActivity: false,
                          showActivityLog: true,
                          getSelectedActivityID: "",
                        });
                      }}
                      autoComplete="off"
                      aria-describedby="basicURL"
                    />
                  </div>
                  <div className="col-xl-2 col-4 mb-2">
                    <button
                      type="button"
                      className={`btn save-button ml-1 mt-0 mr-3 review-secondary-button-1`}
                      disabled={!this.state.krURL}
                      onClick={this.addURL}>
                      ADD
                    </button>
                  </div>
                </div>
                {/* </div> */}

                <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 p-0 mb-3 custom-fixed-width table-heading-2 borderless p-0">
                  <table className="table table-striped table-hover table-fixed">
                    <tbody>
                      {this.state.urlList.map((i, j) => {
                        if (i !== null) {
                          return (
                            <tr key={j}>
                              <td width="90%">
                                <a
                                  href={(i.value) ? i.value : i}
                                  target="_blank"
                                  className="handle-text-overflow"
                                  rel="noopener noreferrer">
                                  {(i.name) ? i.name : ((i.value) ? i.value : i)}
                                </a>
                              </td>
                              <td width="10%">
                                <span
                                  className="material-icons pointer-style float-right"
                                  data-toggle="modal"
                                  data-target="#newDeleteConfirmModal1"
                                  onClick={() => {
                                    this.setState({
                                      selectedURL: i
                                    })
                                  }}>
                                  delete
                                </span>
                              </td>
                            </tr>
                          );
                        }
                        return null;
                      })}
                    </tbody>
                  </table>
                </div>

                <label htmlFor="exampleFormControlFile1">
                  Knowledge Resource Upload
                </label>
                <span
                  className="material-icons info-icon pl-2 align-middle pointer-style"
                  title="Knowledge/ Resources are artefacts (documents, software, etc.) provided by the MDO for an individual to perform a certain activity (e.g. standard operating procedures (SOPs), manual of procedures, policy manual, legal policies (i.e. Acts), etc.).">
                  info
                </span>
                <div
                  className="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 p-0 mb-3"
                  id="officerColumn3">
                  <div className="row p-0">
                    <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 pr-0">
                      <div
                        className="input-group pointer-style custom-row-1"
                        id="fileUpload">
                        <div className="col-10 p-0">
                          <input
                            style={{ display: "none" }}
                            type="file"
                            className="form-control"
                            name="krFile"
                            onChange={this.fileUpload}
                            aria-describedby="basic-addon2"
                            ref={(fileInput) => (this.fileInput = fileInput)}
                          />
                          <input
                            type="text"
                            className="form-control pointer-style"
                            onClick={() => {
                              this.fileInput.click();
                              this.setState({
                                getActivity: false,
                                showActivityLog: true,
                                getSelectedActivityID: "",
                              });
                            }}
                            value={this.state.fileName || "Browse for files"}
                            onChange={this.fileUpload}
                            aria-describedby="basic-addon3" />
                        </div>
                        <div className="col-2 p-0 input-group-append">
                          <span
                            className="input-group-text material-icons"
                            id="fileName"
                            // onClick={this.fileUpload}
                            style={{
                              paddingTop: "0.55em",
                              marginRight: "0.5em",
                            }}>
                            publish
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-2 col-xl-2 p-0">
                      <button
                        type="button"
                        className={`btn save-button ml-1 mt-0 mr-3 review-secondary-button-1`}
                        disabled={this.state.disableUpload || !this.state.fileName}
                        onClick={this.cloudUpload}>
                        UPLOAD
                      </button>

                      {/* <button
                        type="button"
                        className={`btn save-button mt-sm-2 mt-md-2 mt-lg-0 mr-3 review-secondary-button-1`}
                        onClick={() => {
                          this.addSource();
                        }}
                        disabled={!(this.state.sourceName || this.state.sourceURL)}>
                        Add
                      </button> */}

                    </div>
                  </div>
                </div>

                <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 p-0 mb-3 custom-fixed-width table-heading-2 borderless p-0">
                  <table className="table table-striped table-hover table-fixed">
                    <tbody>
                      {this.state.krFiles && this.state.krFiles.map((i, j) => {
                        if (i !== null) {
                          return (
                            <tr key={j}>
                              <td width="10%">
                                <span className="pr-2">
                                  {i.name.split(".").pop().split("?")[0] === "pdf" && (
                                    <img src="/img/files/pdf.svg" alt="ppf" />
                                  )}
                                  {i.name.split(".").pop().split("?")[0] === "png" && (
                                    <img src="/img/files/png.svg" alt="png" />
                                  )}
                                  {(i.name.split(".").pop().split("?")[0] === "jpg" ||
                                    i.name.split(".").pop().split("?")[0] === "jpeg") && (
                                      <img src="/img/files/jpg.svg" alt="jpg" />
                                    )}
                                  {i.name.split(".").pop().split("?")[0] === "txt" && (
                                    <img src="/img/files/text.svg" alt="txt" />
                                  )}
                                  {(i.name.split(".").pop().split("?")[0] === "ppt" ||
                                    i.name.split(".").pop().split("?")[0] === "pptx") && (
                                      <img src="/img/files/ppt.svg" alt="ppt" />
                                    )}
                                  {i.name.split(".").pop().split("?")[0] !== "ppt" &&
                                    i.name.split(".").pop().split("?")[0] !== "pptx" &&
                                    i.name.split(".").pop().split("?")[0] !== "pdf" &&
                                    i.name.split(".").pop().split("?")[0] !== "png" &&
                                    i.name.split(".").pop().split("?")[0] !== "jpg" &&
                                    i.name.split(".").pop().split("?")[0] !== "jpeg" && (
                                      <img src="/img/files/default.svg" alt="default" />
                                    )}
                                </span>
                              </td>
                              <td width="80%">
                                <a href={i.url} target="_blank"
                                  className="handle-text-overflow"
                                  rel="noopener noreferrer">
                                  {i.name.includes("https://")
                                    ? i.name
                                    : (i.name.includes("_")
                                      ? i.name.split(/_(.+)/)[1]
                                      : i.name)}
                                </a>
                              </td>
                              <td width="10%">
                                <span
                                  className="material-icons pointer-style float-right"
                                  data-toggle="modal"
                                  data-target="#newDeleteConfirmModal2"
                                  onClick={() => {
                                    this.setState({
                                      selectedFile: i
                                    })
                                  }}>
                                  delete
                                </span>
                              </td>
                            </tr>
                          );
                        }
                        return null;
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Delete the URL */}
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
                          Do you want to delete this URL?
                        </h5>
                      </div>

                      <div className="modal-body remove-scroll-x">
                        <p>
                          The selected URL and its mapping
                          related to this Knowledge resource
                          will be deleted.
                        </p>
                      </div>

                      <div className="modal-footer">
                        <div className="row">
                          <button
                            type="button"
                            className="btn save-button mr-2 danger-button-1"
                            data-dismiss="modal"
                            onClick={() => this.deleteURL()}>
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

                {/* Delete the file */}
                <div
                  className="modal fade fadeInUp"
                  id="newDeleteConfirmModal2"
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
                          Do you want to delete this file?
                        </h5>
                      </div>

                      <div className="modal-body remove-scroll-x">
                        <p>
                          The selected file and its mapping
                          related to this Knowledge resource
                          will be deleted.
                        </p>
                      </div>

                      <div className="modal-footer">
                        <div className="row">
                          <button
                            type="button"
                            className="btn save-button mr-2 danger-button-1"
                            data-dismiss="modal"
                            onClick={() => {
                              this.deleteCloudFile()
                            }}>
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
                                  krData: {
                                    ...this.state.krData,
                                    name: "",
                                    description: "",
                                  },
                                  krURL: "",
                                  enableSave: false,
                                  letterCount: 280,
                                  saveAsDraft: false,
                                  KrResponse: {},
                                  enableSaveAction: false,
                                  formUpdated: false,
                                },
                                () => {
                                  if (this.state.id !== 0) {
                                    this.getKrDetails(
                                      this.state.id,
                                      "KNOWLEDGERESOURCE"
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
                        role="tablist">
                        <li className="nav-item">
                          <a
                            className="nav-link active text-center custom-officer-margin"
                            id="pills-home-tab"
                            data-toggle="pill"
                            href="#pills-aa"
                            role="tab"
                            aria-controls="pills-home"
                            aria-selected="true">
                            Associated activites
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="tab-content m-2" id="pills-tabContent">
                      <div
                        className="tab-pane fade show active"
                        id="pills-aa"
                        role="tabpanel"
                        aria-labelledby="pills-home-tab">
                        {/*Search for mapped activities*/}
                        {this.state.mappedActivity && this.state.mappedActivity.length > 0 ? (
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
                                id="mappedActivitySearch"
                                onKeyUp={this.searchMappedActivity}
                              />
                            </div>
                            <div className="col-2">
                              {this.state.clearSearchMappedActivitiesKR && (
                                <span
                                  className="material-icons competency-area-close-button-3"
                                  onClick={() => {
                                    this.setState(
                                      {
                                        clearSearchInputMappedActivitiesKR: true,
                                      },
                                      () => {
                                        document.getElementById(
                                          "mappedActivitySearch"
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
                        )
                          : (
                            <div id="emptyState">
                              <p> No associated activites</p>
                            </div>
                          )}


                        <div id="mappedActivityList">
                          <div className="row col-12">
                            {this.state.mappedActivity &&
                              this.state.mappedActivity.map((value, index) => {
                                return (
                                  <div
                                    className={`col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 card mr-3 mb-3 cca-card pointer-style activity-border-1 custom-fixed-width-2 fadeInUp ${this.state.getSelectedActivityID ===
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
                                        {value.name
                                          ? value.name
                                          : value.description}
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
                        id="newDeleteLongTitle">
                        Do you want to delete this Knowledge Resource?
                      </h5>
                    </div>
                    <div className="modal-body remove-scroll-x">
                      <p>
                        The selected Knowledge Resource details and
                        all the mapping related to this Knowledge
                        resource will be deleted.
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
                              this.state.krData.id,
                              "KNOWLEDGERESOURCE"
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
        </div>
        {this.state.getActivity && (
          <ColumnFive
            {...this.props}
            roleId={this.state.getSelectedActivityID}
            type="ACTIVITY"
            childType={["KNOWLEDGERESOURCE"]}
            parentType={["ROLE"]}
            btnText="Jump to Activity"
            url="/collection-activities/"
            stateDataKey="isNewActivity"
            searchBarStyle="custom-search-bar-3"
            customHeight="custom-full-height-4"
          />
        )}
        {this.state.showActivityLog && (
          <ColumnSix
            {...this.props}
            customHeight="custom-full-height-4"
            activityLogs={this.state.activityLogs}
            activeTabId={this.state.columnSixTabRef}
            searchData={this.state.searchResultKr}
            searchHeading="Similar KR"
            searchClass="kr-border-1"
            searchClass2="activity-border-1"
            type="KNOWLEDGERESOURCE"
            btnText="Jump to KR"
            url="/collection-knowledge-resources/"
            stateDataKey="isNewKR"
            actioBtnText="Copy info to new KR"
            titleSecondary="Roles"
            functionName="getParentNode"
            receiveData={this.receiveData}
          />
        )}
      </div>
    );
  }
}

export default ColumnThree;
