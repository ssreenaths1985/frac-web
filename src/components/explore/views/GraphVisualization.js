import React from "react";
import cytoscape from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";
import autopanOnDrag from "cytoscape-autopan-on-drag";
import coseBilkent from "cytoscape-cose-bilkent";
import EditView from "./EditView";
import NewNode from "./NewNode";
import CryptoJS from "crypto-js";

/**
 ** Graph visualization to depicts the relations between
 ** different dictionaries. Built using CytoscapeJS
 **/

// Defined layout to render graph
cytoscape.use(coseBilkent);
autopanOnDrag(cytoscape);

class GraphVisualization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      w: 0,
      h: 0,
      elements: [],
      clearTarget: "",
      showCS: false,
      getSelectedID: "",
      getSelectedType: "",
      getChildType: "",
      getParentType: "",
      borderStyleClass: "",
      btnText: "",
      url: "",
      stateDataKey: "",
      subHeading: "",
      showRightColumn: false,
      newNodeText: "*Untitled",
      clearNewNode: "",
      showNewNode: "",
      selectedItem: "",
      toggle: false,
      zoomToggle: false,
      createNewItem: false,
      searchViewActivated: false,
      currentDept: "",
      allDeptData: [],
      roles: "",
      clearSearch: false,
      clearSearchInput: false,
    };
    this.setUpListeners = this.setUpListeners.bind(this);
    this.getDataTransformed = this.getDataTransformed.bind(this);
    this.getFit = this.getFit.bind(this);
    this.highlightNodes = this.highlightNodes.bind(this);
    this.clearSelection = this.clearSelection.bind(this);
    this.createNewNode = this.createNewNode.bind(this);
    this.removeNewNode = this.removeNewNode.bind(this);
    this.toggleSwitch = this.toggleSwitch.bind(this);
    this.checkAccessForExplore = this.checkAccessForExplore.bind(this);
    this.searchForDeptExplore = this.searchForDeptExplore.bind(this);
  }

  componentDidMount() {
    this.setState({
      w: window.innerWidth,
      h: window.innerHeight,
    });
    this.checkAccessForExplore();
  }

  // Function to transform API data into required form
  // in order to render the graph
  getDataTransformed = (data) => {
    let dataArrayOne = [];
    let dataArrayTwo = [];
    let dataArray = [];

    if (data && data.dataNodes) {
      data.dataNodes.map((value, index) => {
        if (value.type === "POSITION") {
          dataArrayOne.push({
            data: { id: value.id, label: value.name },
            style: { "background-color": "#556bf1" },
          });
        } else if (value.type === "ROLE") {
          dataArrayOne.push({
            data: { id: value.id, label: value.name },
            style: { "background-color": "#d6ae31" },
          });
        } else if (value.type === "ACTIVITY") {
          dataArrayOne.push({
            data: { id: value.id, label: value.name },
            style: { "background-color": "#bc3e28" },
          });
        } else if (value.type === "COMPETENCY") {
          dataArrayOne.push({
            data: { id: value.id, label: value.name },
            style: { "background-color": "#82e7c2" },
          });
        } else {
          dataArrayOne.push({
            data: { id: value.id, label: value.name },
            style: { "background-color": "#5f449b" },
          });
        }
        return null;
      });
    }

    if (data && data.associations) {
      data.associations.map((i, j) => {
        dataArrayTwo.push({
          data: {
            source: i.source,
            target: i.target,
            label: i.label,
          },
        });

        return null;
      });
    }

    dataArray = [...dataArrayOne, ...dataArrayTwo];

    return dataArray;
  };

  // Function to listen the click event
  setUpListeners = (item, flag) => {
    if (this.cy && flag) {
      this.cy.nodes().map((value, index) => {
        if (value._private.data.id.startsWith(item)) {
          value.style({
            width: 30,
            height: 30,
            "border-color": "#FFF",
            "border-width": "0.125em",
          });
        }
        return null;
      });
    }

    if (this.cy && !flag) {
      this.cy.nodes().map((value, index) => {
        if (value._private.data.id.startsWith(item)) {
          value.style({
            width: 15,
            height: 15,
            "border-color": "none",
            "border-width": "0em",
          });
        }
        return null;
      });
    }
  };

  // Function to make graph to get fit into the viewport
  getFit = (isZoom) => {
    if (this.cy) {
      this.cy.fit();
    }
  };

  // Function to create a new node and opens the left side column
  createNewNode = (value) => {
    if (!this.state.clearNewNode) {
      this.cy.add({
        data: {
          label: this.state.newNodeText,
        },
        style: {
          width: 35,
          height: 35,
          "background-color": "#ABABAC",
          "border-color": "white",
          "border-width": "2px",
        },
      });
      this.setState({
        clearNewNode: this.cy.nodes('[label = "*Untitled"]'),
      });
      setTimeout(() => {
        this.cy.fit();
      }, 500);
    }
  };

  // Function to remove new node and closes the left side column
  removeNewNode = (value) => {
    if (this.state.clearNewNode) {
      this.cy.remove(this.state.clearNewNode);
      this.setState({
        clearNewNode: "",
      });
    }
  };

  // Function highlights the selected node and display
  // the node info in the right side column
  highlightNodes = (e) => {
    e.preventDefault();
    var selectedNodes = e.target;

    if (selectedNodes[0]._private.data.id.includes("PID")) {
      this.setState({
        getSelectedType: "POSITION",
        getChildType: ["ROLE"],
        getParentType: [],
        url: "/collection-positions/",
        btnText: "Jump to Position",
        stateDataKey: "isNewPosition",
        borderStyleClass: "position-border-1",
      });
    } else if (
      selectedNodes[0]._private.data.id.includes("RID") &&
      !selectedNodes[0]._private.data.id.includes("KRID")
    ) {
      this.setState({
        getSelectedType: "ROLE",
        getChildType: ["ACTIVITY", "COMPETENCY"],
        getParentType: ["POSITION"],
        url: "/collection-roles/",
        btnText: "Jump to Role",
        stateDataKey: "isNewRole",
        borderStyleClass: "role-border-1",
      });
    } else if (selectedNodes[0]._private.data.id.includes("AID")) {
      this.setState({
        getSelectedType: "ACTIVITY",
        getChildType: ["KNOWLEDGERESOURCE"],
        getParentType: ["ROLE"],
        url: "/collection-activities/",
        btnText: "Jump to Activity",
        stateDataKey: "isNewActivity",
        borderStyleClass: "activity-border-1",
      });
    } else if (selectedNodes[0]._private.data.id.includes("CID")) {
      this.setState({
        getSelectedType: "COMPETENCY",
        getChildType: ["COMPETENCIESLEVEL"],
        getParentType: ["ROLE"],
        url: "/collection-competencies/",
        btnText: "Jump to Competency",
        stateDataKey: "isNewCompetency",
        borderStyleClass: "competency-border-1",
      });
    } else if (selectedNodes[0]._private.data.id.includes("KRID")) {
      this.setState({
        getSelectedType: "KNOWLEDGERESOURCE",
        getChildType: [],
        getParentType: ["ACTIVITY"],
        url: "/collection-knowledge-resources/",
        btnText: "Jump to KR",
        stateDataKey: "isNewKR",
        borderStyleClass: "kr-border-1",
      });
    }

    this.setState(
      {
        getSelectedID: selectedNodes[0]._private.data.id,
        showRightColumn: true,
      },
      () => {
        let data = {
          selectedID: this.state.getSelectedID,
          selectedType: this.state.getSelectedType,
          childType: this.state.getChildType,
          parentType: this.state.getParentType,
          btnText: this.state.btnText,
          url: this.state.url,
          stateDataKey: this.state.stateDataKey,
        };
        this.props.commandFunction(this.state.showRightColumn, data);
      }
    );
    selectedNodes.style({
      width: 53,
      height: 54,
      "border-color": "#FFF",
      "border-width": "0.205em",
    });

    this.setState({
      showCS: true,
    });

    setTimeout(() => {
      this.cy.fit();
    }, 500);

    this.cy
      .elements()
      .difference(selectedNodes.outgoers())
      .not(selectedNodes)
      .addClass("semitransp");

    selectedNodes.addClass("highlight").outgoers().addClass("highlight");
  };

  // Function clears node selection and closes the right side column
  clearSelection = (target) => {
    var clearNodes = target;
    setTimeout(() => {
      this.cy.fit();
    }, 500);
    this.cy.elements().removeClass("semitransp");
    this.setState(
      {
        getSelectedID: "",
        showRightColumn: false,
      },
      () => {
        this.props.commandFunction(this.state.showRightColumn);
      }
    );
    clearNodes.removeClass("highlight").outgoers().removeClass("highlight");
    clearNodes.style({
      width: 15,
      height: 15,
      "border-color": "none",
      "border-width": "0em",
    });
    this.setState({
      showCS: false,
    });
  };

  // Function to highlight select network of nodes
  toggleSwitch = () => {
    let flag = "";
    if (this.state.toggle) {
      flag = false;
    } else {
      flag = true;
    }

    this.setState({
      toggle: flag,
    });
  };

  checkAccessForExplore = () => {
    setTimeout(() => {
      if (localStorage.getItem("stateFromNav")) {
        let bytes = CryptoJS.AES.decrypt(
          localStorage.getItem("stateFromNav"),
          "igotcheckIndia*"
        );
        let originalText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        this.setState({
          roles: originalText,
        });
      }
    }, 300);
  };

  searchForDeptExplore = () => {
    // Declare variables
    let input, filter, ul, li, i, txtValue;
    if (!this.state.clearSearchInput) {
      this.setState({
        clearSearch: true,
      });
    } else {
      this.setState({
        clearSearch: false,
        clearSearchInput: false,
      });
    }

    input = document.getElementById("deptSearch");

    if (input.value.length === 0) {
      this.setState({
        clearSearch: false,
        clearSearchInput: false,
      });
    }

    if (!this.state.clearSearchInput) {
      filter = input.value.toUpperCase();
    } else {
      filter = "";
    }

    ul = document.getElementById("deptList");
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
    if (this.props.showNewNode && !prevProps.showNewNode) {
      this.createNewNode();
    }
    if (this.props.graphData !== prevProps.graphData) {
      this.removeNewNode();
    }
  }

  render() {
    // Getting API data via props
    let { graphData, zoom, showNewNode } = this.props;
    // Open ups right side column
    if (this.state.selectedItem) {
      this.setUpListeners(this.state.selectedItem, this.state.toggle);
    }

    // Enable zoom feature
    if (zoom) {
      this.getFit(zoom);
    }

    if (!showNewNode) {
      this.removeNewNode();
    }

    // Sending received API data for transformation function
    let elementsConst = this.getDataTransformed(graphData);

    // Layout configurations
    const layout = {
      name: "cose-bilkent",
      nodeDimensionsIncludeLabels: true,
      gravityRange: 1.25,
      ready: function () { },
      stop: function () { },
      animate: true,
      animationEasing: undefined,
      animationDuration: undefined,
      animateFilter: function (node, i) {
        return true;
      },
      animationThreshold: 250,
      refresh: 20,
      nestingFactor: 1.2,
      coolingFactor: 0.99,
      minTemp: 1.0,
    };

    var autoDragOptions = {
      enabled: true,
      selector: "node",
      speed: 1,
    };

    // Return function returns the graph visualization
    // with dynamic data from props
    if (elementsConst.length >= 1) {
      return (
        <div
          className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
          id="officerColumn1"
        >
          <div className="row">
            {!this.props.searchActivated &&
              !this.props.editDetails &&
              !this.props.showNewNode && (
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-2 col-xl-2 custom-body-bg custom-full-height d-flex flex-column flex-md-row flex-lg-column">
                  {/* For FRACAdmin role */}
                  {this.state.roles &&
                    JSON.stringify(this.state.roles).includes("FRAC_ADMIN") && (
                      <div className="">
                        <div className="btn-group w-100 mt-3">
                          <button
                            type="button"
                            className="btn mb-3 custom-dropdown-menu-4 col-12"
                          >
                            {this.props.currentDept}
                          </button>
                          <button
                            type="button"
                            className="btn dropdown-toggle dropdown-toggle-split mb-3 custom-dropdown-toggle-menu-1"
                            id="dropdownMenuDepartment"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <span className="sr-only">Toggle Dropdown</span>
                          </button>

                          <div
                            className="dropdown-menu right-dropdown-menu-1 col-12"
                            role="menu"
                            aria-labelledby="dropdownMenuDepartment"
                          >
                            <div className="row col-12 p-0 ml-1">
                              <div className="col-9 " id="officerBucketsList">
                                <input
                                  type="text"
                                  style={{ width: "133%" }}
                                  className="form-control mb-3 custom-search-5"
                                  placeholder="Search..."
                                  aria-label="Search"
                                  id="deptSearch"
                                  onKeyUp={this.searchForDeptExplore}
                                  aria-describedby="basic-addon1"
                                  autoComplete="off"
                                />
                              </div>
                              <div className="col-3">
                                {this.state.clearSearch && (
                                  <span
                                    className="material-icons competency-area-close-button"
                                    onClick={() => {
                                      this.setState(
                                        {
                                          clearSearchInput: true,
                                        },
                                        () => {
                                          document.getElementById(
                                            "deptSearch"
                                          ).value = "";
                                          this.searchForDeptExplore();
                                        }
                                      );
                                    }}
                                  >
                                    close
                                  </span>
                                )}
                              </div>
                            </div>

                            <div id="deptList">
                              <button
                                type="button"
                                className="dropdown-item p-1 custom-dropdown-item"
                                onClick={() => {
                                  this.props.getSelectedDept("All MDO");
                                }}
                              >
                                All MDO
                              </button>
                              {this.props.allDepts &&
                                this.props.allDepts.map((value, index) => {
                                  return (
                                    <button
                                      type="button"
                                      key={value.orgName}
                                      className="dropdown-item p-1 custom-dropdown-item"
                                      onClick={() => {
                                        this.props.getSelectedDept(
                                          value.orgName
                                        );
                                      }}>
                                      {value.orgName}
                                    </button>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* For non admin roles */}
                  {this.state.roles &&
                    !JSON.stringify(this.state.roles).includes("FRAC_ADMIN") && (
                      <div className="">
                        <div className="btn-group w-100 mt-3">
                          <button
                            type="button"
                            className="btn mb-3 custom-dropdown-menu-4 col-12"
                          >
                            {this.props.currentDept}
                          </button>
                        </div>
                      </div>
                    )}

                  <button
                    type="button"
                    className={`btn position-border-1 mr-3 mt-3 mb-2 text-align-left fit-content-width ${this.state.toggle && this.state.selectedItem === "PID"
                        ? "save-button-no-border save-button-with-border"
                        : "save-button-no-border"
                      }`}
                    onClick={() =>
                      this.setState(
                        {
                          selectedItem: "PID",
                        },
                        () => {
                          this.toggleSwitch();
                        }
                      )
                    }
                  >
                    Positions
                  </button>
                  <button
                    type="button"
                    className={`btn role-border-1 mr-3 mt-3 mb-2 text-align-left fit-content-width ${this.state.toggle && this.state.selectedItem === "RID"
                        ? "save-button-no-border save-button-with-border"
                        : "save-button-no-border"
                      }`}
                    onClick={() =>
                      this.setState(
                        {
                          selectedItem: "RID",
                        },
                        () => {
                          this.toggleSwitch();
                        }
                      )
                    }
                  >
                    Roles
                  </button>
                  <button
                    type="button"
                    className={`btn activity-border-1 mr-3 mt-3 mb-2 text-align-left fit-content-width ${this.state.toggle && this.state.selectedItem === "AID"
                        ? "save-button-no-border save-button-with-border"
                        : "save-button-no-border"
                      }`}
                    onClick={() =>
                      this.setState(
                        {
                          selectedItem: "AID",
                        },
                        () => {
                          this.toggleSwitch();
                        }
                      )
                    }
                  >
                    Activities
                  </button>
                  <button
                    type="button"
                    className={`btn competency-border-1 mr-3 mt-3 mb-2 text-align-left fit-content-width ${this.state.toggle && this.state.selectedItem === "CID"
                        ? "save-button-no-border save-button-with-border"
                        : "save-button-no-border"
                      }`}
                    onClick={() => {
                      this.toggleSwitch();
                      this.setState({
                        selectedItem: "CID",
                      });
                    }}
                  >
                    Competencies
                  </button>
                  <button
                    type="button"
                    className={`btn kr-border-1 mr-3 mt-3 mb-2 text-align-left fit-content-width ${this.state.toggle && this.state.selectedItem === "KRID"
                        ? "save-button-no-border save-button-with-border"
                        : "save-button-no-border"
                      }`}
                    onClick={() => {
                      this.toggleSwitch();
                      this.setState({
                        selectedItem: "KRID",
                      });
                    }}
                  >
                    Knowledge Resource
                  </button>
                </div>
              )}

            {this.props.searchActivated &&
              !this.props.editDetails &&
              !this.props.showNewNode && (
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-2 col-xl-2 custom-full-height custom-body-bg-2">
                  <div className="d-flex flex-column flex-md-row flex-lg-column">
                    <button
                      type="button"
                      className="save-button btn position-border-1 mr-3 mt-3 mb-2 text-align-left fit-content-width"
                    >
                      Positions
                    </button>
                    <button
                      type="button"
                      className="save-button btn role-border-1 mr-3 mt-3 mb-2 text-align-left fit-content-width"
                    >
                      Roles
                    </button>
                    <button
                      type="button"
                      className="save-button btn activity-border-1 mr-3 mt-3 mb-2 text-align-left fit-content-width"
                    >
                      Activities
                    </button>
                    <button
                      type="button"
                      className="save-button btn competency-border-1 mr-3 mt-3 mb-2 text-align-left fit-content-width"
                    >
                      Competencies
                    </button>
                    <button
                      type="button"
                      className="save-button btn kr-border-1 mr-3 mt-3 mb-2 text-align-left fit-content-width"
                    >
                      Knowledge Resource
                    </button>
                  </div>
                  <hr></hr>
                  {this.props.graphData &&
                    !this.props.editDetails &&
                    !this.props.showNewNode && (
                      <div className="mt-3 custom-search-list">
                        {this.props.graphData.dataNodes.map((value, index) => {
                          if (value.type === "POSITION") {
                            return (
                              <div
                                key={value.id}
                                className="pl-3 pt-3 mr-1 position-border-1 pb-2"
                              >
                                <h3>{value.name}</h3>
                                <p className="custom-sub-heading-1">
                                  {value.id}
                                </p>
                              </div>
                            );
                          } else if (value.type === "ROLE") {
                            return (
                              <div
                                key={value.id}
                                className="pl-3 pt-3 mr-1 role-border-1 pb-2"
                              >
                                <h3>{value.name}</h3>
                                <p className="custom-sub-heading-1">
                                  {value.id}
                                </p>
                              </div>
                            );
                          } else if (value.type === "COMPETENCY") {
                            return (
                              <div
                                key={value.id}
                                className="pl-3 pt-3 mr-1 competency-border-1 pb-2"
                              >
                                <h3>{value.name}</h3>
                                <p className="custom-sub-heading-1">
                                  {value.id}
                                </p>
                              </div>
                            );
                          } else if (value.type === "ACTIVITY") {
                            return (
                              <div
                                key={value.id}
                                className="pl-3 pt-3 mr-1 activity-border-1 pb-2"
                              >
                                <h3>{value.name}</h3>
                                <p className="custom-sub-heading-1">
                                  {value.id}
                                </p>
                              </div>
                            );
                          } else if (value.type === "KNOWLEDGERESOURCE") {
                            return (
                              <div
                                key={value.id}
                                className="pl-3 pt-3 mr-1 kr-border-1 pb-2"
                              >
                                <h3>{value.name}</h3>
                                <p className="custom-sub-heading-1">
                                  {value.id}
                                </p>
                              </div>
                            );
                          } else {
                            return (
                              <div
                                key={value.id}
                                className="pl-3 pt-3 mr-1 pb-2"
                              >
                                <h3>{value.name}</h3>
                                <p className="custom-sub-heading-1">
                                  {value.id}
                                </p>
                              </div>
                            );
                          }
                        })}
                      </div>
                    )}
                  {!this.props.graphData &&
                    !this.props.editDetails &&
                    !this.props.showNewNode && (
                      <div>
                        <center>No results found</center>
                      </div>
                    )}
                </div>
              )}

            {this.props.editDetails &&
              !this.props.searchActivated &&
              !this.props.showNewNode && (
                <EditView
                  {...this.props}
                  rightColumnEnabled={this.state.showRightColumn}
                  selectedItem={this.state.getSelectedType}
                  styleClassName={this.state.borderStyleClass}
                  selectedID={this.state.getSelectedID}
                ></EditView>
              )}

            {!this.props.editDetails &&
              !this.props.searchActivated &&
              this.props.showNewNode && <NewNode {...this.props}></NewNode>}

            <div
              className={` ${this.props.editDetails && !this.props.searchActivated
                  ? "col-xs-12 col-sm-12 col-md-12 col-lg-9 col-xl-9"
                  : "col-xs-12 col-sm-12 col-md-12 col-lg-10 col-xl-10"
                }`}
            >
              <CytoscapeComponent
                layout={layout}
                className="col-12 mt-3"
                elements={elementsConst}
                stylesheet={[
                  {
                    selector: "node",
                    style: {
                      label: "data(label)",
                      "font-size": 8,
                      width: 15,
                      height: 15,
                    },
                  },
                  {
                    selector: "edge",
                    style: {
                      width: 0.5,
                    },
                  },
                  {
                    selector: "node.highlight",
                    style: {

                    },
                  },
                  {
                    selector: "node.semitransp",
                    style: { opacity: "0.3" },
                  },
                  {
                    selector: "edge.highlight",
                    style: { "mid-target-arrow-color": "#FFF" },
                  },
                  {
                    selector: "edge.semitransp",
                    style: { opacity: "0.1" },
                  },
                ]}
                style={{
                  width: "100vw",
                  height: "80vh",
                }}
                cy={(cy) => {
                  this.cy = cy;
                  cy.autopanOnDrag(autoDragOptions);
                  cy.on("click", "node", (e) => {
                    this.highlightNodes(e);
                  });
                  cy.on("click", "node", (e) =>
                    this.setState({
                      clearTarget: e,
                    })
                  );
                }}
              />

              <div className="row justify-content-center">
                {this.state.showCS && (
                  <button
                    type="button"
                    className="btn clear-selection-button-1 custom-primary-button"
                    onClick={() => {
                      this.clearSelection(this.state.clearTarget.target);
                    }}
                  >
                    Clear Selection
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 bordered custom-full-height-4 custom-body-bg">
          <div className="vertical-center d-none d-sm-block" id="emptyState">
            <center>
              <h1 className="pb-2">No results found</h1>
            </center>
          </div>
        </div>
      );
    }
  }
}

export default GraphVisualization;
