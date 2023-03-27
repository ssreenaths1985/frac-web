import React from "react";
import { MasterService } from "../../../services/master.service";
import Notify from "../../../helpers/notify";
import { APP } from "../../../constants";

class NewNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        name: "",
        description: "",
      },
      selectedType: "",
      letterCount: 200,
      enableSave: false,
    };
    this.getLetterCount = this.getLetterCount.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  // Text character counter
  getLetterCount = (event) => {
    if (event.target.name === "description") {
      this.setState({
        letterCount: 200 - this.state.data.description.length,
      });
    }
  };

  onChange = (e) => {
    e.preventDefault();
    let onlyAlphabet = /^[/+#\-_()., A-Za-z ]*$/;

    switch (e.target.name) {
      case "label":
        if (!onlyAlphabet.test(e.target.value)) {
          return false;
        }
        this.setState(
          {
            data: {
              ...this.state.data,
              name: e.target.value,
            },
          },
          () => {
            if (this.state.selectedType && this.state.data.description.length > 0) {
              this.setState({
                enableSave: true,
              });
            }

            if(this.state.data.name.length === 0) {
              this.setState({
                enableSave: false,
              });
            }
          }
        );
        break;
      case "description":
        if (!onlyAlphabet.test(e.target.value)) {
          return false;
        }
        this.setState(
          {
            data: {
              ...this.state.data,
              description: e.target.value,
            },
          },
          () => {
            if (
              this.state.selectedType &&
              this.state.selectedType !== "ACTIVITY" &&
              this.state.data.name.length > 0
            ) {
              this.setState({
                enableSave: true,
              });
            } 

            if (
              this.state.selectedType &&
              this.state.selectedType === "ACTIVITY" &&
              this.state.data.description.length > 0
            ) {
              this.setState({
                enableSave: true,
              });
            } 

            if(this.state.data.description.length === 0) {
              this.setState({
                enableSave: false,
              });
            }
          }
        );
        break;
      default:
        break;
    }
  };

  createNew = (e) => {
    // To submit/save the position details
    e.preventDefault();
    let payload = {
      name: this.state.data.name,
      source: "FRAC",
      description: this.state.data.description,
      type: this.state.selectedType,
    };
    if (!this.state.selectedType) {
      Notify.dark("Select an item type");
    }

    MasterService.addDataNode(payload).then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        Notify.dark("Created new node successfully");
        this.setState({
          enableSave: false,
        });
        this.props.history.push({
          pathname: "/explore",
        });
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  render() {
    return (
      <div
        className="col-xs-12 col-sm-12 col-md-12 col-lg-2 col-xl-2 custom-full-height-explore custom-body-bg-2 "
        id="editColumn"
      >
        <form onSubmit={this.createNew}>
          <div className="d-flex flex-column flex-md-row flex-lg-column">
            <h3 className="mt-3">Item type</h3>
            <button
              type="button"
              className={`btn position-border-1 mr-3 mt-3 text-align-left fit-content-width ${
                this.state.selectedType === "POSITION"
                  ? "custom-button-2-selected"
                  : "custom-button-2"
              }`}
              onClick={() => {
                this.setState({
                  selectedType: "POSITION",
                });
              }}
            >
              Positions
            </button>
            <button
              type="button"
              className={`btn role-border-1 mr-3 mt-3 text-align-left fit-content-width ${
                this.state.selectedType === "ROLE"
                  ? "custom-button-2-selected"
                  : "custom-button-2"
              }`}
              onClick={() => {
                this.setState({
                  selectedType: "ROLE",
                });
              }}
            >
              Roles
            </button>
            <button
              type="button"
              className={`btn activity-border-1 mr-3 mt-3 text-align-left fit-content-width ${
                this.state.selectedType === "ACTIVITY"
                  ? "custom-button-2-selected"
                  : "custom-button-2"
              }`}
              onClick={() => {
                this.setState({
                  selectedType: "ACTIVITY",
                });
              }}
            >
              Activities
            </button>
            <button
              type="button"
              className={`btn competency-border-1 mr-3 mt-3 text-align-left fit-content-width ${
                this.state.selectedType === "COMPETENCY"
                  ? "custom-button-2-selected"
                  : "custom-button-2"
              }`}
              onClick={() => {
                this.setState({
                  selectedType: "COMPETENCY",
                });
              }}
            >
              Competencies
            </button>
            <button
              type="button"
              className={`btn kr-border-1 mr-3 mb-2 mt-3 text-align-left fit-content-width ${
                this.state.selectedType === "KNOWLEDGERESOURCE"
                  ? "custom-button-2-selected"
                  : "custom-button-2"
              }`}
              onClick={() => {
                this.setState({
                  selectedType: "KNOWLEDGERESOURCE",
                });
              }}
            >
              Knowledge Resource
            </button>
          </div>
          <hr></hr>
          <div className="" id="masterColumn3">
            <label>ID</label>
            <div className="col-xs-12 col-sm-12 col-md-11 col-lg-11 col-xl-11 p-0 mb-2">
              <input
                type="text"
                id="expertID"
                className="form-control"
                placeholder="ID"
                aria-label="id"
                value={this.state.data.id}
                aria-describedby="basicId"
                disabled
              />
            </div>
            {this.state.selectedType !== "ACTIVITY" && (
              <>
                <label className="mt-3">Label</label>
                <div className="col-xs-12 col-sm-12 col-md-11 col-lg-11 col-xl-11 p-0 mb-3">
                  <input
                    type="text"
                    id="label"
                    className="form-control"
                    placeholder="Label"
                    aria-label="label"
                    aria-describedby="basicLabel"
                    name="label"
                    value={this.state.data.name}
                    onChange={this.onChange}
                    autoComplete="off"
                    onKeyUp={(event) => {}}
                    required
                  />
                </div>
              </>
            )}

            <label>Description</label>
            <div className="col-xs-12 col-sm-12 col-md-11 col-lg-11 col-xl-11 p-0 mb-1">
              <textarea
                className="form-control no-border-radius"
                id="description"
                rows="4"
                placeholder="Description..."
                name="description"
                onChange={this.onChange}
                value={this.state.data.description}
                autoComplete="off"
                onKeyUp={(event) => {
                  this.getLetterCount(event);
                }}
                required
              ></textarea>
            </div>
            <p
              className={` ${
                this.state.letterCount < 0
                  ? "change-text-color"
                  : "change-text-color-1"
              }`}
            >
              Characters remaining: {this.state.letterCount}
            </p>
          </div>
          {this.state.enableSave && (
            <button
              type="submit"
              className="btn save-button custom-primary-button mb-3 push-bottom-4"
            >
              Submit
            </button>
          )}
          {!this.state.enableSave && (
            <button
              type="submit"
              className="btn save-button custom-primary-button-disabled mb-3 push-bottom-4"
              disabled
            >
              Submit
            </button>
          )}
        </form>
      </div>
    );
  }
}

export default NewNode;
