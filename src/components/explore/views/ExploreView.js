import React from "react";

class ExploreView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: "",
      toggle: false,
      zoomToggle: false,
      createNewItem: false,
      searchViewActivated: false,
      editDetails: false,
    };
    this.toggleSwitch = this.toggleSwitch.bind(this);
  }

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

  render() {
    return (
      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-2 col-xl-2 custom-body-bg custom-full-height">
        <button
          type="button"
          className={`btn position-border-1 mr-3 mt-3 mb-2 text-align-left mr-xs-3 mr-sm-3 mr-md-3 mr-lg-3 mr-lg-5 ${
            this.state.toggle && this.state.selectedItem === "PID"
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
          className={`btn role-border-1 mr-3 mt-2 mb-2 text-align-left mr-xs-3 mr-sm-3 mr-md-3 mr-lg-3 mr-lg-5 ${
            this.state.toggle && this.state.selectedItem === "RID"
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
          className={`btn activity-border-1 mr-3 mt-2 mb-2 text-align-left ${
            this.state.toggle && this.state.selectedItem === "AID"
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
          className={`btn competency-border-1 mr-3 mt-2 mb-2 text-align-left ${
            this.state.toggle && this.state.selectedItem === "CID"
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
          className={`btn kr-border-1 mr-3 mt-2 mb-2 text-align-left ${
            this.state.toggle && this.state.selectedItem === "KRID"
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
    );
  }
}

export default ExploreView;
