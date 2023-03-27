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
import { capitalize } from "lodash";
import { VariableSizeList } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"

const competencyTypes = [
  {
    id: 1,
    name: "Behavioural",
  },
  {
    id: 2,
    name: "Domain",
  },
  { id: 3, name: "Functional" },
];

const customFilters = [
  {
    id: 1,
    name: "UNVERIFIED",
  },
  {
    id: 2,
    name: "VERIFIED",
  },
  { id: 3, name: "REJECTED" },
  { id: 4, name: "DRAFT" },
];

class ColumnTwo extends React.Component {
  listRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      isNewCompetency: false,
      allCompetenciesData: [],
      competencyResponse: [],
      competencyDetails: [],
      currentDept: "",
      selectedFilterBy: "",
      caFliterList: [],
      selectedCAList: [],
      selectedTypeList: [],
      selectedStatusList: [],
      selectedSourceList: [],
      sourceList: [],
      roles: "",
      searchString: ""
    };
    this.createNewCompetency = this.createNewCompetency.bind(this);
    this.searchCompetency = this.searchCompetency.bind(this);
    this.getCompetencyData = this.getCompetencyData.bind(this);
    this.decryptUtility = this.decryptUtility.bind(this);
    this.getCAList = this.getCAList.bind(this);
    this.selectionToggle = this.selectionToggle.bind(this);
    this.selectionToggleCT = this.selectionToggleCT.bind(this);
    this.selectionToggleStatus = this.selectionToggleStatus.bind(this);
    this.selectionToggleSource = this.selectionToggleSource.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
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
        this.getCompetencyData("COMPETENCY", this.state.currentDept);
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

      this.setState(
        {
          roles: originalTextRoles,
        },
        () => {
          this.getSourceList();
        }
      );
    }
  };

  getCompetencyData = (type, dept) => {
    if (dept !== "All MDO") {
      MasterService.getNodesByTypeAndDept(type, dept).then((response) => {
        this.handleGetCompetencyResponse(response);
      });
    } else {
      MasterService.getNodesByType(type).then((response) => {
        this.handleGetCompetencyResponse(response);
      });
    }
  };

  handleGetCompetencyResponse(response) {
    if (
      response &&
      response.data.statusInfo.statusCode === APP.CODE.SUCCESS
    ) {
      this.setState({
        allCompetenciesData: response.data.responseData,
        competencyResponse: response.data.responseData,
      }, () => {
        if (this.props.location && this.props.location.pathname) {
          const elementId = this.props.location.pathname.split(APP.COLLECTIONS_PATH.COMPETENCY);
          if (elementId.length > 1) {
            const elementIndex = this.state.competencyResponse.findIndex(obj => obj.id === elementId[1]);
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

  getSourceList() {
    MasterService.getSourceList("COMPETENCY").then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        this.setState({
          sourceList: response.data.responseData,
        });
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  }

  searchCompetency = (e) => {
    if (e && e.target && (e.target.value || e.target.value === "")) {
      this.setState({
        searchString: e.target.value
      }, () => {
        this.setState({
          allCompetenciesData: this.state.competencyResponse.filter((obj) => (obj.name
            && obj.name.toLowerCase().includes(this.state.searchString.toLowerCase())) ||
            (obj.id
              && obj.id.toLowerCase().includes(this.state.searchString.toLowerCase())))
        })
      })
    } else {
      this.setState({
        allCompetenciesData: this.state.competencyResponse
      })
    }
  }

  searchCAList = () => {
    let input, filter, ul, li, i, txtValue;
    input = document.getElementById("caSearch");
    filter = input.value.toUpperCase();
    ul = document.getElementById("caListFilter");
    li = ul.getElementsByTagName("p");

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      txtValue = li[i].innerHTML;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
        ul.getElementsByTagName("input")[i].style.display = "";
      } else {
        li[i].style.display = "none";
        ul.getElementsByTagName("input")[i].style.display = "none";
      }
    }
  };

  createNewCompetency = () => {
    let scroll = document.getElementById("new");
    scroll.scrollIntoView();
    this.setState(
      {
        isNewCompetency: true,
      },
      () => {
        this.props.history.push({
          pathname: "/collection-competencies/0",
          state: { isNewCompetency: true, id: 0, type: "COMPETENCY" },
        });
      }
    );
    if (
      this.props.history &&
      this.props.history.location.state &&
      this.props.history.location.state.isNewCompetency
    ) {
      this.setState({
        isNewCompetency: true,
      });
    }
  };

  getCAList = () => {
    let type = "COMPETENCYAREA";
    MasterService.getNodesByType(type).then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        this.setState({
          caFliterList: response.data.responseData,
        });
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  selectionToggle = (name) => {
    // Enable multiple selection from the list in the modal
    if (this.state.selectedCAList.length) {
      this.state.selectedCAList.map((k, l) => {
        this.setState((prevState) => ({
          selectedCAList: [k.name, ...prevState.selectedCAList],
        }));
        return null;
      });
    }
    this.setState(
      {
        selectedCAList: [...this.state.selectedCAList, name],
      },
      () => {
        this.state.selectedCAList.forEach((i, j) => {
          if (
            this.state.selectedCAList.indexOf(i) !== j &&
            this.state.selectedCAList.includes(name)
          ) {
            if (this.state.selectedCAList.indexOf(name) > -1) {
              this.state.selectedCAList.splice(
                this.state.selectedCAList.indexOf(name),
                1
              );
              this.state.selectedCAList.splice(
                this.state.selectedCAList.indexOf(i),
                1
              );
            }
            this.setState({
              selectedCAList: this.state.selectedCAList,
            });
          }
        });
      }
    );

    if (
      this.state.selectedCAList.length === 1 &&
      !this.state.selectedTypeList.length
    ) {
      this.getCompetencyData("COMPETENCY", this.state.currentDept);
    }
  };

  selectionToggleCT = (name) => {
    // Enable multiple selection from the list in the modal
    if (this.state.selectedTypeList.length) {
      this.state.selectedTypeList.map((k, l) => {
        this.setState((prevState) => ({
          selectedTypeList: [k.name, ...prevState.selectedTypeList],
        }));
        return null;
      });
    }
    this.setState(
      {
        selectedTypeList: [...this.state.selectedTypeList, name],
      },
      () => {
        this.state.selectedTypeList.forEach((i, j) => {
          if (
            this.state.selectedTypeList.indexOf(i) !== j &&
            this.state.selectedTypeList.includes(name)
          ) {
            if (this.state.selectedTypeList.indexOf(name) > -1) {
              this.state.selectedTypeList.splice(
                this.state.selectedTypeList.indexOf(name),
                1
              );
              this.state.selectedTypeList.splice(
                this.state.selectedTypeList.indexOf(i),
                1
              );
            }
            this.setState({
              selectedTypeList: this.state.selectedTypeList,
            });
          }
        });
      }
    );

    if (
      this.state.selectedTypeList.length === 1 &&
      !this.state.selectedCAList.length
    ) {
      this.getCompetencyData("COMPETENCY", this.state.currentDept);
    }
  };

  selectionToggleStatus = (name) => {
    // Enable multiple selection from the list in the modal
    if (this.state.selectedStatusList.length) {
      this.state.selectedStatusList.map((k, l) => {
        this.setState((prevState) => ({
          selectedStatusList: [k.name, ...prevState.selectedStatusList],
        }));
        return null;
      });
    }
    this.setState(
      {
        selectedStatusList: [...this.state.selectedStatusList, name],
      },
      () => {
        this.state.selectedStatusList.forEach((i, j) => {
          if (
            this.state.selectedStatusList.indexOf(i) !== j &&
            this.state.selectedStatusList.includes(name)
          ) {
            if (this.state.selectedStatusList.indexOf(name) > -1) {
              this.state.selectedStatusList.splice(
                this.state.selectedStatusList.indexOf(name),
                1
              );
              this.state.selectedStatusList.splice(
                this.state.selectedStatusList.indexOf(i),
                1
              );
            }
            this.setState({
              selectedStatusList: this.state.selectedStatusList,
            });
          }
        });
      }
    );

    if (
      this.state.selectedStatusList.length === 1 &&
      (!this.state.selectedCAList.length || !this.state.selectedTypeList.length)
    ) {
      this.getCompetencyData("COMPETENCY", this.state.currentDept);
    }
  };

  selectionToggleSource = (name) => {
    // Enable multiple selection from the list in the modal
    if (this.state.selectedSourceList.length) {
      this.state.selectedSourceList.map((k, l) => {
        this.setState((prevState) => ({
          selectedSourceList: [k.name, ...prevState.selectedSourceList],
        }));
        return null;
      });
    }
    this.setState(
      {
        selectedSourceList: [...this.state.selectedSourceList, name],
      },
      () => {
        this.state.selectedSourceList.forEach((i, j) => {
          if (
            this.state.selectedSourceList.indexOf(i) !== j &&
            this.state.selectedSourceList.includes(name)
          ) {
            if (this.state.selectedSourceList.indexOf(name) > -1) {
              this.state.selectedSourceList.splice(
                this.state.selectedSourceList.indexOf(name),
                1
              );
              this.state.selectedSourceList.splice(
                this.state.selectedSourceList.indexOf(i),
                1
              );
            }
            this.setState({
              selectedSourceList: this.state.selectedSourceList,
            });
          }
        });
      }
    );

    if (
      this.state.selectedSourceList.length === 1 &&
      (!this.state.selectedCAList.length || !this.state.selectedTypeList.length)
    ) {
      this.getCompetencyData("COMPETENCY", this.state.currentDept);
    }
  };

  applyFilter = () => {
    let payload = {
      type: "COMPETENCY",
      filters: [],
    };
    let filterApplied = false;

    // area
    if (this.state.selectedCAList.length) {
      filterApplied = true;
      payload.filters.push({
        field: "area",
        values: this.state.selectedCAList,
      });
    }
    //type
    if (this.state.selectedTypeList.length) {
      filterApplied = true;
      payload.filters.push({
        field: "type",
        values: this.state.selectedTypeList,
      });
    }
    //status
    if (this.state.selectedStatusList.length) {
      filterApplied = true;
      payload.filters.push({
        field: "status",
        values: this.state.selectedStatusList,
      });
    }
    // adding source filters
    if (this.state.selectedSourceList.length) {
      filterApplied = true;
      payload.filters.push({
        field: "source",
        values: this.state.selectedSourceList,
      });
    }

    if (!filterApplied) {
      this.getCompetencyData("COMPETENCY", this.state.currentDept);
    }

    if (payload.filters.length > 0) {
      MasterService.filterNodes(payload).then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState({
            allCompetenciesData: response.data.responseData,
          });
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
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
        isNewCompetency: false,
        // clearSearch: false,
        // clearSearchInput: false
      });
      this.props.history.location.state.stayOn = false;
      setTimeout(() => {
        if (
          !this.state.selectedCAList.length &&
          !this.state.selectedTypeList.length &&
          !this.state.selectedStatusList.length
        ) {
          this.getCompetencyData("COMPETENCY", this.state.currentDept);
        }
      }, 800);
    }

    if (
      prevState.selectedFilterBy &&
      prevState.isNewCompetency !== this.state.isNewCompetency
    ) {
      this.setState(
        {
          selectedCAList: "",
          selectedTypeList: "",
          selectedStatusList: "",
        },
        () => {
          this.getCompetencyData("COMPETENCY", this.state.currentDept);
        }
      );
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
    const viewAllCompetency = ({ index, style }) =>
      <div style={style}>
        <NavLink
          key={this.state.allCompetenciesData[index].id}
          id={this.state.allCompetenciesData[index].id}
          className=""
          to={{
            pathname: "/collection-competencies/" + this.state.allCompetenciesData[index].id,
            state: {
              showColumnThree: true,
              id: this.state.allCompetenciesData[index].id,
              type: "COMPETENCY",
            },
          }}
        >
          <div
            className={`pl-3 pt-3 ml-1 mr-1 mb-1 ${this.props.history &&
              this.props.history.location.pathname ===
              "/collection-competencies/" + this.state.allCompetenciesData[index].id
              ? "active-list-selection-1 competency-border-1"
              : "list-selection-1 competency-border-1"
              } `}
          >
            <div className="row p-0 w-100">
              <div className="col-10">
                <h3 className="custom-heading-1 truncateText" title={this.state.allCompetenciesData[index].name}>
                  {this.state.allCompetenciesData[index].name}</h3>
                <p className="custom-sub-heading-1">{this.state.allCompetenciesData[index].id}</p>
              </div>
              {(this.state.allCompetenciesData[index].status
                && (this.state.allCompetenciesData[index].status === "DRAFT"
                  || this.state.allCompetenciesData[index].status === APP.NODE_STATUS.REJECTED))
                ? (
                  <React.Fragment>
                    {(this.state.allCompetenciesData[index].status === "DRAFT") && (
                      <div className="col-2 center-align">
                        <span className="draft-icon-1 pr-0">
                          <img src={DraftIcon} alt="draft stage" />
                        </span>
                      </div>
                    )}
                    {(this.state.allCompetenciesData[index].status === APP.NODE_STATUS.REJECTED) && (
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
                    {(!this.state.allCompetenciesData[index].secondaryStatus
                      || this.state.allCompetenciesData[index].secondaryStatus === "UNVERIFIED") && (
                        <div className="col-2 center-align">
                          <span className="under-review-icon-1 pr-0">
                            <img src={UnderReviewIcon} alt="review stage" />
                          </span>
                        </div>
                      )}
                    {(this.state.allCompetenciesData[index].secondaryStatus &&
                      this.state.allCompetenciesData[index].secondaryStatus === "VERIFIED") && (
                        <div className="col-2 center-align">
                          <span className="check-icon-1 pr-0">
                            <img src={CheckIcon} alt="verified stage" />
                          </span>
                        </div>
                      )}
                    {(this.state.allCompetenciesData[index].secondaryStatus &&
                      this.state.allCompetenciesData[index].secondaryStatus === "REJECTED") && (
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
          {/* Search */}
          <h1 className="mt-3 mb-4">Search for a Competency</h1>
          <div className="row col-12 p-0">
            <div className="col-9" id="officerBucketsList">
              <input
                type="text"
                style={{ width: "140%" }}
                className="form-control mb-4 custom-search-5"
                placeholder="Search..."
                aria-label="Search"
                id="competencySearch"
                value={this.state.searchString}
                onChange={this.searchCompetency}
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

          {/* Filter */}
          <div
            className="pointer-style"
            data-toggle="modal"
            data-target="#newFilterModal"
            onClick={() => {
              this.setState({ selectedFilterBy: "Area" });
              this.getCAList();
            }}
          >
            {(this.state.selectedCAList.length > 0 ||
              this.state.selectedTypeList.length > 0 ||
              this.state.selectedStatusList.length > 0 ||
              this.state.selectedSourceList.length > 0) && (
                <p className="filter-1 bold-font-1">
                  {"Filter applied(" +
                    (this.state.selectedCAList.length +
                      this.state.selectedTypeList.length +
                      this.state.selectedStatusList.length +
                      this.state.selectedSourceList.length) +
                    ")"}
                </p>
              )}
            {!this.state.selectedCAList.length > 0 &&
              !this.state.selectedTypeList.length > 0 &&
              !this.state.selectedStatusList.length > 0 &&
              !this.state.selectedSourceList.length > 0 && (
                <p className="filter-1">Filter</p>
              )}
          </div>

          {/* Filter modal */}
          <div
            className="modal fade fadeInUp"
            id="newFilterModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="newFilterModalTitle"
            aria-hidden="true"
          >
            <div
              className="modal-dialog modal-dialog-centered modal-lg"
              role="document"
            >
              <div className="modal-content">
                <div className="row ml-0 w-100">
                  {/* Column one */}
                  <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 pt-2">
                    <div className="modal-header">
                      <h5 className="modal-title" id="newFilterModalLongTitle">
                        Filter by
                      </h5>
                    </div>

                    <div className="pl-3 pt-3">
                      {this.state.selectedCAList.length > 0 && (
                        <h4
                          className={`pointer-style bb-1 ${this.state.selectedFilterBy === "Area"
                            ? "active-list-selection-3"
                            : "list-selection-5"
                            } `}
                          onClick={() =>
                            this.setState({
                              selectedFilterBy: "Area",
                            })
                          }
                        >
                          {"Area" +
                            " (" +
                            this.state.selectedCAList.length +
                            ")"}
                        </h4>
                      )}
                      {this.state.selectedCAList.length === 0 && (
                        <h4
                          className={`pointer-style bb-1 ${this.state.selectedFilterBy === "Area"
                            ? "active-list-selection-3"
                            : "list-selection-5"
                            } `}
                          onClick={() =>
                            this.setState({
                              selectedFilterBy: "Area",
                            })
                          }
                        >
                          Area
                        </h4>
                      )}

                      {this.state.selectedTypeList.length > 0 && (
                        <h4
                          className={`pointer-style bb-1 ${this.state.selectedFilterBy === "Competency type"
                            ? "active-list-selection-3"
                            : "list-selection-5"
                            } `}
                          onClick={() =>
                            this.setState({
                              selectedFilterBy: "Competency type",
                            })
                          }
                        >
                          {"Competency type" +
                            " (" +
                            this.state.selectedTypeList.length +
                            ")"}
                        </h4>
                      )}
                      {this.state.selectedTypeList.length === 0 && (
                        <h4
                          className={`pointer-style bb-1 ${this.state.selectedFilterBy === "Competency type"
                            ? "active-list-selection-3"
                            : "list-selection-5"
                            } `}
                          onClick={() =>
                            this.setState({
                              selectedFilterBy: "Competency type",
                            })
                          }
                        >
                          Competency type
                        </h4>
                      )}

                      {this.state.selectedStatusList.length > 0 && (
                        <h4
                          className={`pointer-style bb-1 ${this.state.selectedFilterBy === "Status"
                            ? "active-list-selection-3"
                            : "list-selection-5"
                            } `}
                          onClick={() =>
                            this.setState({
                              selectedFilterBy: "Status",
                            })
                          }
                        >
                          {"Status" +
                            " (" +
                            this.state.selectedStatusList.length +
                            ")"}
                        </h4>
                      )}
                      {this.state.selectedStatusList.length === 0 && (
                        <h4
                          className={`pointer-style bb-1 ${this.state.selectedFilterBy === "Status"
                            ? "active-list-selection-3"
                            : "list-selection-5"
                            } `}
                          onClick={() =>
                            this.setState({
                              selectedFilterBy: "Status",
                            })
                          }
                        >
                          Status
                        </h4>
                      )}
                      <h4
                        className={`pointer-style bb-1 ${this.state.selectedFilterBy === "Source"
                          ? "active-list-selection-3"
                          : "list-selection-5"
                          } `}
                        onClick={() =>
                          this.setState({
                            selectedFilterBy: "Source",
                          })
                        }
                      >
                        {this.state.selectedSourceList &&
                          this.state.selectedSourceList.length > 0
                          ? "Source (" +
                          this.state.selectedSourceList.length +
                          ")"
                          : "Source"}
                      </h4>
                    </div>

                    <div className="modal-body remove-scroll-x"></div>
                  </div>
                  {/* Column two */}
                  <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 custom-content-background pt-2">
                    {(this.state.selectedFilterBy === "Area" ||
                      this.state.selectedFilterBy === "Source") && (
                        <div className="modal-header">
                          <div
                            className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 p-0"
                            id="officerBucketsList"
                          >
                            <input
                              type="text"
                              className="form-control mb-2 custom-search-7"
                              placeholder="Search..."
                              aria-label="Search"
                              id="caSearch"
                              onKeyUp={this.searchCAList}
                              aria-describedby="basic-addon1"
                            />
                          </div>
                        </div>
                      )}

                    <div className="modal-body remove-scroll-x pt-0">
                      {this.state.selectedFilterBy === "Area" && (
                        <React.Fragment>
                          <div className="ml-4">
                            <div id="caListFilter">
                              {this.state.caFliterList &&
                                this.state.caFliterList.map((i, j) => {
                                  if (i && i.name) {
                                    return (
                                      <div
                                      className="row custom-search-checkbox-1"
                                      key={j}
                                    >
                                      {this.state.selectedCAList.includes(
                                        i.name
                                      ) && (
                                          <input
                                            checked
                                            type="checkbox"
                                            className="mr-3 custom-search-checkbox-1 mt-1"
                                            onChange={() =>
                                              this.selectionToggle(i.name)
                                            }
                                          />
                                        )}
                                      {!this.state.selectedCAList.includes(
                                        i.name
                                      ) && (
                                          <input
                                            type="checkbox"
                                            className="mr-3 custom-search-checkbox- mt-1"
                                            onChange={() =>
                                              this.selectionToggle(i.name)
                                            }
                                          />
                                        )}

                                      <p
                                        className="filter-check-list pointer-style"
                                        onClick={() =>
                                          this.selectionToggle(i.name)
                                        }
                                      >
                                        {i.name}
                                      </p>
                                    </div>
                                    );
                                  }
                                  return null;
                                })}
                            </div>
                          </div>
                        </React.Fragment>
                      )}
                      {this.state.selectedFilterBy === "Competency type" && (
                        <React.Fragment>
                          <div className="ml-4 pt-5">
                            {competencyTypes &&
                              competencyTypes.map((i, j) => {
                                return (
                                  <div
                                    className="row custom-search-checkbox-1"
                                    key={i.id}
                                  >
                                    {this.state.selectedTypeList.includes(
                                      i.name
                                    ) && (
                                        <input
                                          checked
                                          type="checkbox"
                                          className="mr-3 custom-search-checkbox-1 mt-1"
                                          onChange={() =>
                                            this.selectionToggleCT(i.name)
                                          }
                                        />
                                      )}
                                    {!this.state.selectedTypeList.includes(
                                      i.name
                                    ) && (
                                        <input
                                          type="checkbox"
                                          className="mr-3 custom-search-checkbox-1 mt-1"
                                          onChange={() =>
                                            this.selectionToggleCT(i.name)
                                          }
                                        />
                                      )}
                                    <p
                                      className="filter-check-list pointer-style"
                                      onClick={() =>
                                        this.selectionToggleCT(i.name)
                                      }
                                    >
                                      {i.name}
                                    </p>
                                  </div>
                                );
                              })}
                          </div>
                        </React.Fragment>
                      )}

                      {this.state.selectedFilterBy === "Status" && (
                        <React.Fragment>
                          <div className="ml-4 pt-5">
                            {customFilters &&
                              customFilters.map((i, j) => {
                                return (
                                  <div
                                    className="row custom-search-checkbox-1"
                                    key={i.id}
                                  >
                                    {this.state.selectedStatusList.includes(
                                      i.name
                                    ) && (
                                        <input
                                          checked
                                          type="checkbox"
                                          className="mr-3 custom-search-checkbox-1 mt-1"
                                          onChange={() =>
                                            this.selectionToggleStatus(i.name)
                                          }
                                        />
                                      )}
                                    {!this.state.selectedStatusList.includes(
                                      i.name
                                    ) && (
                                        <input
                                          type="checkbox"
                                          className="mr-3 custom-search-checkbox-1 mt-1"
                                          onChange={() =>
                                            this.selectionToggleStatus(i.name)
                                          }
                                        />
                                      )}
                                    <p
                                      className="filter-check-list pointer-style"
                                      onClick={() =>
                                        this.selectionToggleStatus(i.name)
                                      }
                                    >
                                      {capitalize(i.name)}
                                    </p>
                                  </div>
                                );
                              })}
                          </div>
                        </React.Fragment>
                      )}

                      {this.state.selectedFilterBy === "Source" && (
                        <React.Fragment>
                          <div className="ml-4">
                            <div id="caListFilter">
                              {this.state.sourceList &&
                                this.state.sourceList.map((i, j) => {
                                  if (i && i !== "nil" && i !== "null") {
                                    return (
                                      <div
                                        className="row custom-search-checkbox-1"
                                        key={i}
                                      >
                                        {this.state.selectedSourceList.includes(
                                          i
                                        ) && (
                                            <input
                                              checked
                                              type="checkbox"
                                              className="mr-3 custom-search-checkbox-1 mt-1"
                                              onChange={() =>
                                                this.selectionToggleSource(i)
                                              }
                                            />
                                          )}
                                        {!this.state.selectedSourceList.includes(
                                          i
                                        ) && (
                                            <input
                                              type="checkbox"
                                              className="mr-3 custom-search-checkbox-1 mt-1"
                                              onChange={() =>
                                                this.selectionToggleSource(i)
                                              }
                                            />
                                          )}
                                        <p
                                          className="filter-check-list pointer-style"
                                          onClick={() =>
                                            this.selectionToggleSource(i)
                                          }
                                        >
                                          {i}
                                        </p>
                                      </div>
                                    );
                                  } else {
                                    return (<div></div>);
                                  }
                                })}
                            </div>
                          </div>
                        </React.Fragment>
                      )}
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <div className="row">
                    {(this.state.selectedCAList.length > 0 ||
                      this.state.selectedTypeList.length > 0 ||
                      this.state.selectedStatusList.length > 0 ||
                      this.state.selectedSourceList.length > 0) && (
                        <button
                          type="button"
                          className="btn save-button mr-2 custom-primary-button-3"
                          data-dismiss="modal"
                          onClick={() =>
                            this.setState(
                              {
                                selectedCAList: "",
                                selectedTypeList: "",
                                selectedStatusList: "",
                                selectedSourceList: "",
                              },
                              () => {
                                this.getCompetencyData(
                                  "COMPETENCY",
                                  this.state.currentDept
                                );
                              }
                            )
                          }
                        >
                          Clear all filters
                        </button>
                      )}

                    <button
                      type="button"
                      className="btn save-button mr-2 custom-primary-button-3"
                      data-dismiss="modal"
                    >
                      Close
                    </button>

                    {(this.state.selectedCAList.length > 0 ||
                      this.state.selectedTypeList.length > 0 ||
                      this.state.selectedStatusList.length > 0 ||
                      this.state.selectedSourceList.length > 0) && (
                        <button
                          type="button"
                          className="btn save-button mr-2 custom-primary-button height-1  "
                          onClick={() => this.applyFilter()}
                          data-dismiss="modal"
                        >
                          Apply
                        </button>
                      )}

                    {!this.state.selectedCAList.length > 0 &&
                      !this.state.selectedTypeList.length > 0 &&
                      !this.state.selectedStatusList.length > 0 &&
                      !this.state.selectedSourceList.length > 0 && (
                        <button
                          type="button"
                          className="btn save-button mr-2 custom-primary-button-disabled height-1"
                          disabled
                        >
                          Apply
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* List of competencies */}
          <div className="custom-div-size-1">
            <div id="competencyList">
              {/* New competency */}
              <div className="" id="new">
                {(this.state.isNewCompetency ||
                  (this.props.history &&
                    this.props.history.location.state &&
                    this.props.history.location.state.isNewCompetency)) && (
                    <NavLink
                      className=""
                      to={{
                        pathname: "/collection-competencies/" + 0,
                        state: {
                          isNewCompetency: true,
                          id: 0,
                          type: "COMPETENCY",
                        },
                      }}
                    >
                      <div
                        className={`pl-3 pt-3 ml-1 mr-1 mb-1 fadeInUp ${this.props.history &&
                          this.props.history.location.pathname ===
                          "/collection-competencies/" + 0
                          ? "active-list-selection-1 competency-border-1"
                          : "new-profile-list competency-border-1"
                          } `}
                      >
                        <h3 className="new-item custom-heading-1">
                          *Competency label
                        </h3>
                        <p className="custom-sub-heading-1 new-item">CID000</p>
                      </div>
                    </NavLink>
                  )}
              </div>

              {/*Existing competencies*/}
              {this.state.allCompetenciesData && this.state.allCompetenciesData.length > 0 && (
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
                        itemCount={this.state.allCompetenciesData.length}
                        itemSize={index => this.state.allCompetenciesData[index].name ? 85 : 70}
                        ref={this.listRef}
                        overscanCount={100}>
                        {viewAllCompetency}
                      </VariableSizeList>
                    )}
                  </AutoSizer>
                </div>
              )}

              {this.state.allCompetenciesData.length === 0 &&
                !this.state.isNewCompetency && (
                  <p className="pt-3 pl-3 activity-log-name m-0">
                    No competency found!
                  </p>
                )}
            </div>
          </div>
        </div>
        <button
          type="button"
          className="btn save-button p-3 push-bottom-3 custom-primary-button-3 button-type-3"
          onClick={this.createNewCompetency}
        >
          New Competency
        </button>
      </div>
    );
  }
}

export default ColumnTwo;
